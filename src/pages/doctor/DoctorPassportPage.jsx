import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import MetricTile from '../../components/MetricTile.jsx';
import HistoryTimeline from '../../components/HistoryTimeline.jsx';
import PrescriptionCard from '../../components/PrescriptionCard.jsx';
import WhoTag from '../../components/WhoTag.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx, toLatin } from '../../utils/bn.js';
import { conditionsHistory, doctorSchedule, historyEvents, historyProfile, historyStats, idFor, medications, passportAccess, patient, prescriptionsHistory, treatedBy } from '../../utils/data.js';

const TABS = { timeline: 'সময়রেখা', conditions: 'রোগ', rx: 'প্রেসক্রিপশন', doctors: 'কারা চিকিৎসা করেছেন' };

export default function DoctorPassportPage({ notify }) {
  const [activeName, setActiveName] = useState('রহিমা বেগম');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('timeline');
  const [asked, setAsked] = useState([]);

  const q = toLatin(query).trim().toLowerCase();
  const people = doctorSchedule.filter((p) => !q || p.name.includes(query.trim()) || toLatin(idFor(p.name)).toLowerCase().includes(q));
  const access = passportAccess[activeName];
  const person = doctorSchedule.find((p) => p.name === activeName);

  const ask = () => {
    setAsked((list) => [...list, activeName]);
    notify(`${activeName}-এর ফোনে অনুমতির অনুরোধ গেছে। তিনি একটি কোড দিয়ে অনুমোদন করলে ইতিহাস খুলবে।`);
  };

  return (
    <>
      <PageHeader eyebrow="রোগীর পাসপোর্ট" title="এক পাতায় পুরো চিকিৎসা ইতিহাস" lead="সব প্রেসক্রিপশন, কী কী রোগ আছে, আগে কারা চিকিৎসা করেছেন এবং পরীক্ষা ও ভর্তির বিবরণ। রোগীর অনুমতি থাকলেই খোলে।" />

      <Panel title="রোগী বাছুন">
        <label className="field" htmlFor="passport-search">
          <span>নাম বা রোগী আইডি দিয়ে খুঁজুন</span>
          <span className="brand-lookup__input"><Icon name="search" size={16} /><input id="passport-search" type="text" placeholder="যেমন: রহিমা বা CR-P-০০৪১৭" value={query} onChange={(e) => setQuery(e.target.value)} /></span>
        </label>
        <div className="pickers">
          {people.map((p) => (
            <button key={p.id} type="button" className={cx('picker', p.name === activeName && 'is-active')} aria-pressed={p.name === activeName} onClick={() => setActiveName(p.name)}>
              <Avatar kind={p.avatar} name={p.name} />
              <span><strong>{p.name}</strong><code className="id">{idFor(p.name)}</code></span>
              <Icon name={passportAccess[p.name] ? 'check' : 'lock'} size={15} />
            </button>
          ))}
          {!people.length && <p className="muted">এই নামে বা আইডিতে আপনার কোনো রোগী নেই।</p>}
        </div>
      </Panel>

      {!access ? (
        <div className="locked">
          <Icon name="lock" size={28} />
          <h2>{activeName}-এর ইতিহাস দেখার অনুমতি নেই</h2>
          <p>রোগী নিজে অনুমতি দিলে তবেই ইতিহাস খোলে। অনুমতির মেয়াদ থাকে এবং রোগী যেকোনো সময় বাতিল করতে পারেন।</p>
          {asked.includes(activeName) ? <StatusPill tone="info">অনুরোধ পাঠানো হয়েছে, রোগীর উত্তরের অপেক্ষায়</StatusPill> : <button type="button" className="btn btn--primary" onClick={ask}><Icon name="send" size={16} /> অনুমতি চেয়ে অনুরোধ পাঠান</button>}
        </div>
      ) : (
        <>
          <section className="passport-head">
            <div className="person">
              <Avatar kind={person.avatar} name={activeName} size="lg" />
              <div>
                <strong>{activeName}, {patient.age} <code className="id">{idFor(activeName)}</code></strong>
                <span className="muted">{patient.sex} · রক্তের গ্রুপ {patient.blood} · {patient.area} · {historyProfile.since}</span>
              </div>
            </div>
            <StatusPill tone="good">রোগীর অনুমতি আছে: {access.scope}, {access.until} পর্যন্ত</StatusPill>
          </section>

          <div className="metrics">
            {historyStats.map((m, i) => (<MetricTile key={m.label} {...m} icon={['alert', 'pill', 'family', 'clinic'][i]} />))}
          </div>

          <div className="desk">
            <div className="desk__work">
              <div className="segmented segmented--wide" role="tablist" aria-label="ইতিহাসের অংশ">
                {Object.entries(TABS).map(([key, label]) => (
                  <button key={key} type="button" role="tab" aria-selected={tab === key} className={cx(tab === key && 'is-active')} onClick={() => setTab(key)}>{label}</button>
                ))}
              </div>

              {tab === 'timeline' && (
                <Panel title="সময়রেখা" hint="নতুন থেকে পুরোনো। প্রতিটি ঘটনার নিচে উৎস কাগজ।">
                  <HistoryTimeline events={historyEvents} />
                </Panel>
              )}

              {tab === 'conditions' && (
                <Panel title="রোগীর যা যা রোগ আছে বা ছিল" hint={`${bn(conditionsHistory.length)}টি। কে, কবে নির্ণয় করেছেন তা পাশে।`}>
                  <ul className="conditions">
                    {conditionsHistory.map((c) => (
                      <li key={c.name}>
                        <div className="conditions__top"><strong>{c.name}</strong><StatusPill tone={c.tone}>{c.status}</StatusPill></div>
                        <span className="muted">{c.since} থেকে · নির্ণয়: <WhoTag name={c.by} /></span>
                        <span>{c.note}</span>
                        <span className={cx('history__src', c.reported && 'is-reported')}><Icon name={c.reported ? 'message' : 'link'} size={12} /> {c.src}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}

              {tab === 'rx' && (
                <div className="stack">
                  {prescriptionsHistory.map((rx) => (<PrescriptionCard key={rx.id} rx={rx} />))}
                </div>
              )}

              {tab === 'doctors' && (
                <Panel title="কারা চিকিৎসা করেছেন" hint="প্ল্যাটফর্মে নিবন্ধিত চিকিৎসকের আইডি থাকে। পুরোনো কাগজের বা রোগীর বলা চিকিৎসকের আইডি থাকে না।">
                  <ul className="rows">
                    {treatedBy.map((d) => (
                      <li key={d.name}>
                        <Avatar kind={d.name === 'ডা. ফারহানা ইসলাম' ? 'doctor' : undefined} name={d.name} />
                        <div>
                          <strong><WhoTag name={d.name} /></strong>
                          <span className="muted">{d.field} · {d.place} · {d.period}</span>
                          <span className="muted">{d.role}</span>
                        </div>
                        <StatusPill tone={d.external ? 'warn' : 'neutral'} dot={false}>{d.external ? 'বাইরের চিকিৎসক' : `${d.visits} বার সাক্ষাৎ`}</StatusPill>
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>

            <div className="desk__side">
              <Panel title="এক নজরে">
                <h3 className="sub">অ্যালার্জি</h3>
                <ul className="tags">{historyProfile.allergies.map((a) => (<li key={a} className="tag--crit">{a}</li>))}</ul>
                <h3 className="sub">এখন যে ওষুধ চলছে</h3>
                <ul className="facts">
                  {medications.map((m) => (<li key={m.generic}><Icon name="pill" size={16} /> <span><strong>{m.brand}</strong> · {m.generic}, {m.dose}</span></li>))}
                </ul>
                <h3 className="sub">জরুরি যোগাযোগ</h3>
                <p>{historyProfile.contact}</p>
              </Panel>
              <p className="footnote"><Icon name="shield" size={14} /> আপনি এই পাতা খুললে তা রোগীর "কে কখন দেখেছে" তালিকায় লেখা হয়। রোগী ও আপনার ব্যক্তিগত বার্তা এখানে আসে না।</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
