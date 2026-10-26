import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import TestItem from '../../components/TestItem.jsx';
import TestGate from '../../components/TestGate.jsx';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import EmergencyButton from '../../components/EmergencyButton.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { idFor, slotKind, testCollect, testLabs, testTimes } from '../../utils/data.js';
import { reportedCount, requiredItems, testsReady } from '../../utils/tests.js';

export default function TestDeskPage({ notify, tele, orders, orderActions, slotOwner, emergencyActions }) {
  const [activeId, setActiveId] = useState(orders[0]?.id);
  const [plan, setPlan] = useState({});
  const order = orders.find((o) => o.id === activeId) ?? orders[0];
  const toArrange = orders.reduce((n, o) => n + o.items.filter((it) => it.status === 'ordered').length, 0);
  const ready = order && testsReady(order);
  const slot = order?.followup?.slotId && tele.slots.find((s) => s.id === order.followup.slotId);
  const free = tele.slots.filter((s) => s.open && !slotOwner(s.id));

  const planFor = (id) => ({ lab: testLabs[0], when: testTimes[0], collect: testCollect[0], ...plan[id] });
  const setField = (id, key) => (e) => setPlan((p) => ({ ...p, [id]: { ...planFor(id), [key]: e.target.value } }));
  const arrange = (it) => { orderActions.item(order.id, it.id, { status: 'scheduled', ...planFor(it.id) }); notify(`${it.name}-এর সময় ঠিক হয়েছে। রোগীকে এসএমএসে জানানো হয়েছে (ডেমো)।`); };

  return (
    <>
      <PageHeader eyebrow="পরীক্ষার ব্যবস্থা" title="ডাক্তারের দেওয়া পরীক্ষা সাজান" lead="প্রতিটি পরীক্ষার ল্যাব ও সময় ঠিক করুন, রিপোর্ট এলে আপলোড করুন। সব জরুরি রিপোর্ট না আসা পর্যন্ত দ্বিতীয় সাক্ষাতের সময় দেওয়া যায় না।">
        <StatusPill tone={toArrange ? 'stamp' : 'good'}>{toArrange ? `${bn(toArrange)}টি পরীক্ষার সময় ঠিক করা বাকি` : 'সব পরীক্ষার সময় ঠিক আছে'}</StatusPill>
      </PageHeader>

      <div className="grid-2">
        <Panel title="রোগী">
          <ul className="threads">
            {orders.map((o) => (
              <li key={o.id}>
                <button type="button" className={cx('threads__item tele-req', o.id === order?.id && 'is-active')} aria-current={o.id === order?.id} onClick={() => setActiveId(o.id)}>
                  <Avatar kind={o.patient === 'রহিমা বেগম' ? 'patient' : undefined} name={o.patient} />
                  <span><strong>{o.patient} <code className="id">{idFor(o.patient)}</code></strong><small>{o.doctor} · {o.date}</small><small>{bn(requiredItems(o).length)}টি জরুরি পরীক্ষার {bn(reportedCount(o))}টির রিপোর্ট এসেছে</small></span>
                  <StatusPill tone={testsReady(o) ? 'good' : 'warn'} dot={false}>{testsReady(o) ? 'রিপোর্ট সম্পূর্ণ' : 'রিপোর্ট বাকি'}</StatusPill>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {order && (
          <div className="stack">
            <Panel title={`${order.patient}-এর পরীক্ষা`} hint={`${idFor(order.patient)} · ${order.note}`}>
              <ul className="tests">
                {order.items.map((it) => (
                  <TestItem key={it.id} item={it}>
                    {it.status === 'ordered' && (
                      <div className="arrange">
                        <label className="field" htmlFor={`lab-${it.id}`}><span>ল্যাব</span><select id={`lab-${it.id}`} value={planFor(it.id).lab} onChange={setField(it.id, 'lab')}>{testLabs.map((l) => (<option key={l}>{l}</option>))}</select></label>
                        <label className="field" htmlFor={`when-${it.id}`}><span>সময়</span><select id={`when-${it.id}`} value={planFor(it.id).when} onChange={setField(it.id, 'when')}>{testTimes.map((t) => (<option key={t}>{t}</option>))}</select></label>
                        <label className="field" htmlFor={`collect-${it.id}`}><span>নমুনা</span><select id={`collect-${it.id}`} value={planFor(it.id).collect} onChange={setField(it.id, 'collect')}>{testCollect.map((c) => (<option key={c}>{c}</option>))}</select></label>
                        <button type="button" className="btn btn--primary" onClick={() => arrange(it)}><Icon name="calendar" size={16} /> সময় ঠিক করুন</button>
                      </div>
                    )}
                    {it.status === 'scheduled' && <button type="button" className="btn btn--ghost" onClick={() => { orderActions.item(order.id, it.id, { status: 'done' }); notify('লেখা হয়েছে যে পরীক্ষাটি হয়েছে। রিপোর্টের অপেক্ষা।'); }}><Icon name="check" size={16} /> পরীক্ষা হয়েছে</button>}
                    {it.status === 'done' && <button type="button" className="btn btn--primary" onClick={() => { orderActions.item(order.id, it.id, { status: 'reported', by: 'ল্যাব' }); notify('ল্যাবের রিপোর্ট আপলোড হয়েছে। রোগী ও ডাক্তার দেখতে পাবেন (ডেমো)।'); }}><Icon name="upload" size={16} /> ল্যাবের রিপোর্ট আপলোড করুন</button>}
                  </TestItem>
                ))}
              </ul>
            </Panel>

            <Panel title="দ্বিতীয় সাক্ষাৎ" action={<StatusPill tone={order.followup?.status === 'confirmed' ? 'good' : order.followup ? 'stamp' : 'neutral'}>{order.followup?.status === 'confirmed' ? 'সময় ঠিক হয়েছে' : order.followup ? 'রোগী আবেদন করেছেন' : 'রোগী আবেদন করেননি'}</StatusPill>}>
              <TestGate order={order} />
              {slot && <AppointmentCard slot={slot} title={`${order.patient} · ${idFor(order.patient)}`} sub={`${order.doctor}-এর সাথে, রিপোর্ট নিয়ে`} onJoin={() => notify('ক্লিনিক ডেস্ক সাক্ষাতে যোগ দেয় না।', 'warn')} />}
              {order.followup?.status === 'requested' && ready && (
                <ul className="slots">
                  {free.map((s) => (
                    <li key={s.id} className="slot">
                      <div><strong>{s.day}, {s.time}</strong><span className="muted">{slotKind[s.kind]}</span></div>
                      <button type="button" className="btn btn--small" onClick={() => { orderActions.followup(order.id, { status: 'confirmed', slotId: s.id }); notify(`${order.patient}-এর দ্বিতীয় সাক্ষাৎ ঠিক হয়েছে (ডেমো)।`); }}>এই সময় দিন</button>
                    </li>
                  ))}
                  {!free.length && <li className="muted">ডাক্তারের কোনো সময় খালি নেই।</li>}
                </ul>
              )}
              {!ready && <p className="waiting"><Icon name="lock" size={18} /> সব জরুরি পরীক্ষার রিপোর্ট আপলোড না হওয়া পর্যন্ত এই রোগীকে দ্বিতীয় সাক্ষাতের সময় দেওয়া যাবে না।</p>}
              {!ready && <EmergencyButton key={order.id} patient={order.patient} label="অবস্থা খারাপ? জরুরি সাক্ষাৎ ঠিক করুন" notify={notify} emergencyActions={emergencyActions} orders={orders} tele={tele} />}
              {ready && !order.followup && <p className="waiting"><Icon name="clock" size={18} /> রিপোর্ট সম্পূর্ণ। রোগী আবেদন করলে এখানে সময় দেওয়া যাবে।</p>}
            </Panel>
          </div>
        )}
      </div>
    </>
  );
}
