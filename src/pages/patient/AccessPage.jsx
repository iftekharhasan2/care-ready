import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import ChannelEntry from '../../components/ChannelEntry.jsx';
import OtpDialog from '../../components/OtpDialog.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { nearbyAgents, sampleNumber } from '../../utils/data.js';

export default function AccessPage({ notify }) {
  const [otp, setOtp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <PageHeader eyebrow="সহজ প্রবেশ" title="অ্যাপ ছাড়াই, পাসওয়ার্ড ছাড়াই" lead="স্মার্টফোন বা টাইপ করার অভ্যাস না থাকলেও রেকর্ড জমা দেওয়া যায়: চ্যাটে ছবি পাঠিয়ে, অথবা কাছের এজেন্ট পয়েন্টে গিয়ে।" />

      <div className="grid-2">
        <Panel title="চ্যাটে ছবি পাঠান, লিংক পান এসএমএসে" hint="যে অ্যাপ আগে থেকেই ব্যবহার করেন, সেখান থেকেই।">
          <ChannelEntry />
        </Panel>

        <div className="stack">
          <Panel title="ফোন নম্বর দিয়ে প্রবেশ" action={<StatusPill tone={loggedIn ? 'good' : 'neutral'}>{loggedIn ? 'প্রবেশ করেছেন' : 'প্রবেশ করেননি'}</StatusPill>}>
            <label className="field" htmlFor="login-phone"><span>মোবাইল নম্বর</span><input id="login-phone" type="tel" inputMode="numeric" defaultValue="০১৭XX-XXXXXX" /></label>
            <button type="button" className="btn btn--primary btn--block" disabled={loggedIn} onClick={() => setOtp(true)}><Icon name="lock" size={16} /> কোড পাঠান</button>
            <p className="footnote">ফোন হারালে নতুন সিমে একই নম্বর তুলে আবার প্রবেশ করা যায়। সাহায্য লাগলে কর্মী বাংলায় ফোন করবেন।</p>
          </Panel>

          <Panel title="কাছের এজেন্ট পয়েন্ট" hint="কাগজ নিয়ে যান। এজেন্ট স্ক্যান করে দেবেন, আপনার ফোনে আসা কোড দিয়ে সম্মতি দিলেই হবে।">
            <ul className="rows">
              {nearbyAgents.map((a) => (
                <li key={a.name}>
                  <Icon name="store" size={18} />
                  <div><strong>{a.name}</strong><span className="muted">{a.place} · {a.hours}</span></div>
                  <StatusPill tone="info" dot={false}>{a.dist}</StatusPill>
                </li>
              ))}
            </ul>
            <p className="footnote"><Icon name="shield" size={14} /> এজেন্ট আপনার রিপোর্ট খুলে দেখতে বা রেখে দিতে পারেন না।</p>
          </Panel>
        </div>
      </div>

      <OtpDialog open={otp} onClose={() => setOtp(false)} onConfirm={() => { setLoggedIn(true); notify('প্রবেশ করেছেন। কোনো পাসওয়ার্ড মনে রাখতে হবে না।'); }} phone={sampleNumber} title="ফোন নম্বর দিয়ে প্রবেশ" description="পাসওয়ার্ড লাগবে না। ফোনে আসা কোডটি দিলেই আপনার রেকর্ড ফাইল খুলবে।" confirmLabel="প্রবেশ করুন" />
    </>
  );
}
