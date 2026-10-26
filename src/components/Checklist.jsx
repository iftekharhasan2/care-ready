import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';

export default function Checklist({ items, onToggle, onVoice }) {
  const [listening, setListening] = useState(null);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const listen = (id) => {
    setListening(id);
    timer.current = setTimeout(() => { setListening(null); onVoice(id); }, 1900);
  };

  return (
    <ul className="checklist">
      {items.map((item) => (
        <li key={item.id} className={cx('checklist__item', item.done && 'is-done')}>
          <button type="button" className="tick" role="checkbox" aria-checked={item.done} aria-label={item.text} onClick={() => onToggle(item.id)}>
            {item.done && <Icon name="check" size={14} />}
          </button>
          <div>
            <span className="checklist__text">{item.text}</span>
            <span className="checklist__answer">
              {item.spoken && <Icon name="mic" size={13} />}
              {item.done ? item.answer || 'উত্তর দেওয়া হয়েছে' : 'উত্তর বাকি। ডাক্তার দেখার আগে জানালে সময় বাঁচবে।'}
            </span>
          </div>
          {!item.done && onVoice && (
            <button type="button" className={cx('voice', listening === item.id && 'is-on')} disabled={listening !== null} onClick={() => listen(item.id)}>
              <Icon name="mic" size={15} /> {listening === item.id ? 'শুনছি…' : 'বলে উত্তর দিন'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
