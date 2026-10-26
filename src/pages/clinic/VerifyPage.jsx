import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import SourceViewer from '../../components/SourceViewer.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, cx } from '../../utils/bn.js';
import { idFor, verifySeed } from '../../utils/data.js';

const needed = (item) => (item.risk ? 2 : 1);

export default function VerifyPage({ notify }) {
  const [items, setItems] = useState(verifySeed);
  const open = items.filter((i) => i.reviews < needed(i)).length;

  const confirm = (id) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, reviews: i.reviews + 1 } : i)));
    notify('আপনার যাচাই নথিভুক্ত হয়েছে, উৎস পৃষ্ঠাসহ।');
  };
  const edit = (id, value) => setItems((list) => list.map((i) => (i.id === id ? { ...i, value, edited: true } : i)));

  return (
    <>
      <PageHeader eyebrow="যাচাই সারি" title="উৎসের সাথে মিলিয়ে দেখুন" lead="কম নিশ্চয়তার তথ্য একজন, আর ঝুঁকিপূর্ণ তথ্য দুইজন আলাদাভাবে যাচাই করেন। ডাক্তার শুধু যাচাই করা মান দেখেন।">
        <StatusPill tone={open ? 'stamp' : 'good'}>{open ? `${bn(open)}টি বাকি` : 'সারি খালি'}</StatusPill>
      </PageHeader>

      <div className="vgrid">
        {items.map((item) => {
          const done = item.reviews >= needed(item);
          return (
            <article key={item.id} className={cx('vcard', done && 'is-done')}>
              <header className="vcard__head">
                <div><strong>{item.field}</strong><span className="muted">{item.patient} · {idFor(item.patient)}</span></div>
                <div className="vcard__pills">
                  {item.risk && <StatusPill tone="crit" dot={false}>ঝুঁকিপূর্ণ: ২ জন</StatusPill>}
                  <StatusPill tone={item.confidence < 80 ? 'warn' : 'neutral'} dot={false}>নিশ্চয়তা {bn(item.confidence)}%</StatusPill>
                </div>
              </header>
              <SourceViewer title={item.doc} lines={item.lines} hit={item.hit} hand={item.hand} />
              {item.note && <p className="footnote"><Icon name="alert" size={14} /> {item.note}</p>}
              <label className="field" htmlFor={`verify-${item.id}`}>
                <span>পড়া মান {item.unit && `(${item.unit})`}</span>
                <input id={`verify-${item.id}`} className="num" type="text" value={item.value} disabled={done} onChange={(e) => edit(item.id, e.target.value)} />
              </label>
              <footer className="vcard__foot">
                <span className="muted">{bn(item.reviews)}/{bn(needed(item))} জন যাচাই করেছেন{item.edited ? ' · সংশোধিত' : ''}</span>
                {done ? <StatusPill tone="good">যাচাইকৃত</StatusPill> : <button type="button" className="btn btn--primary" onClick={() => confirm(item.id)}><Icon name="check" size={16} /> উৎসের সাথে মিলেছে</button>}
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}
