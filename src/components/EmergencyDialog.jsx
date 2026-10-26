import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';
import { emergencyTimes, idFor, patientNames, slotKind } from '../utils/data.js';
import { testsReady } from '../utils/tests.js';

/** Clinic-only: book an appointment outside the normal steps, with a reason on record. */
export default function EmergencyDialog({ open, onClose, patient, onCreate, orders = [], tele }) {
  const [form, setForm] = useState({ patient: patient || patientNames[0], reason: '', kind: 'physical', slot: 0, told: false });
  const [error, setError] = useState('');
  useEffect(() => { if (open) { setForm({ patient: patient || patientNames[0], reason: '', kind: 'physical', slot: 0, told: false }); setError(''); } }, [open, patient]);

  const order = orders.find((o) => o.patient === form.patient);
  const request = tele?.requests.find((r) => r.patient === form.patient);
  const bypassed = [
    order && !testsReady(order) ? 'জরুরি পরীক্ষার রিপোর্ট বাকি' : null,
    request && !['confirmed', 'advice'].includes(request.status) ? 'ভিডিওর পরের ধাপ শেষ হয়নি' : null,
  ].filter(Boolean);

  const submit = (e) => {
    e.preventDefault();
    if (!form.reason.trim()) return setError('কেন জরুরি তা লিখুন। এটি ডাক্তার ও অডিট তালিকায় যাবে।');
    if (!form.told) return setError('আগে ডাক্তারকে ফোনে জানান, তারপর টিক দিন।');
    onCreate({ patient: form.patient, reason: form.reason.trim(), kind: form.kind, ...emergencyTimes[form.slot], bypassed });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="জরুরি সাক্ষাৎ ঠিক করুন">
      <form className="form" onSubmit={submit} noValidate>
        <p className="footnote footnote--crit"><Icon name="alert" size={14} /> বুকে ব্যথা, তীব্র শ্বাসকষ্ট বা অজ্ঞান হলে সাক্ষাৎ নয়: রোগীকে এখনই ৯৯৯ বা কাছের জরুরি বিভাগে পাঠান।</p>
        <label className="field" htmlFor="urgent-patient"><span>রোগী</span>
          <select id="urgent-patient" value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))}>{patientNames.map((n) => (<option key={n} value={n}>{n} · {idFor(n)}</option>))}</select>
        </label>
        <label className="field" htmlFor="urgent-reason"><span>কেন জরুরি</span><textarea id="urgent-reason" rows="2" placeholder="যেমন: পা ও মুখ হঠাৎ অনেক ফুলেছে, প্রস্রাব কমে গেছে" value={form.reason} onChange={(e) => { setForm((f) => ({ ...f, reason: e.target.value })); setError(''); }} /></label>
        <div className="field"><span>কীভাবে</span>
          <div className="choices" role="group" aria-label="সাক্ষাতের ধরন">
            {Object.entries(slotKind).map(([key, label]) => (<button key={key} type="button" className={cx('choice', form.kind === key && 'is-active')} aria-pressed={form.kind === key} onClick={() => setForm((f) => ({ ...f, kind: key }))}>{label}</button>))}
          </div>
        </div>
        <label className="field" htmlFor="urgent-time"><span>কখন</span>
          <select id="urgent-time" value={form.slot} onChange={(e) => setForm((f) => ({ ...f, slot: Number(e.target.value) }))}>{emergencyTimes.map((t, i) => (<option key={t.time} value={i}>{t.day}, {t.time}</option>))}</select>
        </label>
        {bypassed.length > 0 && <div className="bypass"><strong>যে নিয়ম বাদ যাচ্ছে</strong><ul className="tags">{bypassed.map((b) => (<li key={b}>{b}</li>))}</ul></div>}
        <label className="option" htmlFor="urgent-told">
          <input id="urgent-told" type="checkbox" checked={form.told} onChange={(e) => { setForm((f) => ({ ...f, told: e.target.checked })); setError(''); }} />
          <span><strong>ডাক্তারকে ফোনে জানিয়েছি, তিনি এই সময়ে দেখতে পারবেন</strong><small>এটি ডাক্তারের সময়সূচির বাইরে অতিরিক্ত সাক্ষাৎ।</small></span>
        </label>
        {error && <p className="otp__error" role="alert">{error}</p>}
        <button type="submit" className="btn btn--urgent btn--block"><Icon name="alert" size={16} /> জরুরি সাক্ষাৎ নিশ্চিত করুন</button>
      </form>
    </Modal>
  );
}
