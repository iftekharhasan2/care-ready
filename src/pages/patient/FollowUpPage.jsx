import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import TaskItem from '../../components/TaskItem.jsx';
import EmergencyNote from '../../components/EmergencyNote.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { carePlanSeed, consult, prayers, symptoms } from '../../utils/data.js';

export default function FollowUpPage({ notify, goTo }) {
  const [tasks, setTasks] = useState(carePlanSeed);
  const [symptom, setSymptom] = useState(null);
  const [ramadan, setRamadan] = useState(false);
  const [quiet, setQuiet] = useState(true);

  const done = tasks.filter((t) => t.done).length;
  const percent = Math.round((done / tasks.length) * 100);
  const toggle = (id) => setTasks((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const report = (s) => {
    setSymptom(s);
    notify(s === 'কোনো সমস্যা নেই' ? 'আজকের অবস্থা লেখা হয়েছে।' : `"${s}" কেয়ার টিমকে জানানো হয়েছে (ডেমো)।`, s === 'শ্বাস নিতে কষ্ট' ? 'warn' : 'good');
  };

  return (
    <>
      <PageHeader eyebrow="ফলো-আপ সঙ্গী" title="পরামর্শের পরের কাজ" lead="ডাক্তারের অনুমোদিত পরিকল্পনা, মনে করিয়ে দেওয়া এবং কেয়ার টিমের সাথে বার্তা।" />
      <EmergencyNote />

      <div className="grid-2 grid-2--wide-left">
        <Panel title="আজকের কেয়ার প্ল্যান" hint={`${bn(tasks.length)}টির মধ্যে ${bn(done)}টি শেষ`} action={<StatusPill tone={percent === 100 ? 'good' : 'info'}>{bn(percent)}%</StatusPill>}>
          <div className="bar bar--lg" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label="আজকের অগ্রগতি">
            <span style={{ width: `${percent}%` }} className={percent === 100 ? 'is-done' : ''} />
          </div>
          <ul className="tasks">
            {tasks.map((t) => (<TaskItem key={t.id} task={t} onToggle={toggle} ramadan={ramadan} />))}
          </ul>
        </Panel>

        <div className="stack">
          <Panel title="রিমাইন্ডারের সময়" hint="আপনার দিনের নিয়ম অনুযায়ী মনে করিয়ে দেওয়া হবে।">
            <div className="switches">
              <button type="button" className="switch" role="switch" aria-checked={ramadan} onClick={() => setRamadan((v) => !v)}>
                <span className="switch__knob" aria-hidden="true" />
                <span><strong><Icon name="moon" size={15} /> রোজার সময়সূচি</strong><small>ওষুধ ও মাপার সময় সেহরি ও ইফতার ধরে সাজানো হবে</small></span>
              </button>
              <button type="button" className="switch" role="switch" aria-checked={quiet} onClick={() => setQuiet((v) => !v)}>
                <span className="switch__knob" aria-hidden="true" />
                <span><strong><Icon name="clock" size={15} /> নামাজের সময়ে নীরব</strong><small>রিমাইন্ডার নামাজ শেষের ১৫ মিনিট পরে আসবে</small></span>
              </button>
            </div>
            {quiet && <ul className="tags">{prayers.map((p) => (<li key={p}>{p}</li>))}</ul>}
            {ramadan && <p className="footnote footnote--warn"><Icon name="alert" size={14} /> রোজা রাখা আপনার জন্য নিরাপদ কি না এবং ওষুধের সময় বদলানো যাবে কি না, তা ডাক্তার ঠিক করবেন। অনুমোদন ছাড়া কোনো ওষুধের সময় বদলানো হয় না।</p>}
          </Panel>

          <Panel title="পরের সাক্ষাৎ">
            <ul className="rows">
              <li>
                <Icon name="calendar" size={18} />
                <div><strong>৩০ অক্টোবর ২০২৬, সকাল ১১:০০</strong><span className="muted">{consult.doctor} · {consult.place}</span><span className="muted">সাথে আনুন: নতুন ক্রিয়েটিনিন রিপোর্ট ও রক্তচাপের খাতা</span></div>
              </li>
            </ul>
          </Panel>

          <Panel title="আজ কেমন আছেন" hint="যা প্রযোজ্য সেটি বেছে নিন।">
            <div className="choices" role="group" aria-label="আজকের উপসর্গ">
              {symptoms.map((s) => (
                <button key={s} type="button" className={cx('choice', symptom === s && 'is-active')} aria-pressed={symptom === s} onClick={() => report(s)}>{s}</button>
              ))}
            </div>
            {symptom === 'শ্বাস নিতে কষ্ট' && <p className="footnote footnote--crit"><Icon name="alert" size={14} /> শ্বাসকষ্ট বাড়লে অপেক্ষা না করে ৯৯৯ এ ফোন করুন।</p>}
          </Panel>

          <Panel title="কেয়ার টিমের বার্তা" hint="ডাক্তার ও ক্লিনিক ডেস্কের সাথে কথা বলুন। ডাক্তারকে ব্যক্তিগত বার্তাও দেওয়া যায়।">
            <button type="button" className="btn btn--ghost btn--block" onClick={() => goTo('messages')}><Icon name="message" size={16} /> বার্তা খুলুন</button>
          </Panel>
        </div>
      </div>
    </>
  );
}
