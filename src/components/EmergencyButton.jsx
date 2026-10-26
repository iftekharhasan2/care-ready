import { useState } from 'react';
import EmergencyDialog from './EmergencyDialog.jsx';
import Icon from './Icon.jsx';

export default function EmergencyButton({ patient, label = 'জরুরি সাক্ষাৎ ঠিক করুন', notify, emergencyActions, orders, tele }) {
  const [open, setOpen] = useState(false);
  const create = (entry) => {
    emergencyActions.create(entry);
    notify(`${entry.patient}-এর জরুরি সাক্ষাৎ ঠিক হয়েছে। রোগী ও ডাক্তারকে জানানো হয়েছে (ডেমো)।`, 'warn');
  };
  return (
    <>
      <button type="button" className="btn btn--urgent" onClick={() => setOpen(true)}><Icon name="alert" size={16} /> {label}</button>
      <EmergencyDialog open={open} onClose={() => setOpen(false)} patient={patient} onCreate={create} orders={orders} tele={tele} />
    </>
  );
}
