import { useCallback, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StepTrack from '../../components/StepTrack.jsx';
import VideoRecorder from '../../components/VideoRecorder.jsx';
import VideoClip from '../../components/VideoClip.jsx';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, taka } from '../../utils/bn.js';
import { consult, idFor, patient, teleFee, teleHow, teleNeed, telePrep, teleStatus, teleStepIndex, teleSteps, teleStepsAdvice, teleTimes } from '../../utils/data.js';

export default function TelePage({ notify, tele, teleActions }) {
  const [form, setForm] = useState({ reason: 'পা আবার একটু ফুলেছে। নতুন রিপোর্ট নিয়ে ডাক্তারের সাথে কথা বলতে চাই।', pref: teleTimes[0], consent: true });
  const [seconds, setSeconds] = useState(0);
  const onRecorded = useCallback((s) => setSeconds(s), []);
  const mine = tele.requests.find((r) => r.patient === patient.name);
  const slot = mine && tele.slots.find((s) => s.id === mine.slotId);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!seconds) return notify('আগে ২ মিনিটের ভিডিওটি রেকর্ড করুন।', 'warn');
    if (!form.consent) return notify('ভিডিও ও রেকর্ড ফাইল দেখার অনুমতি না দিলে ডাক্তার দেখতে পারবেন না।', 'warn');
    teleActions.apply({ patient: patient.name, reason: form.reason.trim(), pref: form.pref, video: { seconds } });
    setSeconds(0);
    notify('ভিডিও ক্লিনিকে গেছে। মান ঠিক থাকলে ডাক্তারের কাছে যাবে।');
  };
  const resend = () => {
    if (!seconds) return notify('নতুন ভিডিওটি আগে রেকর্ড করুন।', 'warn');
    teleActions.update(mine.id, { status: 'video_review', video: { seconds }, redoReason: undefined });
    setSeconds(0);
    notify('নতুন ভিডিও ক্লিনিকে গেছে।');
  };
  const answer = (yes) => {
    teleActions.update(mine.id, { status: yes ? 'scheduling' : 'declined' });
    notify(yes ? 'সম্মতি জানানো হয়েছে। ক্লিনিক সময় ঠিক করে জানাবে।' : 'জানানো হয়েছে যে আপনি এখন সাক্ষাৎ চান না।');
  };

  return (
    <>
      <PageHeader eyebrow="টেলিমেডিসিন" title="২ মিনিটের ভিডিওতে ডাক্তার দেখান" lead="সমস্যাটি ভিডিওতে বলুন ও দেখান। ডাক্তার দেখে পরামর্শ দেবেন, দরকার হলে আপনার সম্মতি নিয়ে সরাসরি সাক্ষাৎ ঠিক হবে।" />

      <div className="grid-2 grid-2--wide-left">
        {mine ? (
          <Panel title="আপনার ভিডিও আবেদন" hint={`পাঠিয়েছেন: ${mine.asked}`} action={<StatusPill tone={teleStatus[mine.status].tone}>{mine.status === 'consent' ? 'আপনার সম্মতি দরকার' : teleStatus[mine.status].label}</StatusPill>}>
            {mine.status === 'advice' ? <StepTrack steps={teleStepsAdvice} current={3} /> : <StepTrack steps={teleSteps} current={teleStepIndex[mine.status]} />}
            <VideoClip video={mine.video} name={patient.name} avatar="patient" />

            {mine.status === 'video_review' && <p className="footnote"><Icon name="clock" size={14} /> ক্লিনিক শুধু ছবি ও শব্দের মান দেখছে। ঠিক থাকলে ভিডিও ডাক্তারের কাছে যাবে।</p>}
            {mine.status === 'video_redo' && (
              <>
                <p className="footnote footnote--crit"><Icon name="alert" size={14} /> ক্লিনিক জানিয়েছে: {mine.redoReason}। অনুগ্রহ করে আবার রেকর্ড করুন।</p>
                <VideoRecorder seconds={seconds} onRecorded={onRecorded} />
                <button type="button" className="btn btn--primary btn--block" onClick={resend}><Icon name="send" size={16} /> নতুন ভিডিও পাঠান</button>
              </>
            )}
            {mine.status === 'doctor_review' && <p className="footnote"><Icon name="clock" size={14} /> ভিডিওর মান ঠিক আছে। {consult.doctor} দেখে উত্তর দেবেন।</p>}
            {mine.status === 'advice' && (
              <div className="advice"><strong>{consult.doctor}-এর পরামর্শ</strong><p>{mine.advice}</p><small className="muted">এই মুহূর্তে সরাসরি সাক্ষাতের দরকার নেই বলে ডাক্তার জানিয়েছেন।</small></div>
            )}
            {mine.status === 'consent' && (
              <div className="ask-consent">
                <strong>{consult.doctor} আপনাকে সরাসরি দেখতে চান</strong>
                <p>ডাক্তারের মত: {teleNeed[mine.need]}। আপনি রাজি হলে ক্লিনিক সময়সূচি দেখে সাক্ষাৎ ঠিক করবে। নমুনা ফি {taka(teleFee)}।</p>
                <div className="meet__row">
                  <button type="button" className="btn btn--primary" onClick={() => answer(true)}><Icon name="check" size={16} /> হ্যাঁ, সাক্ষাৎ ঠিক করুন</button>
                  <button type="button" className="btn btn--ghost" onClick={() => answer(false)}>এখন না</button>
                </div>
              </div>
            )}
            {mine.status === 'declined' && <p className="footnote"><Icon name="shield" size={14} /> আপনি সাক্ষাতে রাজি হননি। মত বদলালে বার্তায় ক্লিনিককে জানান।</p>}
            {mine.status === 'scheduling' && <p className="footnote"><Icon name="clock" size={14} /> ক্লিনিক ডাক্তারের সময়সূচি দেখে সময় ঠিক করছে ({teleNeed[mine.need]})।</p>}
            {mine.status === 'waitlist' && <p className="footnote footnote--warn"><Icon name="alert" size={14} /> এখন কোনো সময় খালি নেই। সময় খুললেই আপনাকে আগে জানানো হবে।</p>}
            {mine.status === 'confirmed' && slot && (
              <AppointmentCard slot={slot} title={`${consult.doctor} · ${consult.specialty}`} sub={`ডাক্তার আইডি ${idFor(consult.doctor)}`} onJoin={() => notify('ডেমোতে মিট খোলে না। আসল অ্যাপে সাক্ষাতের ১০ মিনিট আগে থেকে যোগ দেওয়া যাবে।', 'warn')} />
            )}
            <button type="button" className="btn btn--danger" onClick={() => { teleActions.cancel(mine.id); notify('আবেদন বাতিল হয়েছে এবং ভিডিও মুছে ফেলা হয়েছে।'); }}>আবেদন বাতিল করে ভিডিও মুছুন</button>
          </Panel>
        ) : (
          <Panel title="ভিডিও পাঠান" hint="ভিডিও দেখার জন্য কোনো ফি নেই (নমুনা নিয়ম)। সরাসরি সাক্ষাৎ হলে তবেই ফি।">
            <form className="form" onSubmit={submit} noValidate>
              <label className="field" htmlFor="tele-reason"><span>সংক্ষেপে সমস্যা</span><textarea id="tele-reason" rows="2" value={form.reason} onChange={set('reason')} /></label>
              <div className="field"><span>২ মিনিটের ভিডিও</span><VideoRecorder seconds={seconds} onRecorded={onRecorded} /></div>
              <div className="field"><span>ডাক্তার</span><p className="tele-doctor"><strong>{consult.doctor}</strong> · {consult.specialty} <code className="id">{idFor(consult.doctor)}</code></p></div>
              <label className="field" htmlFor="tele-pref"><span>সাক্ষাৎ লাগলে কোন সময় সুবিধা</span>
                <select id="tele-pref" value={form.pref} onChange={set('pref')}>{teleTimes.map((t) => (<option key={t}>{t}</option>))}</select>
              </label>
              <label className="option" htmlFor="tele-consent">
                <input id="tele-consent" type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} />
                <span><strong>ক্লিনিককে ভিডিওর মান দেখার এবং ডাক্তারকে ভিডিও ও রেকর্ড ফাইল দেখার অনুমতি দিচ্ছি</strong><small>যেকোনো সময় আবেদন বাতিল করলে ভিডিও মুছে যাবে।</small></span>
              </label>
              <button type="submit" className="btn btn--primary btn--block"><Icon name="send" size={16} /> ভিডিও পাঠান</button>
            </form>
          </Panel>
        )}

        <div className="stack">
          <Panel title="যেভাবে হয়">
            <ol className="tele-how">
              {teleHow.map((s, i) => (<li key={s.title}><span className="steps__mark">{bn(i + 1)}</span><div><strong>{s.title}</strong><span className="muted">{s.text}</span></div></li>))}
            </ol>
          </Panel>
          <Panel title="ভিডিওর আগে">
            <ul className="facts">{telePrep.map((t) => (<li key={t}><Icon name="check" size={16} /> {t}</li>))}</ul>
            <p className="footnote footnote--crit"><Icon name="alert" size={14} /> বুকে ব্যথা বা তীব্র শ্বাসকষ্ট হলে ভিডিও নয়, এখনই ৯৯৯ এ ফোন করুন।</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
