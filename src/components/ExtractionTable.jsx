import Icon from './Icon.jsx';
import StatusPill from './StatusPill.jsx';
import { bn, cx } from '../utils/bn.js';
import { verifier } from '../utils/data.js';

const STATE = {
  verified: { label: 'যাচাইকৃত', tone: 'good' },
  review: { label: 'যাচাই বাকি', tone: 'stamp' },
};

export default function ExtractionTable({ fields, docs, selectedDoc, selectedField, onSource, onVerify, readOnly }) {
  const titleOf = (id) => docs.find((d) => d.id === id)?.title ?? '';
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr><th>তথ্য</th><th>মান</th><th>রেফারেন্স সীমা</th><th>উৎস</th><th>নিশ্চয়তা</th><th>অবস্থা</th></tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.id} className={cx((selectedDoc === f.docId || selectedField === f.id) && 'is-linked')}>
              <td>
                <strong>{f.label}</strong>
                {f.note && <small className="table__note">{f.note}</small>}
              </td>
              <td className="num">
                <strong>{f.value}</strong> <span className="unit">{f.unit}</span>
                {f.flag && <span className={cx('flag', f.flag === 'কম' && 'flag--low')}>{f.flag}</span>}
              </td>
              <td className="num muted">{f.ref}</td>
              <td>
                <button type="button" className="source" onClick={() => onSource(f.docId, f)} title={titleOf(f.docId)}>
                  <Icon name="link" size={13} /> পৃ. {f.page}
                </button>
              </td>
              <td className="num">
                <span className={cx('conf', f.confidence < 80 && 'conf--low')}>{bn(f.confidence)}%</span>
              </td>
              <td>
                {f.state === 'verified' ? (
                  <>
                    <StatusPill tone={STATE.verified.tone}>{STATE.verified.label}</StatusPill>
                    <small className="table__note">{f.by || verifier.name}</small>
                  </>
                ) : readOnly ? (
                  <StatusPill tone={STATE.review.tone}>{STATE.review.label}</StatusPill>
                ) : (
                  <button type="button" className="btn btn--small" onClick={() => onVerify(f.id)}>উৎস দেখে যাচাই করুন</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
