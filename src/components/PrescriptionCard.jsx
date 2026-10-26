import WhoTag from './WhoTag.jsx';
import StatusPill from './StatusPill.jsx';
import { cx } from '../utils/bn.js';

const TONE = { 'চলমান': 'good', 'শেষ': 'neutral', 'বন্ধ': 'neutral', 'মাত্রা বদলেছে': 'info', 'মাত্রা যাচাই বাকি': 'stamp' };

/** One prescription, drawn like the pad it came from. */
export default function PrescriptionCard({ rx }) {
  return (
    <article className="rx">
      <header className="rx__head">
        <span className="rx__mark" aria-hidden="true">℞</span>
        <div>
          <strong>{rx.date}</strong>
          <WhoTag name={rx.doctor} />
          <span className="rx__place">{rx.field} · <WhoTag name={rx.place} /></span>
        </div>
        <StatusPill tone={rx.state === 'verified' ? 'good' : 'stamp'}>{rx.state === 'verified' ? 'যাচাইকৃত' : 'যাচাই বাকি'}</StatusPill>
      </header>
      <div className="table-wrap">
        <table className="rx__table">
          <thead><tr><th>ওষুধ</th><th>মাত্রা</th><th>মেয়াদ</th><th>এখন</th></tr></thead>
          <tbody>
            {rx.meds.map((m) => (
              <tr key={m.brand + m.generic} className={cx((m.status === 'বন্ধ' || m.status === 'শেষ') && 'is-stopped')}>
                <td><strong>{m.brand}</strong><small>{m.generic}</small></td>
                <td className="num">{m.dose}</td>
                <td>{m.days}</td>
                <td><StatusPill tone={TONE[m.status]} dot={false}>{m.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rx__advice">{rx.advice}</p>
    </article>
  );
}
