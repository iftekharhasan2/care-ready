import { useState } from 'react';
import Icon from './Icon.jsx';
import StatusPill from './StatusPill.jsx';
import { bn, cx } from '../utils/bn.js';
import { travelChecklist, travelEnglish, travelPlaces } from '../utils/data.js';

export default function TravelPack({ notify }) {
  const [place, setPlace] = useState('india');
  const [items, setItems] = useState(travelChecklist);
  const done = items.filter((i) => i.done).length;
  const toggle = (id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  return (
    <div className="travel">
      <div className="travel__list">
        <div className="panel__head">
          <div className="segmented" role="tablist" aria-label="গন্তব্য দেশ">
            {Object.entries(travelPlaces).map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={place === key} className={cx(place === key && 'is-active')} onClick={() => setPlace(key)}>{label}</button>
            ))}
          </div>
          <StatusPill tone={done === items.length ? 'good' : 'warn'}>{bn(items.length)}টির মধ্যে {bn(done)}টি প্রস্তুত</StatusPill>
        </div>
        <ul className="checklist">
          {items.map((item) => (
            <li key={item.id} className={cx('checklist__item', item.done && 'is-done')}>
              <button type="button" className="tick" role="checkbox" aria-checked={item.done} aria-label={item.text} onClick={() => toggle(item.id)}>{item.done && <Icon name="check" size={14} />}</button>
              <div><span className="checklist__text">{item.text}</span><span className="checklist__answer">{item.note}</span></div>
            </li>
          ))}
        </ul>
        <p className="footnote"><Icon name="alert" size={14} /> {travelPlaces[place]}ের ভিসার নিয়ম ও কাগজপত্র বদলাতে পারে। আবেদনের আগে দূতাবাসের ওয়েবসাইটে মিলিয়ে নিন।</p>
      </div>
      <div className="travel__doc">
        <p className="sub">ইংরেজি রেকর্ড ফাইলের নমুনা</p>
        <div className="travel__english" lang="en">
          {travelEnglish.map((line) => (<p key={line}>{line}</p>))}
          <small>Translated from the original Bangla and English reports. Every value links to its source page.</small>
        </div>
        <button type="button" className="btn btn--ghost btn--block" onClick={() => notify(`${travelPlaces[place]}ের হাসপাতালের জন্য ইংরেজি রেকর্ড ফাইল তৈরি হয়েছে (ডেমো)।`)}><Icon name="plane" size={16} /> ইংরেজি রেকর্ড ফাইল তৈরি করুন</button>
      </div>
    </div>
  );
}
