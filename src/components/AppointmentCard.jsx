import Icon from './Icon.jsx';
import IdChip from './IdChip.jsx';
import StatusPill from './StatusPill.jsx';
import { MEET_SAMPLE, consult, slotKind } from '../utils/data.js';

/** A confirmed live appointment: Google Meet for online, the chamber address for physical. */
export default function AppointmentCard({ slot, title, sub, onJoin, urgent, children }) {
  const online = slot.kind === 'online';
  return (
    <article className={urgent ? 'meet meet--urgent' : 'meet'}>
      <span className="meet__icon" aria-hidden="true"><Icon name={online ? 'video' : 'clinic'} size={24} /></span>
      <div className="meet__body">
        <strong className="meet__when">{slot.day}, {slot.time}</strong>
        <span>{title}</span>
        {sub && <span className="muted">{sub}</span>}
        <div className="meet__row">
          {urgent && <StatusPill tone="crit">জরুরি</StatusPill>}
          <StatusPill tone="info" dot={false}>{slotKind[slot.kind]}</StatusPill>
          {online ? <IdChip id={MEET_SAMPLE} label="গুগল মিট" /> : <span className="meet__place"><Icon name="clinic" size={15} /> {consult.place}</span>}
        </div>
        {(online || children) && (
          <div className="meet__row">
            {online && <button type="button" className="btn btn--primary" onClick={onJoin}><Icon name="video" size={16} /> মিটে যোগ দিন</button>}
            {children}
          </div>
        )}
        <small className="muted">{online ? 'নমুনা লিংক। আসল ব্যবস্থায় সময় ঠিক হলে লিংক নিজে থেকে তৈরি হবে।' : urgent ? 'আগের রিপোর্ট ও চলমান ওষুধ সাথে আনুন।' : 'আগের রিপোর্ট ও চলমান ওষুধ সাথে আনুন। ১৫ মিনিট আগে আসুন।'}</small>
      </div>
    </article>
  );
}
