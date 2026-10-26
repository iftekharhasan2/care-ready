import { motion } from 'framer-motion';
import ListenButton from './ListenButton.jsx';
import { bn } from '../utils/bn.js';
import { patient, consult, verifier } from '../utils/data.js';

/** The Doctor-Ready Packet, drawn as the paper sheet the clinician receives. */
export default function PacketSheet({ fields, docs, pendingContext }) {
  const verified = fields.filter((f) => f.state === 'verified');
  const ready = verified.length === fields.length && pendingContext === 0;
  const usable = docs.filter((d) => d.tone !== 'crit');
  const speech = `${patient.name}, বয়স ${patient.age} বছর। ${consult.specialty} পরামর্শ, ${consult.when}। যাচাই করা তথ্য। ${verified.map((f) => `${f.label} ${f.value}, ${f.flag ? `স্বাভাবিকের চেয়ে ${f.flag}` : ''}`).join('। ')}। ${bn(pendingContext)}টি প্রশ্নের উত্তর বাকি।`;

  return (
    <article className="sheet" aria-label="ডাক্তারের জন্য রেকর্ড ফাইলের প্রিভিউ">
      <motion.div key={ready ? 'ok' : 'wip'} className={ready ? 'stamp' : 'stamp stamp--wip'} initial={{ scale: 1.5, opacity: 0, rotate: -3 }} animate={{ scale: 1, opacity: 1, rotate: -9 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
        <span>{ready ? 'যাচাইকৃত' : 'যাচাই চলছে'}</span>
        <small>{bn(verified.length)}/{bn(fields.length)} তথ্য</small>
      </motion.div>

      <header className="sheet__head">
        <p className="sheet__kicker">ডাক্তারের জন্য প্রস্তুত রেকর্ড ফাইল</p>
        <h3>{patient.name}</h3>
        <p>{patient.age} বছর · {patient.sex} · রক্তের গ্রুপ {patient.blood} · {patient.id}</p>
        <p>{consult.doctor}, {consult.specialty} · {consult.when}</p>
      </header>

      <ListenButton text={speech} label="রেকর্ড ফাইলের সারাংশ শুনুন" />

      <section>
        <h4>যাচাইকৃত তথ্য</h4>
        <dl className="sheet__list">
          {verified.map((f) => (
            <div key={f.id}>
              <dt>{f.label}</dt>
              <dd className="num">{f.value} <span>{f.unit}</span> <em>পৃ. {f.page}</em></dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h4>সময়ক্রম অনুযায়ী কাগজপত্র ({bn(usable.length)}টি)</h4>
        <ul className="sheet__docs">
          {usable.map((d) => (<li key={d.id}><span>{d.date}</span>{d.title}</li>))}
        </ul>
      </section>

      <footer className="sheet__foot">
        {pendingContext > 0 ? `${bn(pendingContext)}টি প্রশ্নের উত্তর বাকি। ` : 'সব প্রশ্নের উত্তর দেওয়া হয়েছে। '}
        যাচাই করেছেন {verifier.name}, {verifier.when}। মূল ফাইল সবসময় রোগীর কাছে থাকে।
      </footer>
    </article>
  );
}
