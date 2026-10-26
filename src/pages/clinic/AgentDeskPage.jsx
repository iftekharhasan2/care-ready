import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StepTrack from '../../components/StepTrack.jsx';
import OtpDialog from '../../components/OtpDialog.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { agent, agentLog, agentRules, agentSteps, sampleNumber } from '../../utils/data.js';

export default function AgentDeskPage({ notify }) {
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState(false);

  return (
    <>
      <PageHeader eyebrow="এজেন্ট ডেস্ক" title="রোগীর হয়ে কাগজ জমা" lead="ফার্মেসি, ডায়াগনস্টিক সেন্টার বা ক্লিনিকের ডেস্ক থেকে। রোগীর ফোনে আসা কোড ছাড়া কিছুই জমা হয় না।" />

      <div className="grid-2 grid-2--wide-left">
        <Panel title="নতুন জমা" action={<StatusPill tone="info">এজেন্টের পর্দা</StatusPill>}>
          <div className="agent">
            <span className="agent__icon" aria-hidden="true"><Icon name="store" size={22} /></span>
            <div><strong>{agent.name}</strong><span className="muted">{agent.place} · এজেন্ট আইডি {agent.id}</span><span className="muted">{agent.since}</span></div>
          </div>
          <StepTrack steps={agentSteps} current={step === 3 ? 4 : step} />

          {step === 0 && (
            <>
              <label className="field" htmlFor="agent-phone"><span>রোগীর মোবাইল নম্বর</span><input id="agent-phone" type="tel" inputMode="numeric" defaultValue="০১৭XX-XXXXXX" /></label>
              <button type="button" className="btn btn--primary btn--block" onClick={() => setOtp(true)}>রোগীর ফোনে সম্মতির কোড পাঠান</button>
            </>
          )}
          {step === 2 && (
            <button type="button" className="btn btn--primary btn--block" onClick={() => { setStep(3); notify('৪টি কাগজ জমা হয়েছে। এজেন্টের অনুমতি শেষ।'); }}><Icon name="camera" size={16} /> ৪টি কাগজ স্ক্যান করে জমা দিন</button>
          )}
          {step === 3 && (
            <div className="receipt">
              <strong>রসিদ নং R-১০১০-০৪২</strong>
              <span>৪টি কাগজ জমা হয়েছে · রহিমা বেগম</span>
              <span>রোগী এসএমএসে রেকর্ড ফাইলের লিংক পাবেন।</span>
              <span>এজেন্টের যন্ত্রে কোনো কপি রাখা হয়নি।</span>
              <button type="button" className="link-btn" onClick={() => setStep(0)}><Icon name="refresh" size={14} /> পরের রোগী</button>
            </div>
          )}
        </Panel>

        <div className="stack">
          <Panel title="এজেন্টের সীমা">
            <ul className="facts">
              {agentRules.map((r) => (<li key={r}><Icon name="shield" size={16} /> {r}</li>))}
            </ul>
          </Panel>
          <Panel title="আজকের জমা">
            <ul className="log">
              {agentLog.map((a) => (<li key={a.when + a.who}><span className="log__when">{a.when}</span><span><strong>{a.who}</strong> {a.what}</span></li>))}
            </ul>
          </Panel>
        </div>
      </div>

      <OtpDialog open={otp} onClose={() => setOtp(false)} onConfirm={() => { setStep(2); notify('রোগী সম্মতি দিয়েছেন। এখন কাগজ স্ক্যান করা যাবে।'); }} phone={sampleNumber} title="এজেন্টকে আপলোডের অনুমতি" description="এজেন্ট শুধু কাগজ স্ক্যান করে জমা দিতে পারবেন। রিপোর্ট খুলে দেখতে বা রেখে দিতে পারবেন না। অনুমতি ২ ঘণ্টা পর নিজে থেকে শেষ হবে।" confirmLabel="সম্মতি দিন" />
    </>
  );
}
