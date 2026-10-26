import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import { toLatin } from '../utils/bn.js';

const DEMO_CODE = '1234';

/** One-code approval, reused for login, agent consent and family approval. */
export default function OtpDialog({ open, onClose, onConfirm, title, description, phone, confirmLabel = 'নিশ্চিত করুন' }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (open) { setCode(''); setError(''); } }, [open]);

  const submit = (e) => {
    e.preventDefault();
    if (toLatin(code).trim() !== DEMO_CODE) return setError('কোড মেলেনি। এসএমএসে আসা ৪ সংখ্যার কোডটি আবার দিন।');
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form className="otp" onSubmit={submit} noValidate>
        <p>{description}</p>
        <p className="otp__phone"><Icon name="phone" size={15} /> {phone} নম্বরে ৪ সংখ্যার কোড পাঠানো হয়েছে।</p>
        <label className="field" htmlFor="otp-code">
          <span>কোড</span>
          <input id="otp-code" className="otp__input" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={4} placeholder="০০০০" value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} autoFocus />
        </label>
        {error && <p className="otp__error" role="alert">{error}</p>}
        <p className="footnote"><Icon name="lock" size={14} /> ডেমো কোড: ১২৩৪। কোড কাউকে বলবেন না, কেয়াররেডির কর্মীকেও না।</p>
        <button type="submit" className="btn btn--primary btn--block">{confirmLabel}</button>
      </form>
    </Modal>
  );
}
