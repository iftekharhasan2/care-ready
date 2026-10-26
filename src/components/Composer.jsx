import { useState } from 'react';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';

/** Message box. The lock switch marks a message as private to patient and doctor. */
export default function Composer({ canPrivate, lockLabel, privateNote, onSend }) {
  const [text, setText] = useState('');
  const [isPrivate, setPrivate] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim(), canPrivate && isPrivate);
    setText('');
  };

  return (
    <form className={cx('composer', isPrivate && 'composer--private')} onSubmit={submit}>
      {canPrivate && (
        <button type="button" className="composer__lock" role="switch" aria-checked={isPrivate} onClick={() => setPrivate((v) => !v)}>
          <span className="switch__knob" aria-hidden="true" />
          <Icon name="lock" size={15} /> ব্যক্তিগত বার্তা: {lockLabel}
        </button>
      )}
      <div className="composer__row">
        <label className="sr-only" htmlFor="msg-draft">বার্তা লিখুন</label>
        <input id="msg-draft" type="text" autoComplete="off" placeholder={isPrivate ? 'ব্যক্তিগত বার্তা লিখুন' : 'বার্তা লিখুন'} value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="btn btn--primary" aria-label="বার্তা পাঠান"><Icon name="send" size={16} /> পাঠান</button>
      </div>
      <small className="composer__note">{isPrivate ? privateNote : 'এই বার্তা রোগী, ডাক্তার ও ক্লিনিক ডেস্ক দেখবেন।'}</small>
    </form>
  );
}
