import { motion } from 'framer-motion';
import StatusPill from './StatusPill.jsx';
import { cx } from '../utils/bn.js';

export default function DocumentCard({ doc, selected, lowData, onSelect, index = 0 }) {
  return (
    <motion.button
      type="button"
      className={cx('doc', selected && 'is-selected')}
      aria-pressed={selected}
      onClick={() => onSelect(doc.id)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ y: -2 }}
    >
      {!lowData && (
        <span className={cx('doc__thumb', `doc__thumb--${doc.thumb}`)} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      )}
      <span className="doc__body">
        <span className="doc__title">{doc.title}</span>
        <span className="doc__meta">{doc.source}</span>
        <span className="doc__meta">{doc.date} · {doc.kind} · {doc.pages} পৃষ্ঠা</span>
        <StatusPill tone={doc.tone}>{doc.quality}</StatusPill>
        {doc.guide && <span className="doc__guide">{doc.guide}</span>}
      </span>
    </motion.button>
  );
}
