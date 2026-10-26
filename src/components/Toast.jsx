import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon.jsx';

export default function Toast({ toast }) {
  return (
    <div className="toast-zone" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className={`toast toast--${toast.tone}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
            <Icon name={toast.tone === 'warn' ? 'alert' : 'check'} size={16} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
