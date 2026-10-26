import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import VideoClip from '../../components/VideoClip.jsx';
import AppointmentCard from '../../components/AppointmentCard.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn } from '../../utils/bn.js';
import { idFor, slotKind, teleNeed, teleStatus } from '../../utils/data.js';

export default function TeleSchedulePage({ notify, goTo, tele, teleActions, slotOwner }) {
  const [advice, setAdvice] = useState({});
  const takenBy = slotOwner;
  const inbox = tele.requests.filter((r) => r.status === 'doctor_review');
  const waiting = tele.requests.filter((r) => ['consent', 'scheduling', 'waitlist'].includes(r.status));
  const booked = tele.slots.filter((s) => takenBy(s.id));
  const isRahima = (r) => r.patient === 'রহিমা বেগম';

  const sendAdvice = (r) => {
    const text = (advice[r.id] || '').trim();
    if (!text) return notify('পরামর্শটি লিখুন, তারপর পাঠান।', 'warn');
    teleActions.update(r.id, { status: 'advice', advice: text });
    notify(`${r.patient}-কে লিখিত পরামর্শ পাঠানো হয়েছে। সরাসরি সাক্ষাৎ লাগবে না।`);
  };
  const askLive = (r, need) => {
    teleActions.update(r.id, { status: 'consent', need });
    notify(`ক্লিনিককে জানানো হয়েছে (${teleNeed[need]})। রোগী রাজি হলে সময় ঠিক হবে।`);
  };

  return (
    <>
      <PageHeader eyebrow="ভিডিও ও সাক্ষাৎ" title="রোগীর ২ মিনিটের ভিডিও" lead="ক্লিনিক মান অনুমোদন করার পরেই ভিডিও এখানে আসে। দেখে লিখিত পরামর্শ দিন, অথবা সরাসরি দেখতে চাইলে ক্লিনিককে জানান।">
        <StatusPill tone={inbox.length ? 'stamp' : 'good'}>{inbox.length ? `${bn(inbox.length)}টি ভিডিও দেখা বাকি` : 'নতুন কোনো ভিডিও নেই'}</StatusPill>
      </PageHeader>

      <div className="grid-2 grid-2--wide-left">
        <div className="stack">
          {inbox.map((r) => (
            <Panel key={r.id} title={r.patient} hint={`${idFor(r.patient)} · ${r.reason}`} action={isRahima(r) ? <button type="button" className="link-btn" onClick={() => goTo('passport')}>পুরো ইতিহাস <Icon name="arrow" size={14} /></button> : undefined}>
              <VideoClip video={r.video} name={r.patient} avatar={isRahima(r) ? 'patient' : undefined} />
              <label className="field" htmlFor={`advice-${r.id}`}><span>লিখিত পরামর্শ (সাক্ষাৎ না লাগলে)</span>
                <textarea id={`advice-${r.id}`} rows="3" placeholder="যেমন: ওষুধ আগের মতো চলবে। ৩ দিন পর আবার জানাবেন।" value={advice[r.id] || ''} onChange={(e) => setAdvice((a) => ({ ...a, [r.id]: e.target.value }))} />
              </label>
              <button type="button" className="btn btn--primary btn--block" onClick={() => sendAdvice(r)}><Icon name="send" size={16} /> পরামর্শ পাঠান, সাক্ষাৎ লাগবে না</button>
              <div className="live-ask">
                <span className="sub">সরাসরি দেখতে চাই</span>
                <button type="button" className="btn btn--ghost" onClick={() => askLive(r, 'any')}><Icon name="video" size={16} /> অনলাইন হলেই চলবে</button>
                <button type="button" className="btn btn--ghost" onClick={() => askLive(r, 'physical')}><Icon name="clinic" size={16} /> চেম্বারে আসতে হবে</button>
              </div>
              <p className="footnote"><Icon name="shield" size={14} /> সাক্ষাৎ চাইলে আগে রোগীর সম্মতি নেওয়া হয়, তারপর ক্লিনিক সময় ঠিক করে।</p>
            </Panel>
          ))}
          {!inbox.length && <div className="locked"><Icon name="video" size={28} /><h2>দেখার মতো নতুন ভিডিও নেই</h2><p>ক্লিনিক কোনো ভিডিওর মান অনুমোদন করলে তা এখানে আসবে।</p></div>}
        </div>

        <div className="stack">
          <Panel title="ঠিক হওয়া সাক্ষাৎ" hint={booked.length ? `${bn(booked.length)}টি` : undefined}>
            {booked.length ? booked.map((s) => {
              const r = takenBy(s.id);
              return (<AppointmentCard key={s.id} slot={s} title={`${r.patient} · ${idFor(r.patient)}`} sub={r.reason} onJoin={() => notify('ডেমোতে মিট খোলে না।', 'warn')} />);
            }) : <p className="muted">এখনো কোনো সাক্ষাৎ ঠিক হয়নি।</p>}
          </Panel>

          {waiting.length > 0 && (
            <Panel title="আপনার অনুরোধের অবস্থা">
              <ul className="rows">
                {waiting.map((r) => (<li key={r.id}><Icon name="clock" size={17} /><div><strong>{r.patient}</strong><span className="muted">{teleNeed[r.need]}</span></div><StatusPill tone={teleStatus[r.status].tone} dot={false}>{teleStatus[r.status].label}</StatusPill></li>))}
              </ul>
            </Panel>
          )}

          <Panel title="আপনার সময়সূচি" hint="বন্ধ করা সময়ে ক্লিনিক কাউকে সাক্ষাৎ দিতে পারবে না।">
            <ul className="slots">
              {tele.slots.map((s) => {
                const who = takenBy(s.id);
                return (
                  <li key={s.id} className="slot">
                    <div><strong>{s.day}, {s.time}</strong><span className="muted">{slotKind[s.kind]}{who ? ` · ${who.patient}` : ''}</span></div>
                    {who ? <StatusPill tone="info" dot={false}>সাক্ষাৎ ঠিক হয়েছে</StatusPill> : (
                      <button type="button" className="switch switch--inline" role="switch" aria-checked={s.open} aria-label={`${s.day} ${s.time}`} onClick={() => teleActions.toggleSlot(s.id)}>
                        <span className="switch__knob" aria-hidden="true" /><span>{s.open ? 'খোলা' : 'বন্ধ'}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
