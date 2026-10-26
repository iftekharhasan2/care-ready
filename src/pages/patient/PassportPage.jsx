import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import TrendChart from '../../components/TrendChart.jsx';
import Timeline from '../../components/Timeline.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import ExplainerCard from '../../components/ExplainerCard.jsx';
import BrandLookup from '../../components/BrandLookup.jsx';
import { cx } from '../../utils/bn.js';
import { accessHistory, askDoctor, explainers, labSeries, medications, patient, recordQA, timeline } from '../../utils/data.js';

export default function PassportPage() {
  const [test, setTest] = useState('creatinine');
  const series = labSeries[test];
  const [explain, setExplain] = useState('creatinine');
  const [asked, setAsked] = useState([askDoctor[0]]);
  const toggleAsk = (q) => setAsked((list) => (list.includes(q) ? list.filter((x) => x !== q) : [...list, q]));

  return (
    <>
      <PageHeader eyebrow="কেয়ার পাসপোর্ট" title="রহিমা বেগমের স্বাস্থ্য ইতিহাস" lead="সব রিপোর্ট, ওষুধ ও সাক্ষাৎ এক জায়গায়। কে কখন দেখেছে তাও এখানে।">
        <ul className="tags tags--plain">
          {patient.conditions.map((c) => (<li key={c}>{c}</li>))}
        </ul>
      </PageHeader>

      <div className="grid-2">
        <Panel title="পরীক্ষার ধারা" hint="গ্রাফ শুধু মানের পরিবর্তন দেখায়, কারণ বলে না।" className="span-2" action={
          <div className="segmented" role="tablist" aria-label="পরীক্ষা বাছুন">
            {Object.entries(labSeries).map(([key, s]) => (
              <button key={key} type="button" role="tab" aria-selected={test === key} className={cx(test === key && 'is-active')} onClick={() => setTest(key)}>{s.label}</button>
            ))}
          </div>
        }>
          <TrendChart series={series} />
          <p className="footnote"><Icon name="shield" size={14} /> {series.note}</p>
        </Panel>

        <Panel title="রিপোর্ট সহজ ভাষায়" hint="প্রতিটি পরীক্ষা কী মাপে এবং আপনার মান সীমার কোথায়।" className="span-2" action={
          <div className="segmented" role="tablist" aria-label="পরীক্ষা বাছুন">
            {explainers.map((e) => (
              <button key={e.id} type="button" role="tab" aria-selected={explain === e.id} className={cx(explain === e.id && 'is-active')} onClick={() => setExplain(e.id)}>{e.name}</button>
            ))}
          </div>
        }>
          <div className="explain-grid">
            <ExplainerCard item={explainers.find((e) => e.id === explain)} />
            <div className="ask">
              <h3 className="sub">ডাক্তারকে জিজ্ঞেস করুন</h3>
              <ul className="ask__list">
                {askDoctor.map((q) => (
                  <li key={q}>
                    <button type="button" className={cx('ask__item', asked.includes(q) && 'is-on')} aria-pressed={asked.includes(q)} onClick={() => toggleAsk(q)}>
                      <span className="tick" aria-hidden="true">{asked.includes(q) && <Icon name="check" size={14} />}</span>{q}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="footnote">বাছাই করা প্রশ্ন রেকর্ড ফাইলের সাথে ডাক্তারের কাছে যাবে।</p>
            </div>
          </div>
        </Panel>

        <Panel title="সময়রেখা" hint="নতুন থেকে পুরোনো">
          <Timeline events={timeline} />
        </Panel>

        <div className="stack">
          <Panel title="চলমান ওষুধ" hint="ব্র্যান্ডের নাম থেকে জেনেরিক নাম মিলিয়ে দেখানো হয়।">
            <ul className="rows">
              {medications.map((m) => (
                <li key={m.generic}>
                  <Icon name="pill" size={18} />
                  <div><strong>{m.brand}</strong><span className="muted">জেনেরিক: {m.generic} · {m.maker}</span><span className="muted">{m.dose} · {m.since}</span></div>
                  <StatusPill tone={m.verified ? 'good' : 'stamp'}>{m.verified ? 'যাচাইকৃত' : 'যাচাই বাকি'}</StatusPill>
                </li>
              ))}
            </ul>
            <BrandLookup />
          </Panel>

          <Panel title="কে কখন দেখেছে" hint="এই তালিকা দেখতে কখনো টাকা লাগবে না।">
            <ul className="log">
              {accessHistory.map((a) => (
                <li key={a.when + a.who}><span className="log__when">{a.when}</span><span><strong>{a.who}</strong> {a.what}</span></li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel title="রেকর্ড নিয়ে প্রশ্ন" hint="উত্তর শুধু আপনার কাগজপত্র থেকে আসে, উৎসসহ। প্রমাণ না থাকলে সহায়ক উত্তর দেয় না।" className="span-2">
          <div className="qa">
            {recordQA.map((item) => (
              <article key={item.q} className={cx('qa__item', !item.ok && 'qa__item--none')}>
                <p className="qa__q">{item.q}</p>
                <p className="qa__a">{item.a}</p>
                {item.ok ? (
                  <ul className="tags">{item.cites.map((c) => (<li key={c}><Icon name="link" size={12} /> {c}</li>))}</ul>
                ) : (
                  <StatusPill tone="warn">রেকর্ডে প্রমাণ নেই · একজন মানুষ উত্তর দেবেন</StatusPill>
                )}
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
