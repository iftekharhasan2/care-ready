import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import VideoClip from '../../components/VideoClip.jsx';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import EmergencyButton from '../../components/EmergencyButton.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { MEET_SAMPLE, consult, idFor, slotKind, teleNeed, teleStatus, videoChecks, videoRedoReasons } from '../../utils/data.js';

const WAITING_NOTE = {
  video_redo: 'রোগীকে আবার রেকর্ড করতে বলা হয়েছে। নতুন ভিডিও এলে এখানে দেখাবে।',
  doctor_review: 'ভিডিওর মান অনুমোদিত। এখন ডাক্তারের দেখার অপেক্ষায়।',
  advice: 'ডাক্তার লিখিত পরামর্শ দিয়েছেন। সরাসরি সাক্ষাতের দরকার নেই।',
  consent: 'ডাক্তার সরাসরি দেখতে চান। রোগী রাজি হলে তবেই সময় ঠিক করা যাবে।',
  declined: 'রোগী সরাসরি সাক্ষাতে রাজি হননি। সময় ঠিক করার দরকার নেই।',
};

export default function TeleDeskPage({ notify, tele, teleActions, slotOwner, emergencyActions, orders }) {
  const [activeId, setActiveId] = useState(tele.requests[0]?.id);
  const [checks, setChecks] = useState({});
  const [reason, setReason] = useState(videoRedoReasons[0]);
  const active = tele.requests.find((r) => r.id === activeId) ?? tele.requests[0];
  const takenBy = slotOwner;
  const todo = tele.requests.filter((r) => ['video_review', 'scheduling', 'waitlist'].includes(r.status)).length;

  const ticked = active ? videoChecks.filter((c) => checks[`${active.id}:${c}`]).length : 0;
  const slot = active && tele.slots.find((s) => s.id === active.slotId);
  const usable = active ? tele.slots.filter((s) => active.need !== 'physical' || s.kind === 'physical') : [];
  const free = usable.filter((s) => s.open && !takenBy(s.id));
  const scheduling = active && (active.status === 'scheduling' || active.status === 'waitlist');

  const approve = () => { teleActions.update(active.id, { status: 'doctor_review' }); notify('ভিডিওর মান অনুমোদিত। ডাক্তারের তালিকায় পাঠানো হয়েছে।'); };
  const reject = () => { teleActions.update(active.id, { status: 'video_redo', redoReason: reason }); notify('রোগীকে আবার রেকর্ড করতে বলা হয়েছে।'); };
  const assign = (s) => { teleActions.update(active.id, { status: 'confirmed', slotId: s.id }); notify(`${active.patient}-এর ${slotKind[s.kind]} সাক্ষাৎ ঠিক হয়েছে। রোগী ও ডাক্তারকে জানানো হয়েছে (ডেমো)।`); };

  return (
    <>
      <PageHeader eyebrow="টেলিমেডিসিন" title="ভিডিওর মান ও সাক্ষাতের সময়" lead="রোগীর ২ মিনিটের ভিডিওর মান দেখে ডাক্তারকে পাঠান। ডাক্তার সরাসরি দেখতে চাইলে এবং রোগী রাজি হলে সময়সূচি দেখে অনলাইন বা চেম্বারে সময় দিন।">
        <StatusPill tone={todo ? 'stamp' : 'good'}>{todo ? `${bn(todo)}টি কাজ আপনার অপেক্ষায়` : 'আপনার কোনো কাজ বাকি নেই'}</StatusPill>
      </PageHeader>

      <div className="grid-2">
        <Panel title="রোগীদের ভিডিও আবেদন">
          <ul className="threads">
            {tele.requests.map((r) => (
              <li key={r.id}>
                <button type="button" className={cx('threads__item tele-req', r.id === active?.id && 'is-active')} aria-current={r.id === active?.id} onClick={() => setActiveId(r.id)}>
                  <Avatar kind={r.patient === 'রহিমা বেগম' ? 'patient' : undefined} name={r.patient} />
                  <span><strong>{r.patient} <code className="id">{idFor(r.patient)}</code></strong><small>{r.reason}</small><small>{r.asked}</small></span>
                  <StatusPill tone={teleStatus[r.status].tone} dot={false}>{teleStatus[r.status].label}</StatusPill>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {active && (
          <Panel title={active.patient} hint={`${idFor(active.patient)} · ${active.reason}`} action={<StatusPill tone={teleStatus[active.status].tone}>{teleStatus[active.status].label}</StatusPill>}>
            {active.status === 'video_review' && (
              <>
                <VideoClip video={active.video} name={active.patient} avatar={active.patient === 'রহিমা বেগম' ? 'patient' : undefined} />
                <fieldset className="fieldset">
                  <legend>ভিডিওর মান ({bn(ticked)}/{bn(videoChecks.length)})</legend>
                  {videoChecks.map((c, i) => (
                    <label key={c} className="option" htmlFor={`vq-${active.id}-${i}`}>
                      <input id={`vq-${active.id}-${i}`} type="checkbox" checked={Boolean(checks[`${active.id}:${c}`])} onChange={(e) => setChecks((v) => ({ ...v, [`${active.id}:${c}`]: e.target.checked }))} />
                      <span><strong>{c}</strong></span>
                    </label>
                  ))}
                </fieldset>
                <button type="button" className="btn btn--primary btn--block" disabled={ticked < videoChecks.length} onClick={approve}><Icon name="check" size={16} /> মান ঠিক আছে, ডাক্তারকে পাঠান</button>
                <div className="redo">
                  <label className="field" htmlFor="redo-reason"><span>মান ঠিক না হলে কারণ</span>
                    <select id="redo-reason" value={reason} onChange={(e) => setReason(e.target.value)}>{videoRedoReasons.map((r) => (<option key={r}>{r}</option>))}</select>
                  </label>
                  <button type="button" className="btn btn--ghost" onClick={reject}><Icon name="refresh" size={16} /> আবার রেকর্ড করতে বলুন</button>
                </div>
                <p className="footnote"><Icon name="shield" size={14} /> ক্লিনিক শুধু ছবি ও শব্দের মান দেখে। রোগ নিয়ে মতামত দেন ডাক্তার।</p>
              </>
            )}

            {WAITING_NOTE[active.status] && <p className="waiting"><Icon name="clock" size={18} /> {WAITING_NOTE[active.status]}</p>}
            {active.status !== 'confirmed' && <EmergencyButton key={active.id} patient={active.patient} label="অবস্থা খারাপ? জরুরি সাক্ষাৎ ঠিক করুন" notify={notify} emergencyActions={emergencyActions} orders={orders} tele={tele} />}

            {scheduling && (
              <>
                <p className="sub">ডাক্তারের মত: {teleNeed[active.need]} · রোগী রাজি · রোগীর সুবিধা: {active.pref}</p>
                <ul className="slots">
                  {usable.map((s) => {
                    const who = takenBy(s.id);
                    return (
                      <li key={s.id} className={cx('slot', (!s.open || who) && 'is-off')}>
                        <div><strong>{s.day}, {s.time}</strong><span className="muted">{slotKind[s.kind]}</span></div>
                        {who ? <StatusPill tone="neutral" dot={false}>{who.patient} নিয়েছেন</StatusPill> : s.open ? <button type="button" className="btn btn--small" onClick={() => assign(s)}>এই সময় দিন</button> : <StatusPill tone="warn" dot={false}>ডাক্তার নেই</StatusPill>}
                      </li>
                    );
                  })}
                </ul>
                {!free.length && (
                  <button type="button" className="btn btn--primary btn--block" disabled={active.status === 'waitlist'} onClick={() => { teleActions.update(active.id, { status: 'waitlist' }); notify('রোগীকে অপেক্ষার তালিকায় রাখা হয়েছে।'); }}>{active.status === 'waitlist' ? 'অপেক্ষার তালিকায় আছেন' : 'সময় খালি নেই, অপেক্ষার তালিকায় রাখুন'}</button>
                )}
              </>
            )}

            {active.status === 'confirmed' && slot && (
              <>
                <AppointmentCard slot={slot} title={`${active.patient} · ${idFor(active.patient)}`} sub={`${consult.doctor}-এর সাথে`} onJoin={() => notify('ক্লিনিক ডেস্ক সাক্ষাতে যোগ দেয় না। লিংকটি শুধু রোগী ও ডাক্তারের জন্য।', 'warn')} />
                <div className="thread__msg thread__msg--sms"><small className="thread__tag">রোগীকে পাঠানো এসএমএস</small><p>কেয়াররেডি: {consult.doctor}-এর সাথে আপনার সাক্ষাৎ {slot.day}, {slot.time}। {slot.kind === 'online' ? `যোগ দিন: ${MEET_SAMPLE}` : `ঠিকানা: ${consult.place}`}</p></div>
                <button type="button" className="btn btn--ghost" onClick={() => { teleActions.update(active.id, { status: 'scheduling', slotId: undefined }); notify('সময় ছেড়ে দেওয়া হয়েছে। নতুন সময় বেছে নিন।'); }}>সময় বদলাতে হবে</button>
              </>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
