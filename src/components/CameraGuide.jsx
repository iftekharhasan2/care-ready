import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import StatusPill from './StatusPill.jsx';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';
import { cameraHints } from '../utils/data.js';

/** Simulated viewfinder: hints arrive while framing, and the shot is taken only when the page is readable. */
export default function CameraGuide({ open, onClose, onAdd }) {
  const [stage, setStage] = useState(0);
  const captured = stage >= cameraHints.length;
  const hint = cameraHints[Math.min(stage, cameraHints.length - 1)];

  useEffect(() => { if (open) setStage(0); }, [open]);
  useEffect(() => {
    if (!open || captured) return undefined;
    const t = setTimeout(() => setStage((s) => s + 1), 1700);
    return () => clearTimeout(t);
  }, [open, stage, captured]);

  return (
    <Modal open={open} onClose={onClose} title="রিপোর্টের ছবি তুলুন">
      <div className="cam">
        <div className={cx('cam__view', `cam__view--${captured ? 'ok' : hint.look}`, captured && 'is-captured')}>
          <span className="cam__paper" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          <span className="cam__corners" aria-hidden="true" />
        </div>
        <div className="cam__hint" aria-live="polite">
          {captured ? <StatusPill tone="good">ছবি উঠেছে, সব লেখা পড়া যাচ্ছে</StatusPill> : <StatusPill tone={hint.tone}>{hint.text}</StatusPill>}
        </div>
        <ol className="cam__dots" aria-hidden="true">
          {cameraHints.map((h, i) => (<li key={h.look} className={cx(i < stage && 'is-done', i === stage && 'is-current')} />))}
        </ol>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={() => setStage(0)}><Icon name="refresh" size={15} /> আবার তুলুন</button>
          <button type="button" className="btn btn--primary" disabled={!captured} onClick={() => { onAdd(); onClose(); }}><Icon name="check" size={15} /> এই ছবি যোগ করুন</button>
        </div>
        <p className="footnote">ডেমোতে ক্যামেরা চালু হয় না। আসল অ্যাপে এই নির্দেশগুলো সরাসরি ক্যামেরার ওপর দেখাবে।</p>
      </div>
    </Modal>
  );
}
