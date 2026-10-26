import StatusPill from './StatusPill.jsx';

export default function Timeline({ events }) {
  return (
    <ol className="timeline">
      {events.map((e) => (
        <li key={e.date + e.title} className={`timeline__item timeline__item--${e.tone}`}>
          <span className="timeline__date">{e.date}</span>
          <div>
            <StatusPill tone={e.tone} dot={false}>{e.type}</StatusPill>
            <strong>{e.title}</strong>
            <span className="muted">{e.detail}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
