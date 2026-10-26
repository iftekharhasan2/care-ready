import { useState } from 'react';
import WhoTag from './WhoTag.jsx';
import StatusPill from './StatusPill.jsx';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';
import { historyTone, historyTypes } from '../utils/data.js';

/** Every prescription, diagnosis, test and admission on one line of time, newest first. */
export default function HistoryTimeline({ events }) {
  const [type, setType] = useState('all');
  const shown = events.filter((e) => type === 'all' || e.type === type);
  const years = [...new Set(shown.map((e) => e.year))];

  return (
    <div className="history">
      <div className="choices" role="group" aria-label="ধরন অনুযায়ী বাছুন">
        {Object.entries(historyTypes).map(([key, label]) => (
          <button key={key} type="button" className={cx('choice choice--small', type === key && 'is-active')} aria-pressed={type === key} onClick={() => setType(key)}>{label}</button>
        ))}
      </div>
      {years.map((year) => (
        <section key={year} className="history__year">
          <h3>{year}</h3>
          <ol>
            {shown.filter((e) => e.year === year).map((e) => (
              <li key={e.date + e.title} className={`history__item history__item--${e.type}`}>
                <span className="history__date">{e.date}</span>
                <div>
                  <StatusPill tone={historyTone[e.type]} dot={false}>{historyTypes[e.type]}</StatusPill>
                  <strong>{e.title}</strong>
                  <span className="history__by">{e.doctor && <WhoTag name={e.doctor} />}<WhoTag name={e.place} /></span>
                  <span className={cx('history__src', e.reported && 'is-reported')}><Icon name={e.reported ? 'message' : 'link'} size={12} /> {e.src}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
