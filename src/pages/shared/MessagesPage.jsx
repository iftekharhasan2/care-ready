import { useEffect, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import MessageBubble from '../../components/MessageBubble.jsx';
import Composer from '../../components/Composer.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { cx } from '../../utils/bn.js';
import { PEOPLE, idFor, messageCopy } from '../../utils/data.js';

/** One communication dashboard, shown differently to each role.
    Private messages never reach the clinic desk, not even as a preview. */
export default function MessagesPage({ role, threads, onSend, notify }) {
  const copy = messageCopy[role];
  const canPrivate = role !== 'clinic';
  const mine = role === 'patient' ? threads.filter((t) => t.id === 'rahima') : threads;
  const [activeId, setActiveId] = useState(mine[0].id);
  const [onlyPrivate, setOnlyPrivate] = useState(false);
  const listRef = useRef(null);

  const allowed = (t) => t.messages.filter((m) => canPrivate || !m.private);
  const thread = mine.find((t) => t.id === activeId) ?? mine[0];
  const visible = allowed(thread).filter((m) => !onlyPrivate || m.private);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible.length, activeId]);

  const send = (text, isPrivate) => {
    onSend(thread.id, { from: role, text, private: isPrivate, when: 'এইমাত্র' });
    if (isPrivate) notify('ব্যক্তিগত বার্তা পাঠানো হয়েছে। ক্লিনিক ডেস্ক এটি দেখতে পাবে না।');
  };

  return (
    <>
      <PageHeader eyebrow="বার্তা" title={copy.title} lead={copy.lead} />

      <div className="msg-layout">
        <div className="stack">
          {role === 'patient' ? (
            <Panel title="এই কথোপকথনে আছেন">
              <ul className="rows">
                {['doctor', 'clinic'].map((k) => (
                  <li key={k}><Avatar kind={PEOPLE[k].avatar} /><div><strong>{PEOPLE[k].name}</strong><span className="muted">{PEOPLE[k].title} · {PEOPLE[k].id}</span></div></li>
                ))}
              </ul>
            </Panel>
          ) : (
            <Panel title="রোগী">
              <ul className="threads">
                {mine.map((t) => {
                  const last = allowed(t).at(-1);
                  return (
                    <li key={t.id}>
                      <button type="button" className={cx('threads__item', t.id === thread.id && 'is-active')} aria-current={t.id === thread.id} onClick={() => setActiveId(t.id)}>
                        <Avatar kind={t.avatar} name={t.patient} />
                        <span><strong>{t.patient} <code className="id">{idFor(t.patient)}</code></strong><small>{last ? last.text : 'এখনো কোনো বার্তা নেই'}</small></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}

          <Panel title="কে কী দেখেন">
            <ul className="facts">
              <li><Icon name="message" size={16} /> সাধারণ বার্তা: রোগী, ডাক্তার ও ক্লিনিক ডেস্ক</li>
              <li><Icon name="lock" size={16} /> ব্যক্তিগত বার্তা: শুধু রোগী ও ডাক্তার</li>
              {role === 'clinic' && <li><Icon name="shield" size={16} /> ব্যক্তিগত বার্তা এই পর্দায় আসে না, এমনকি তার সংখ্যাও নয়।</li>}
              {role === 'patient' && <li><Icon name="phone" size={16} /> জরুরি হলে বার্তা নয়, ৯৯৯ এ ফোন করুন।</li>}
            </ul>
          </Panel>
        </div>

        <section className="convo" aria-label={`${thread.patient}-এর কথোপকথন`}>
          <header className="convo__head">
            <div className="person">
              <Avatar kind={role === 'patient' ? 'doctor' : thread.avatar} name={thread.patient} size="lg" />
              <div><strong>{role === 'patient' ? 'আপনার কেয়ার টিম' : thread.patient}</strong><span className="muted">{role === 'patient' ? thread.about : `${idFor(thread.patient)} · ${thread.about}`}</span></div>
            </div>
            {canPrivate ? (
              <div className="segmented" role="tablist" aria-label="বার্তা বাছুন">
                <button type="button" role="tab" aria-selected={!onlyPrivate} className={cx(!onlyPrivate && 'is-active')} onClick={() => setOnlyPrivate(false)}>সব বার্তা</button>
                <button type="button" role="tab" aria-selected={onlyPrivate} className={cx(onlyPrivate && 'is-active')} onClick={() => setOnlyPrivate(true)}>শুধু ব্যক্তিগত</button>
              </div>
            ) : (<StatusPill tone="neutral" dot={false}>সাধারণ বার্তা</StatusPill>)}
          </header>

          <ul className="convo__list" ref={listRef}>
            {visible.length ? visible.map((m, i) => (<MessageBubble key={i} message={m} thread={thread} mine={m.from === role} />)) : (<li className="convo__empty">এখানে এখনো কোনো ব্যক্তিগত বার্তা নেই।</li>)}
          </ul>

          <Composer key={thread.id} canPrivate={canPrivate} lockLabel={copy.lock} privateNote={copy.note} onSend={send} />
        </section>
      </div>
    </>
  );
}
