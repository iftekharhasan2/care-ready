import Icon from './Icon.jsx';
import StatusPill from './StatusPill.jsx';
import { taka } from '../utils/bn.js';
import { abroad } from '../utils/data.js';

export default function AbroadAccount({ approved, onApprove }) {
  return (
    <div className="abroad">
      <div className="abroad__who">
        <span className="avatar avatar--lg" aria-hidden="true">{abroad.name[0]}</span>
        <div>
          <strong>{abroad.name}</strong>
          <span className="muted">{abroad.relation} · {abroad.place}</span>
          <span className="muted">{abroad.clock}</span>
        </div>
        <StatusPill tone={approved ? 'good' : 'warn'}>{approved ? 'অনুমোদিত' : 'আপনার অনুমোদনের অপেক্ষায়'}</StatusPill>
      </div>
      <ul className="abroad__asks">
        <li><Icon name="check" size={15} /> {abroad.plan}-এর খরচ দেবেন: বছরে {taka(abroad.yearly)} ({abroad.pay}, নমুনা মূল্য)</li>
        <li><Icon name="check" size={15} /> অ্যাপয়েন্টমেন্ট ঠিক করবেন এবং ফাইল আপলোড করবেন</li>
        <li><Icon name="x" size={15} /> অন্য কাউকে রেকর্ড শেয়ার করতে পারবেন না</li>
      </ul>
      {approved ? (
        <p className="footnote"><Icon name="shield" size={14} /> অনুমতি চালু হয়েছে। খরচ কে দিচ্ছেন তা নিয়ন্ত্রণ বদলায় না, যেকোনো সময় বাতিল করতে পারবেন।</p>
      ) : (
        <button type="button" className="btn btn--primary btn--block" onClick={onApprove}><Icon name="lock" size={16} /> একটি কোড দিয়ে অনুমোদন করুন</button>
      )}
    </div>
  );
}
