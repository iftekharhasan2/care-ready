import HeroBanner from '../../components/HeroBanner.jsx';
import EmergencyList from '../../components/EmergencyList.jsx';
import Panel from '../../components/Panel.jsx';
import MetricTile from '../../components/MetricTile.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import doctorImg from '../../assets/role-doctor.svg';
import { approvalsSeed, doctorSchedule, doctorStats, idFor, queueStatus } from '../../utils/data.js';

export default function DoctorHome({ goTo, notify, emergencies, emergencyActions }) {
  const open = (p) => (p.id === 'p1' ? goTo('review') : notify('ডেমোতে শুধু রহিমা বেগমের রেকর্ড ফাইল খোলা যায়।', 'warn'));

  return (
    <>
      <HeroBanner eyebrow="শনিবার, ১০ অক্টোবর ২০২৬" title="আজ ৬ জন রোগী, ৪টি রেকর্ড ফাইল প্রস্তুত" lead="প্রথম রোগী সকাল ১০:৩০। তাঁর রেকর্ড ফাইলে ২টি তথ্য এখনো যাচাই হচ্ছে, বাকি সব উৎসসহ তৈরি।" image={doctorImg} alt="স্টেথোস্কোপ গলায় ডাক্তার ও সিলমারা রেকর্ড ফাইলের ছবি">
        <button type="button" className="btn btn--light" onClick={() => goTo('review')}>প্রথম রেকর্ড ফাইল খুলুন <Icon name="arrow" size={16} /></button>
        <button type="button" className="btn btn--outline" onClick={() => goTo('approvals')}>৩টি সিদ্ধান্ত বাকি</button>
      </HeroBanner>

      {emergencies.length > 0 && (
        <Panel title="ক্লিনিকের দেওয়া জরুরি সাক্ষাৎ" hint="এগুলো সাধারণ ধাপের বাইরে ঠিক করা হয়েছে। দেখে নিশ্চিত করুন।">
          <EmergencyList role="doctor" emergencies={emergencies} emergencyActions={emergencyActions} notify={notify} />
        </Panel>
      )}

      <div className="metrics">
        {doctorStats.map((m, i) => (<MetricTile key={m.label} {...m} icon={['family', 'packet', 'clock', 'follow'][i]} />))}
      </div>

      <div className="grid-2 grid-2--wide-left">
        <Panel title="আজকের সময়সূচি" hint="রেকর্ড ফাইল প্রস্তুত থাকলে সাক্ষাতের আগেই পড়ে নেওয়া যায়।">
          <ul className="sched">
            {doctorSchedule.map((p) => (
              <li key={p.id}>
                <button type="button" className="sched__row" onClick={() => open(p)}>
                  <span className="sched__time num">{p.time}</span>
                  <Avatar kind={p.avatar} name={p.name} />
                  <span className="sched__who"><strong>{p.name}, {p.age} <code className="id">{idFor(p.name)}</code></strong><span className="muted">{p.reason}</span></span>
                  <StatusPill tone={queueStatus[p.status].tone}>{queueStatus[p.status].label}</StatusPill>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="আপনার সিদ্ধান্তের অপেক্ষায়" action={<button type="button" className="link-btn" onClick={() => goTo('approvals')}>সব দেখুন <Icon name="arrow" size={14} /></button>}>
          <ul className="rows">
            {approvalsSeed.map((a) => (
              <li key={a.id}>
                <Avatar kind={a.avatar} name={a.patient} />
                <div><strong>{a.title}</strong><span className="muted">{a.patient} · {idFor(a.patient)}</span></div>
                <StatusPill tone={a.tone} dot={false}>{a.kind}</StatusPill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
