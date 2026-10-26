import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import TestItem from '../../components/TestItem.jsx';
import TestGate from '../../components/TestGate.jsx';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import EmergencyList from '../../components/EmergencyList.jsx';
import WhoTag from '../../components/WhoTag.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { patient } from '../../utils/data.js';
import { testsReady } from '../../utils/tests.js';

export default function TestsPage({ notify, goTo, tele, orders, orderActions, emergencies }) {
  const urgent = emergencies.filter((e) => e.patient === patient.name);
  const order = orders.find((o) => o.patient === patient.name);

  if (!order) {
    return (
      <>
        <PageHeader eyebrow="পরীক্ষা" title="ডাক্তারের দেওয়া পরীক্ষা" lead="ডাক্তার কোনো পরীক্ষা দিলে তা এখানে দেখাবে।" />
        <div className="locked"><Icon name="flask" size={28} /><h2>এখন কোনো পরীক্ষা বাকি নেই</h2><p>ডাক্তার পরীক্ষা দিলে ক্লিনিক সময় ঠিক করে আপনাকে জানাবে।</p></div>
      </>
    );
  }

  const ready = testsReady(order);
  const slot = order.followup?.slotId && tele.slots.find((s) => s.id === order.followup.slotId);
  const mark = (it, changes, message) => { orderActions.item(order.id, it.id, changes); notify(message); };

  return (
    <>
      <PageHeader eyebrow="পরীক্ষা" title="ডাক্তারের দেওয়া পরীক্ষা" lead="ক্লিনিক প্রতিটি পরীক্ষার সময় ঠিক করে দেয়। সব জরুরি পরীক্ষার রিপোর্ট আপলোড হলে তবেই দ্বিতীয় সাক্ষাৎ নেওয়া যায়।" />

      <div className="grid-2 grid-2--wide-left">
        <Panel title="আপনার পরীক্ষা" hint={`পরামর্শ দিয়েছেন ${order.doctor}, ${order.date}`}>
          <p className="test-note"><Icon name="message" size={15} /> {order.note}</p>
          <ul className="tests">
            {order.items.map((it) => (
              <TestItem key={it.id} item={it}>
                {it.status === 'ordered' && <span className="muted">ক্লিনিক ল্যাব ও সময় ঠিক করে আপনাকে জানাবে।</span>}
                {it.status === 'scheduled' && <button type="button" className="btn btn--ghost" onClick={() => mark(it, { status: 'done' }, 'লেখা হয়েছে যে পরীক্ষাটি করিয়েছেন। রিপোর্ট পেলে আপলোড করুন।')}><Icon name="check" size={16} /> পরীক্ষা করিয়েছি</button>}
                {it.status === 'done' && <button type="button" className="btn btn--primary" onClick={() => mark(it, { status: 'reported', by: 'রোগী' }, 'রিপোর্ট আপলোড হয়েছে। একজন মানুষ মিলিয়ে দেখে রেকর্ড ফাইলে যোগ করবেন। (ডেমো)')}><Icon name="camera" size={16} /> রিপোর্টের ছবি আপলোড করুন</button>}
                {it.status === 'reported' && <button type="button" className="link-btn" onClick={() => goTo('record')}>রেকর্ড ফাইলে দেখুন <Icon name="arrow" size={14} /></button>}
              </TestItem>
            ))}
          </ul>
        </Panel>

        <div className="stack">
          <Panel title="দ্বিতীয় সাক্ষাৎ" hint={<>ডাক্তার: <WhoTag name={order.doctor} /></>} action={order.followup && <StatusPill tone={order.followup.status === 'confirmed' ? 'good' : 'stamp'}>{order.followup.status === 'confirmed' ? 'সময় ঠিক হয়েছে' : 'ক্লিনিক সময় ঠিক করছে'}</StatusPill>}>
            {urgent.length > 0 && <EmergencyList role="patient" emergencies={urgent} notify={notify} />}
            <TestGate order={order} />
            {!order.followup && (
              <button type="button" className="btn btn--primary btn--block" disabled={!ready} onClick={() => { orderActions.followup(order.id, { status: 'requested' }); notify('দ্বিতীয় সাক্ষাতের আবেদন ক্লিনিকে গেছে। সময় ঠিক হলে জানানো হবে।'); }}>
                <Icon name={ready ? 'calendar' : 'lock'} size={16} /> দ্বিতীয় সাক্ষাতের আবেদন করুন
              </button>
            )}
            {order.followup?.status === 'requested' && <p className="footnote"><Icon name="clock" size={14} /> সব রিপোর্ট এসেছে। ক্লিনিক ডাক্তারের সময়সূচি দেখে সময় ঠিক করছে।</p>}
            {slot && <AppointmentCard slot={slot} title={order.doctor} sub="পরীক্ষার রিপোর্ট নিয়ে দ্বিতীয় সাক্ষাৎ" onJoin={() => notify('ডেমোতে মিট খোলে না।', 'warn')} />}
            {!ready && <p className="footnote">রিপোর্ট ছাড়া সাক্ষাৎ হলে ডাক্তার সিদ্ধান্ত নিতে পারেন না, আবার আসতে হয়। তাই এই নিয়ম।</p>}
          </Panel>
          <p className="footnote footnote--crit"><Icon name="alert" size={14} /> অবস্থা খারাপ হলে রিপোর্টের অপেক্ষা নয়: ৯৯৯ এ ফোন করুন বা বার্তায় ডাক্তারকে জানান। ডাক্তার চাইলে কোনো পরীক্ষা ঐচ্ছিক করে দিতে পারেন।</p>
        </div>
      </div>
    </>
  );
}
