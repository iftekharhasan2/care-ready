import { bn } from '../utils/bn.js';

const R = 34;
const C = 2 * Math.PI * R;

export default function ProgressRing({ value, total, label }) {
  const done = total ? value / total : 0;
  return (
    <div className="ring" role="img" aria-label={`${label}: ${bn(total)}টির মধ্যে ${bn(value)}টি`}>
      <svg viewBox="0 0 84 84" width="84" height="84">
        <circle className="ring__track" cx="42" cy="42" r={R} fill="none" strokeWidth="9" />
        <circle className="ring__value" cx="42" cy="42" r={R} fill="none" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${C * done} ${C}`} transform="rotate(-90 42 42)" />
      </svg>
      <span className="ring__text"><strong>{bn(value)}/{bn(total)}</strong></span>
    </div>
  );
}
