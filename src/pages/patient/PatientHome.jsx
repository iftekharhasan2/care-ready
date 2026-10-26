import HeroBanner from '../../components/HeroBanner.jsx';
import EmergencyList from '../../components/EmergencyList.jsx';
import Panel from '../../components/Panel.jsx';
import ProgressRing from '../../components/ProgressRing.jsx';
import QrCode from '../../components/QrCode.jsx';
import IdChip from '../../components/IdChip.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import patientImg from '../../assets/role-patient.svg';
import { accessHistory, carePlanSeed, careTeam, consult, contextChecklist, extractedFields, idFor, patient, quickActions } from '../../utils/data.js';
import { bn, toLatin } from '../../utils/bn.js';

export default function PatientHome({ goTo, notify, emergencies }) {
  const urgent = emergencies.filter((e) => e.patient === patient.name);
  const verified = extractedFields.filter((f) => f.state === 'verified').length;
  const unanswered = contextChecklist.filter((c) => !c.done).length;
  const tasksDone = carePlanSeed.filter((t) => t.done).length;

  return (
    <>
      <HeroBanner eyebrow="শুভ সকাল, রহিমা বেগম" title="আপনার রেকর্ড ফাইল প্রায় তৈরি" lead={`ডাক্তার দেখানোর আগে ${bn(unanswered)}টি প্রশ্নের উত্তর দিন। লিখতে না চাইলে মুখে বললেই হবে।`} image={patientImg} alt="ফোনে রিপোর্টের ছবি তুলছেন একজন বয়স্ক নারী">
        <button type="button" className="btn btn--light" onClick={() => goTo('record')}>রেকর্ড ফাইল শেষ করুন <Icon name="arrow" size={16} /></button>
        <button type="button" className="btn btn--outline" onClick={() => goTo('access')}>অ্যাপ ছাড়া পাঠান</button>
      </HeroBanner>

      {urgent.length > 0 && (
        <Panel title="আপনার জরুরি সাক্ষাৎ" hint="ক্লিনিক আপনার অবস্থা দেখে দ্রুত সময় ঠিক করেছে। পরীক্ষার রিপোর্ট বাকি থাকলেও এই সাক্ষাৎ হবে।">
          <EmergencyList role="patient" emergencies={urgent} notify={notify} />
        </Panel>
      )}

      <div className="grid-3">
        <Panel title="পরের সাক্ষাৎ" action={<StatusPill tone="info">৪ দিন বাকি</StatusPill>}>
          <div className="person">
            <Avatar kind="doctor" size="lg" />
            <div><strong>{consult.doctor}</strong><span className="muted">{consult.specialty} · {idFor(consult.doctor)}</span></div>
          </div>
          <ul className="facts">
            <li><Icon name="calendar" size={16} /> {consult.when}</li>
            <li><Icon name="clinic" size={16} /> {consult.place}</li>
          </ul>
        </Panel>

        <Panel title="রেকর্ড ফাইলের অবস্থা">
          <div className="ring-row">
            <ProgressRing value={verified} total={extractedFields.length} label="যাচাইকৃত তথ্য" />
            <div><strong>তথ্য যাচাই হয়েছে</strong><span className="muted">{bn(unanswered)}টি প্রশ্নের উত্তর এবং ১টি ছবি আবার তোলা বাকি</span></div>
          </div>
          <button type="button" className="link-btn" onClick={() => goTo('record')}>রেকর্ড ফাইল খুলুন <Icon name="arrow" size={14} /></button>
        </Panel>

        <Panel title="আজকের কাজ">
          <div className="ring-row">
            <ProgressRing value={tasksDone} total={carePlanSeed.length} label="আজকের কাজ" />
            <div><strong>কাজ শেষ হয়েছে</strong><span className="muted">পরের কাজ: {carePlanSeed.find((t) => !t.done).text}</span></div>
          </div>
          <button type="button" className="link-btn" onClick={() => goTo('followup')}>সব কাজ দেখুন <Icon name="arrow" size={14} /></button>
        </Panel>
      </div>

      <Panel title="দ্রুত কাজ">
        <div className="quick">
          {quickActions.map((a) => (
            <button key={a.label} type="button" className="quick__item" onClick={() => goTo(a.to)}>
              <span className="quick__icon"><Icon name={a.icon} size={22} /></span>{a.label}
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid-3">
        <Panel title="আপনার রোগী আইডি" hint="ক্লিনিক বা এজেন্ট পয়েন্টে এটি দেখান বা বলুন।">
          <div className="idcard">
            <QrCode value={toLatin(patient.id)} size={104} label="রোগী আইডির কিউআর কোড" />
            <div><strong>{patient.name}</strong><span className="muted">{patient.age} বছর · {patient.area}</span><IdChip id={patient.id} label="রোগী আইডি" /></div>
          </div>
          <p className="footnote">একই নামের অন্য রোগী থাকলেও আইডি আলাদা, তাই আপনার রেকর্ড অন্যের সাথে মিশবে না।</p>
        </Panel>
        <Panel title="আপনার কেয়ার টিম" hint="যারা এখন আপনার রেকর্ড দেখতে পারেন।">
          <ul className="rows">
            {careTeam.map((m) => (
              <li key={m.name}><Avatar kind={m.avatar} name={m.name} /><div><strong>{m.name} {m.id && <code className="id">{m.id}</code>}</strong><span className="muted">{m.role}</span></div></li>
            ))}
          </ul>
        </Panel>
        <Panel title="সাম্প্রতিক কার্যকলাপ">
          <ul className="log">
            {accessHistory.map((a) => (<li key={a.when + a.who}><span className="log__when">{a.when}</span><span><strong>{a.who}</strong> {a.what}</span></li>))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
