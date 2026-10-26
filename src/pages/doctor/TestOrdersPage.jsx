import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import TestItem from '../../components/TestItem.jsx';
import TestGate from '../../components/TestGate.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { doctorSchedule, idFor, testCatalog } from '../../utils/data.js';

export default function TestOrdersPage({ notify, orders, orderActions }) {
  const [who, setWho] = useState(doctorSchedule[2].name);
  const [picked, setPicked] = useState({ 'প্রস্রাব পরীক্ষা (R/E)': true });
  const [optional, setOptional] = useState({});
  const [note, setNote] = useState('');
  const chosen = testCatalog.filter((t) => picked[t.name]);

  const send = () => {
    orderActions.create(who, chosen.map((t) => ({ ...t, required: !optional[t.name] })), note.trim());
    setPicked({}); setOptional({}); setNote('');
    notify(`${who}-এর জন্য ${bn(chosen.length)}টি পরীক্ষার পরামর্শ ক্লিনিকে গেছে। ক্লিনিক সময় ঠিক করবে।`);
  };

  return (
    <>
      <PageHeader eyebrow="পরীক্ষার পরামর্শ" title="রোগীকে পরীক্ষা দিন" lead="আপনি পরীক্ষা বেছে দেন, ক্লিনিক ল্যাব ও সময় ঠিক করে। জরুরি পরীক্ষার রিপোর্ট না এলে রোগী দ্বিতীয় সাক্ষাৎ নিতে পারেন না।" />

      <div className="grid-2">
        <Panel title="নতুন পরামর্শ">
          <label className="field" htmlFor="order-patient"><span>রোগী</span>
            <select id="order-patient" value={who} onChange={(e) => setWho(e.target.value)}>{doctorSchedule.map((p) => (<option key={p.id} value={p.name}>{p.name} · {idFor(p.name)}</option>))}</select>
          </label>
          <fieldset className="fieldset">
            <legend>পরীক্ষা বাছুন ({bn(chosen.length)}টি)</legend>
            {testCatalog.map((t, i) => (
              <div key={t.name} className={cx('pick', picked[t.name] && 'is-on')}>
                <label className="pick__main" htmlFor={`pick-${i}`}>
                  <input id={`pick-${i}`} type="checkbox" checked={Boolean(picked[t.name])} onChange={(e) => setPicked((p) => ({ ...p, [t.name]: e.target.checked }))} />
                  <span><strong>{t.name}</strong><small>প্রস্তুতি: {t.prep}</small></span>
                </label>
                {picked[t.name] && (
                  <button type="button" className={cx('choice choice--small', !optional[t.name] && 'is-active')} aria-pressed={!optional[t.name]} onClick={() => setOptional((o) => ({ ...o, [t.name]: !o[t.name] }))}>{optional[t.name] ? 'ঐচ্ছিক' : 'জরুরি'}</button>
                )}
              </div>
            ))}
          </fieldset>
          <label className="field" htmlFor="order-note"><span>রোগী ও ক্লিনিকের জন্য নোট</span><textarea id="order-note" rows="2" placeholder="যেমন: রিপোর্ট হাতে এলে পরের সাক্ষাতে ওষুধ ঠিক করব।" value={note} onChange={(e) => setNote(e.target.value)} /></label>
          <button type="button" className="btn btn--primary btn--block" disabled={!chosen.length} onClick={send}><Icon name="send" size={16} /> পরীক্ষার পরামর্শ ক্লিনিকে পাঠান</button>
          <p className="footnote"><Icon name="shield" size={14} /> "জরুরি" চিহ্নিত পরীক্ষাগুলোই দ্বিতীয় সাক্ষাতের শর্ত। "ঐচ্ছিক" পরীক্ষা বাকি থাকলেও সাক্ষাৎ নেওয়া যায়।</p>
        </Panel>

        <div className="stack">
          {orders.map((o) => (
            <Panel key={o.id} title={o.patient} hint={`${idFor(o.patient)} · ${o.date}`} action={<StatusPill tone={o.followup?.status === 'confirmed' ? 'good' : o.followup ? 'stamp' : 'neutral'} dot={false}>{o.followup?.status === 'confirmed' ? 'দ্বিতীয় সাক্ষাৎ ঠিক' : o.followup ? 'সাক্ষাতের আবেদন এসেছে' : 'সাক্ষাৎ এখনো নয়'}</StatusPill>}>
              <TestGate order={o} />
              <ul className="tests">
                {o.items.map((it) => (
                  <TestItem key={it.id} item={it}>
                    {it.status === 'reported' && <button type="button" className="link-btn" onClick={() => notify('ডেমোতে রিপোর্টের ফাইল খোলে না। আসল অ্যাপে উৎসসহ রিপোর্ট খুলবে।', 'warn')}>রিপোর্ট দেখুন <Icon name="arrow" size={14} /></button>}
                    {it.status !== 'reported' && <button type="button" className="link-btn" onClick={() => { orderActions.item(o.id, it.id, { required: !it.required }); notify(it.required ? `${it.name} ঐচ্ছিক করা হয়েছে। এটি আর সাক্ষাতের শর্ত নয়।` : `${it.name} জরুরি করা হয়েছে।`); }}>{it.required ? 'ঐচ্ছিক করুন' : 'জরুরি করুন'}</button>}
                  </TestItem>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </div>
    </>
  );
}
