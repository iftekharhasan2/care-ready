import Modal from './Modal.jsx';
import QrCode from './QrCode.jsx';
import Icon from './Icon.jsx';
import { bn } from '../utils/bn.js';
import { consult, medications, packetLink, patient, verifier } from '../utils/data.js';

const canPrint = (() => { try { return window.self === window.top; } catch { return false; } })();

/** One-page paper summary for doctors who prefer print; the QR opens the full packet. */
export default function PrintSummary({ open, onClose, fields, pending }) {
  const verified = fields.filter((f) => f.state === 'verified');
  return (
    <Modal open={open} onClose={onClose} title="এক পাতার সারাংশ" wide>
      <article className="print-sheet">
        <header className="print-sheet__head">
          <div>
            <p className="sheet__kicker">কেয়াররেডি হেলথ · ডাক্তারের জন্য সারাংশ</p>
            <h3>{patient.name}</h3>
            <p>{patient.age} বছর · {patient.sex} · রক্তের গ্রুপ {patient.blood} · {patient.id}</p>
            <p>{consult.doctor}, {consult.specialty} · {consult.when}</p>
          </div>
          <div className="print-sheet__qr">
            <QrCode value={packetLink} label="পূর্ণ রেকর্ড ফাইল খোলার কিউআর কোড" />
            <small>স্ক্যান করলে পূর্ণ রেকর্ড ফাইল ও মূল কাগজ খুলবে</small>
          </div>
        </header>

        <table className="print-sheet__table">
          <thead><tr><th>পরীক্ষা</th><th>মান</th><th>রেফারেন্স সীমা</th><th>উৎস</th></tr></thead>
          <tbody>
            {verified.map((f) => (
              <tr key={f.id}><td>{f.label}</td><td className="num"><strong>{f.value}</strong> {f.unit}{f.flag ? ` (${f.flag})` : ''}</td><td className="num">{f.ref}</td><td>পৃ. {f.page}</td></tr>
            ))}
          </tbody>
        </table>

        <div className="print-sheet__cols">
          <section>
            <h4>চলমান ওষুধ</h4>
            <ul>{medications.map((m) => (<li key={m.generic}>{m.generic} · {m.dose}</li>))}</ul>
          </section>
          <section>
            <h4>খেয়াল রাখুন</h4>
            <ul>
              <li>{patient.conditions.join(', ')}</li>
              <li>সালফা জাতীয় ওষুধে অ্যালার্জি</li>
              <li>{pending ? `${bn(pending)}টি তথ্য এখনো যাচাই বা উত্তরের অপেক্ষায়` : 'সব তথ্য যাচাই করা হয়েছে'}</li>
            </ul>
          </section>
        </div>

        <footer className="print-sheet__foot">যাচাই করেছেন {verifier.name} ({verifier.team}), {verifier.when} · {packetLink.replace('https://', '')}</footer>
      </article>
      <div className="modal__actions">
        {canPrint ? (
          <button type="button" className="btn btn--primary" onClick={() => window.print()}><Icon name="print" size={16} /> প্রিন্ট করুন</button>
        ) : (
          <p className="footnote"><Icon name="print" size={14} /> এই প্রিভিউ থেকে প্রিন্ট হয় না। প্রজেক্ট নিজের কম্পিউটারে চালালে এখানে প্রিন্ট বোতাম দেখাবে।</p>
        )}
      </div>
    </Modal>
  );
}
