/** Where a value sits against its reference range, on one linear scale. */
export default function RangeBar({ domain, range, value, label }) {
  const pct = (v) => Math.max(0, Math.min(100, ((v - domain[0]) / (domain[1] - domain[0])) * 100));
  return (
    <div className="range" role="img" aria-label={label}>
      <div className="range__track">
        <span className="range__band" style={{ left: `${pct(range[0])}%`, width: `${pct(range[1]) - pct(range[0])}%` }} />
        <span className="range__mark" style={{ left: `${pct(value)}%` }} />
      </div>
      <div className="range__legend"><span>কম</span><span>স্বাভাবিক সীমা</span><span>বেশি</span></div>
    </div>
  );
}
