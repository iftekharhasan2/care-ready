import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import GrantCard from '../../components/GrantCard.jsx';
import Icon from '../../components/Icon.jsx';
import AbroadAccount from '../../components/AbroadAccount.jsx';
import OtpDialog from '../../components/OtpDialog.jsx';
import { bn } from '../../utils/bn.js';
import { abroad, accessHistory, expiryOptions, grantsSeed, sampleNumber, scopeOptions } from '../../utils/data.js';

const EMPTY = { name: '', relation: '', scope: scopeOptions[0], expiry: expiryOptions[1] };

export default function FamilyPage({ notify }) {
  const [grants, setGrants] = useState(grantsSeed);
  const [form, setForm] = useState(EMPTY);
  const [otp, setOtp] = useState(false);
  const [approved, setApproved] = useState(false);

  const approve = () => {
    setApproved(true);
    setGrants((list) => [...list, { id: 'g-abroad', name: abroad.name, relation: `${abroad.relation}, ${abroad.place}`, scope: ['খরচ পরিশোধ', 'অ্যাপয়েন্টমেন্ট', 'ফাইল আপলোড'], expiry: '১০ অক্টোবর ২০২৭', last: 'এখনো ব্যবহার হয়নি', active: true }]);
    notify('ইমরানের অনুরোধ অনুমোদিত হয়েছে। তিনি এখন খরচ দিতে ও ফাইল পাঠাতে পারবেন।');
  };
  const activeCount = grants.filter((g) => g.active).length;

  const revoke = (id) => {
    setGrants((list) => list.map((g) => (g.id === id ? { ...g, active: false } : g)));
    notify('অনুমতি বাতিল হয়েছে। তিনি আর কোনো রেকর্ড দেখতে পারবেন না।');
  };
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return notify('যাকে অনুমতি দেবেন তার নাম লিখুন।', 'warn');
    setGrants((list) => [...list, { id: `g${Date.now()}`, name: form.name.trim(), relation: form.relation.trim() || 'পরিবারের সদস্য', scope: [form.scope], expiry: `আজ থেকে ${form.expiry}`, last: 'এখনো ব্যবহার হয়নি', active: true }]);
    setForm(EMPTY);
    notify('অনুমতি দেওয়া হয়েছে। মেয়াদ শেষে নিজে থেকেই বন্ধ হবে।');
  };

  return (
    <>
      <PageHeader eyebrow="পরিবারের জন্য অনুমতি" title="কে কী দেখতে পারবে" lead={`${bn(activeCount)} জনের অনুমতি চালু আছে। নিয়ন্ত্রণ সবসময় রহিমা বেগমের হাতে।`} />

      <div className="grid-2 grid-2--wide-left">
        <Panel title="দেওয়া অনুমতি" hint="প্রতিটি অনুমতির নির্দিষ্ট কাজ ও মেয়াদ আছে। যেকোনো সময় বাতিল করা যায়।">
          <ul className="grants">
            {grants.map((g) => (<GrantCard key={g.id} grant={g} onRevoke={revoke} />))}
          </ul>
        </Panel>

        <div className="stack">
          <Panel title="বিদেশ থেকে পরিবারের অনুরোধ" hint="প্রবাসী সন্তান খরচ দিতে ও দেখভাল করতে পারেন, আপনার এক কোডের অনুমোদনে।">
            <AbroadAccount approved={approved} onApprove={() => setOtp(true)} />
          </Panel>

          <Panel title="নতুন কাউকে অনুমতি দিন">
            <form className="form" onSubmit={submit} noValidate>
              <label className="field" htmlFor="grant-name"><span>নাম</span><input id="grant-name" type="text" placeholder="যেমন: রাশেদা খাতুন" value={form.name} onChange={set('name')} /></label>
              <label className="field" htmlFor="grant-relation"><span>সম্পর্ক</span><input id="grant-relation" type="text" placeholder="যেমন: বোন" value={form.relation} onChange={set('relation')} /></label>
              <label className="field" htmlFor="grant-scope"><span>কী করতে পারবেন</span>
                <select id="grant-scope" value={form.scope} onChange={set('scope')}>{scopeOptions.map((o) => (<option key={o}>{o}</option>))}</select>
              </label>
              <label className="field" htmlFor="grant-expiry"><span>মেয়াদ</span>
                <select id="grant-expiry" value={form.expiry} onChange={set('expiry')}>{expiryOptions.map((o) => (<option key={o}>{o}</option>))}</select>
              </label>
              <button type="submit" className="btn btn--primary btn--block"><Icon name="shield" size={16} /> অনুমতি দিন</button>
            </form>
          </Panel>

          <Panel title="সাম্প্রতিক কার্যকলাপ">
            <ul className="log">
              {accessHistory.map((a) => (
                <li key={a.when + a.who}><span className="log__when">{a.when}</span><span><strong>{a.who}</strong> {a.what}</span></li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <OtpDialog open={otp} onClose={() => setOtp(false)} onConfirm={approve} title="ইমরানের অনুরোধ অনুমোদন" description="অনুমোদন দিলে ইমরান আহমেদ খরচ দিতে, অ্যাপয়েন্টমেন্ট ঠিক করতে ও ফাইল পাঠাতে পারবেন। তিনি রেকর্ড অন্য কাউকে দিতে পারবেন না।" phone={sampleNumber} confirmLabel="অনুমোদন করুন" />
    </>
  );
}
