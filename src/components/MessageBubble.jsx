import Avatar from './Avatar.jsx';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';
import { PEOPLE } from '../utils/data.js';

export default function MessageBubble({ message, thread, mine }) {
  const person = PEOPLE[message.from];
  const name = message.from === 'patient' ? thread.patient : person.name;
  const avatar = message.from === 'patient' ? thread.avatar : person.avatar;
  return (
    <li className={cx('bubble', mine && 'bubble--mine', message.private && 'bubble--private')}>
      {!mine && <Avatar kind={avatar} name={name} />}
      <div className="bubble__body">
        <small className="bubble__meta">{mine ? 'আপনি' : `${name} · ${person.title}`} · {message.when}</small>
        <p>{message.text}</p>
        {message.private && <small className="bubble__lock"><Icon name="lock" size={12} /> ব্যক্তিগত · শুধু রোগী ও ডাক্তার</small>}
      </div>
    </li>
  );
}
