import AppointmentCard from './AppointmentCard.jsx';
import StatusPill from './StatusPill.jsx';
import { consult, idFor } from '../utils/data.js';

/** Emergency appointments, with the actions each role may take. */
export default function EmergencyList({ role, emergencies, emergencyActions, notify }) {
  if (!emergencies.length) return <p className="muted">এখন কোনো জরুরি সাক্ষাৎ নেই।</p>;
  return (
    <div className="urgent-list">
      {emergencies.map((e) => (
        <div key={e.id} className="urgent">
          <AppointmentCard urgent slot={{ kind: e.kind, day: e.day, time: e.time }} title={role === 'patient' ? `${consult.doctor} · ${consult.specialty}` : `${e.patient} · ${idFor(e.patient)}`} sub={e.reason} onJoin={() => notify('ডেমোতে মিট খোলে না।', 'warn')}>
            {role === 'doctor' && (e.ack ? <StatusPill tone="good">আপনি দেখেছেন</StatusPill> : <button type="button" className="btn btn--ghost" onClick={() => { emergencyActions.ack(e.id); notify('ক্লিনিককে জানানো হয়েছে যে আপনি দেখেছেন।'); }}>দেখেছি, আসতে বলুন</button>)}
            {role === 'clinic' && <StatusPill tone={e.ack ? 'good' : 'warn'}>{e.ack ? 'ডাক্তার দেখেছেন' : 'ডাক্তার এখনো দেখেননি'}</StatusPill>}
            {role === 'clinic' && <button type="button" className="btn btn--danger" onClick={() => { emergencyActions.cancel(e.id); notify('জরুরি সাক্ষাৎ বাতিল হয়েছে। রোগী ও ডাক্তারকে জানানো হয়েছে (ডেমো)।'); }}>বাতিল করুন</button>}
          </AppointmentCard>
          {role !== 'patient' && (
            <p className="urgent__audit">ঠিক করেছেন {e.by} · {e.at}{e.bypassed.length ? ` · বাদ গেছে: ${e.bypassed.join(', ')}` : ''}</p>
          )}
        </div>
      ))}
    </div>
  );
}
