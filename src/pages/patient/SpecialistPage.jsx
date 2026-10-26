import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StepTrack from '../../components/StepTrack.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import TravelPack from '../../components/TravelPack.jsx';
import { bn, cx, taka } from '../../utils/bn.js';
import { consult, coordinationFee, documents, exchangeSteps, expiryOptions, idFor, specialists } from '../../utils/data.js';

export default function SpecialistPage({ notify }) {
  const [chosen, setChosen] = useState('s1');
  const [shared, setShared] = useState(['d1', 'd2', 'd5']);
  const [expiry, setExpiry] = useState(expiryOptions[0]);
  const doctor = specialists.find((s) => s.id === chosen);

  const toggleDoc = (id) => setShared((list) => (list.includes(id) ? list.filter((d) => d !== id) : [...list, id]));

  return (
    <>
      <PageHeader eyebrow="বিশেষজ্ঞ মতামত বিনিময়" title="দ্বিতীয় মতামতের অনুরোধ" lead="বিদেশি বিশেষজ্ঞের মতামত আপনার স্থানীয় ডাক্তারের কাছে ফেরত যায়, যাতে চিকিৎসার ধারাবাহিকতা থাকে।" />

      <StepTrack steps={exchangeSteps} current={1} />

      <div className="grid-2 grid-2--wide-left">
        <div className="stack">
          <Panel title="বিশেষজ্ঞ বাছুন" hint="যাচাই শেষ না হলে কাউকে বাছা যায় না।">
            <ul className="specialists">
              {specialists.map((s) => {
                const cleared = Object.values(s.checks).every(Boolean);
                return (
                  <li key={s.id}>
                    <button type="button" className={cx('specialist', chosen === s.id && 'is-selected')} disabled={!cleared} aria-pressed={chosen === s.id} onClick={() => setChosen(s.id)}>
                      <span className="avatar avatar--lg" aria-hidden="true">{s.name.replace('ডা. ', '')[0]}</span>
                      <span className="specialist__body">
                        <strong>{s.name} <code className="id">{idFor(s.name)}</code></strong>
                        <span className="muted">{s.field} · {s.place} · {s.years} বছরের অভিজ্ঞতা</span>
                        <span className="muted">ভাষা: {s.lang}</span>
                        <span className="muted">{s.reg}</span>
                        <span className="checks">
                          {Object.entries(s.checks).map(([name, ok]) => (
                            <span key={name} className={cx('check', !ok && 'check--pending')}><Icon name={ok ? 'check' : 'clock'} size={12} /> {name}</span>
                          ))}
                        </span>
                      </span>
                      <span className="specialist__fee">
                        <strong className="num">{taka(s.fee)}</strong>
                        <small>{cleared ? s.slot : 'লাইসেন্স যাচাই চলছে'}</small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="স্থানীয় ডাক্তার যুক্ত থাকছেন">
            <ul className="rows">
              <li>
                <Icon name="shield" size={18} />
                <div><strong>{consult.doctor}, {consult.specialty}</strong><span className="muted">{idFor(consult.doctor)} · BMDC নিবন্ধন নং {consult.bmdc}</span><span className="muted">মতামত আসার পর তিনি বুঝিয়ে দেবেন এবং পরের চিকিৎসা ঠিক করবেন।</span></div>
                <StatusPill tone="good">সম্মতি দিয়েছেন</StatusPill>
              </li>
            </ul>
          </Panel>
        </div>

        <Panel title="যা শেয়ার হবে" hint={`${doctor.name} শুধু বাছাই করা ফাইল দেখবেন।`}>
          <fieldset className="fieldset">
            <legend>ফাইল বাছুন</legend>
            {documents.filter((d) => d.tone !== 'crit').map((d) => (
              <label key={d.id} className="option" htmlFor={`share-${d.id}`}>
                <input id={`share-${d.id}`} type="checkbox" checked={shared.includes(d.id)} onChange={() => toggleDoc(d.id)} />
                <span><strong>{d.title}</strong><small>{d.date}</small></span>
              </label>
            ))}
          </fieldset>

          <label className="field" htmlFor="share-expiry">
            <span>অনুমতির মেয়াদ</span>
            <select id="share-expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)}>
              {expiryOptions.map((o) => (<option key={o}>{o}</option>))}
            </select>
          </label>

          <dl className="bill">
            <div><dt>বিশেষজ্ঞের ফি</dt><dd className="num">{taka(doctor.fee)}</dd></div>
            <div><dt>সমন্বয় ফি (অনুবাদ ও সময় নির্ধারণ)</dt><dd className="num">{taka(coordinationFee)}</dd></div>
            <div className="bill__total"><dt>মোট</dt><dd className="num">{taka(doctor.fee + coordinationFee)}</dd></div>
          </dl>
          <p className="footnote">দুই ফি আলাদা দেখানো হয়। রেফার করার জন্য কেউ কমিশন পায় না। পরামর্শ না হলে পুরো টাকা ফেরত। ফি নমুনা মাত্র।</p>

          <button type="button" className="btn btn--primary btn--block" disabled={shared.length === 0} onClick={() => notify(`${bn(shared.length)}টি ফাইল ${expiry} মেয়াদে শেয়ারের অনুরোধ পাঠানো হয়েছে (ডেমো)।`)}>
            <Icon name="send" size={16} /> {bn(shared.length)}টি ফাইল দিয়ে অনুরোধ পাঠান
          </button>
        </Panel>

        <Panel title="বিদেশে চিকিৎসার প্রস্তুতি" hint="নিজে গিয়ে দেখাতে চাইলে যা যা লাগবে, এক জায়গায়।" className="span-2">
          <TravelPack notify={notify} />
        </Panel>
      </div>
    </>
  );
}
