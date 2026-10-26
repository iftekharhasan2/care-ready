import { useState } from 'react';
import HeroBanner from '../../components/HeroBanner.jsx';
import EmergencyButton from '../../components/EmergencyButton.jsx';
import EmergencyList from '../../components/EmergencyList.jsx';
import clinicImg from '../../assets/role-clinic.svg';
import Panel from '../../components/Panel.jsx';
import MetricTile from '../../components/MetricTile.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx, toLatin } from '../../utils/bn.js';
import { auditTrail, clinicMetrics, clinicQueue, idFor, missingRequests, queueStatus } from '../../utils/data.js';

const FILTERS = [['all', 'সব'], ['review', 'যাচাই বাকি'], ['missing', 'তথ্য অনুপস্থিত'], ['ready', 'প্রস্তুত']];

export default function ClinicPage({ notify, goTo, emergencies, emergencyActions, orders, tele }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState('q1');
  const [requests, setRequests] = useState(missingRequests);

  const [query, setQuery] = useState('');
  const q = toLatin(query).trim().toLowerCase();
  const rows = clinicQueue.filter((r) => (filter === 'all' || r.status === filter) && (!q || r.name.includes(query.trim()) || toLatin(idFor(r.name)).toLowerCase().includes(q)));
  const current = clinicQueue.find((r) => r.id === active);

  const send = (id) => {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, sent: true } : r)));
    notify('রোগীর ফোনে বাংলায় অনুরোধ পাঠানো হয়েছে (ডেমো)।');
  };

  return (
    <>
      <HeroBanner eyebrow="সবুজবাগ মেডিকেল চেম্বার · শনিবার, ১০ অক্টোবর ২০২৬" title="আজ ১২টি রেকর্ড ফাইল, ৭টি প্রস্তুত" lead="৩ জন রোগীর কাছে তথ্য চাওয়া বাকি। সাক্ষাতের আগে পাঠালে পুনর্নির্ধারণ কমে।" image={clinicImg} alt="সমন্বয়কারী ও রোগীর তালিকার ছবি">
        <button type="button" className="btn btn--light" onClick={() => notify('নিরাপদ ইনটেক লিংক তৈরি হয়েছে (ডেমো)।')}><Icon name="link" size={16} /> রোগীকে ইনটেক লিংক দিন</button>
        <button type="button" className="btn btn--outline" onClick={() => goTo('verify')}>যাচাই সারি দেখুন <Icon name="arrow" size={16} /></button>
      </HeroBanner>

      <div className="metrics">
        {clinicMetrics.map((m, i) => (<MetricTile key={m.label} {...m} icon={['packet', 'clock', 'check', 'alert'][i]} />))}
      </div>
      <p className="footnote">উপরের লক্ষ্যগুলো পাইলটের অনুমান। আসল ফলাফল দিয়ে বদলানো হবে।</p>

      <Panel title="জরুরি সাক্ষাৎ" hint="অবস্থা খারাপ হলে ভিডিও, সম্মতি বা পরীক্ষার রিপোর্টের অপেক্ষা ছাড়াই সাক্ষাৎ ঠিক করুন। কারণ ও সময় অডিট তালিকায় লেখা থাকে।" action={<EmergencyButton notify={notify} emergencyActions={emergencyActions} orders={orders} tele={tele} />}>
        <EmergencyList role="clinic" emergencies={emergencies} emergencyActions={emergencyActions} notify={notify} />
      </Panel>

      <div className="grid-2 grid-2--wide-left">
        <Panel title="অপেক্ষমাণ তালিকা" action={
          <div className="segmented" role="tablist" aria-label="অবস্থা অনুযায়ী বাছুন">
            {FILTERS.map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={filter === key} className={cx(filter === key && 'is-active')} onClick={() => setFilter(key)}>{label}</button>
            ))}
          </div>
        }>
          <label className="field" htmlFor="queue-search">
            <span>নাম বা রোগী আইডি দিয়ে খুঁজুন</span>
            <span className="brand-lookup__input"><Icon name="search" size={16} /><input id="queue-search" type="text" placeholder="যেমন: রহিমা বা CR-P-০০৪১৭" value={query} onChange={(e) => setQuery(e.target.value)} /></span>
          </label>
          <div className="table-wrap">
            <table className="table table--queue">
              <thead><tr><th>সময়</th><th>রোগী</th><th>বিভাগ</th><th>ফাইল</th><th>অবস্থা</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className={cx('is-clickable', active === r.id && 'is-linked')} onClick={() => setActive(r.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActive(r.id)}>
                    <td className="num">{r.time}</td>
                    <td><strong>{r.name}</strong> <code className="id">{idFor(r.name)}</code><small className="table__note">{r.age} বছর · {r.note}</small></td>
                    <td>{r.dept}</td>
                    <td className="num">{r.docs}</td>
                    <td><StatusPill tone={queueStatus[r.status].tone}>{queueStatus[r.status].label}</StatusPill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="stack">
          <Panel title={current.name} hint={`${idFor(current.name)} · ${current.dept} · ${current.time} · ${current.docs}টি ফাইল`} action={<StatusPill tone={queueStatus[current.status].tone}>{queueStatus[current.status].label}</StatusPill>}>
            <h3 className="sub">রোগীর কাছে যা চাওয়া দরকার</h3>
            <ul className="rows">
              {requests.map((r) => (
                <li key={r.id}>
                  <Icon name="message" size={17} />
                  <div><strong>{r.text}</strong></div>
                  {r.sent ? <StatusPill tone="info">পাঠানো হয়েছে</StatusPill> : <button type="button" className="btn btn--small" onClick={() => send(r.id)}>অনুরোধ পাঠান</button>}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--primary btn--block" onClick={() => notify(`${current.name}-এর রেকর্ড ফাইল ডাক্তারের তালিকায় পাঠানো হয়েছে (ডেমো)।`)}><Icon name="send" size={16} /> ডাক্তারের জন্য প্রস্তুত চিহ্নিত করুন</button>
          </Panel>

          <Panel title="অডিট তালিকা" hint={`সর্বশেষ ${bn(auditTrail.length)}টি ঘটনা`}>
            <ul className="log">
              {auditTrail.map((a) => (
                <li key={a.when + a.who}><span className="log__when">{a.when}</span><span><strong>{a.who}</strong> {a.what}</span></li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
