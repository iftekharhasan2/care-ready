import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { approvalsSeed, idFor } from '../../utils/data.js';

export default function DoctorApprovalsPage({ notify }) {
  const [choice, setChoice] = useState({});
  const [sent, setSent] = useState({});
  const open = approvalsSeed.filter((a) => !sent[a.id]).length;

  const send = (a) => {
    setSent((s) => ({ ...s, [a.id]: choice[a.id] }));
    notify(`সিদ্ধান্ত পাঠানো হয়েছে: ${choice[a.id]}। রোগীর তালিকা সে অনুযায়ী বদলাবে (ডেমো)।`);
  };

  return (
    <>
      <PageHeader eyebrow="অনুমোদন" title="যে সিদ্ধান্তগুলো শুধু আপনিই নিতে পারেন" lead="ওষুধের সময়, কেয়ার প্ল্যান বা বিদেশি মতামতের পরের ধাপ আপনার অনুমোদন ছাড়া রোগীর কাছে যায় না।">
        <StatusPill tone={open ? 'warn' : 'good'}>{open ? `${bn(open)}টি বাকি` : 'সব শেষ'}</StatusPill>
      </PageHeader>

      <div className="vgrid">
        {approvalsSeed.map((a) => (
          <article key={a.id} className={cx('vcard', sent[a.id] && 'is-done')}>
            <header className="vcard__head">
              <div className="person"><Avatar kind={a.avatar} name={a.patient} /><div><strong>{a.patient} <code className="id">{idFor(a.patient)}</code></strong><span className="muted">{a.title}</span></div></div>
              <StatusPill tone={a.tone} dot={false}>{a.kind}</StatusPill>
            </header>
            <p>{a.detail}</p>
            <fieldset className="fieldset" disabled={Boolean(sent[a.id])}>
              <legend>আপনার সিদ্ধান্ত</legend>
              {a.options.map((o, i) => (
                <label key={o} className="option" htmlFor={`${a.id}-${i}`}>
                  <input id={`${a.id}-${i}`} type="radio" name={a.id} checked={choice[a.id] === o} onChange={() => setChoice((c) => ({ ...c, [a.id]: o }))} />
                  <span><strong>{o}</strong></span>
                </label>
              ))}
            </fieldset>
            <footer className="vcard__foot">
              {sent[a.id] ? (<><span className="muted">পাঠানো হয়েছে: {sent[a.id]}</span><StatusPill tone="good">সম্পন্ন</StatusPill></>) : (
                <button type="button" className="btn btn--primary btn--block" disabled={!choice[a.id]} onClick={() => send(a)}><Icon name="send" size={16} /> সিদ্ধান্ত পাঠান</button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </>
  );
}
