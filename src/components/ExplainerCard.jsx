import RangeBar from './RangeBar.jsx';
import ListenButton from './ListenButton.jsx';
import StatusPill from './StatusPill.jsx';

export default function ExplainerCard({ item }) {
  const verdict = `আপনার মান স্বাভাবিক সীমার চেয়ে ${item.status}।`;
  return (
    <article className="explain">
      <header className="explain__head">
        <div>
          <h3>{item.name}</h3>
          <p className="num"><strong>{item.display}</strong> <span className="muted">স্বাভাবিক সীমা {item.ref}</span></p>
        </div>
        <StatusPill tone={item.tone}>{item.status}</StatusPill>
      </header>
      <RangeBar domain={item.domain} range={item.range} value={item.value} label={`${item.name}: ${verdict}`} />
      <div>
        <h4>এই পরীক্ষা কী মাপে</h4>
        <p>{item.measures}</p>
      </div>
      <p className="explain__verdict">{verdict}</p>
      <p className="footnote">এটি রোগ নির্ণয় নয়। মানটির অর্থ কী এবং কী করতে হবে, তা আপনার ডাক্তার বলবেন।</p>
      <ListenButton text={`${item.name}। ${item.measures} ${verdict} এটি রোগ নির্ণয় নয়।`} label="পড়ে শোনান" />
    </article>
  );
}
