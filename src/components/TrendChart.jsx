import { bn } from '../utils/bn.js';

const W = 560, H = 230, P = { l: 46, r: 22, t: 26, b: 46 };

/** One linear scale drives marks, ticks, labels and the reference band. */
export default function TrendChart({ series }) {
  const { points, domain, ticks, ref, unit, label } = series;
  const x = (i) => P.l + (i * (W - P.l - P.r)) / (points.length - 1);
  const y = (v) => P.t + ((domain[1] - v) * (H - P.t - P.b)) / (domain[1] - domain[0]);
  const line = points.map((p, i) => `${x(i)},${y(p.v)}`).join(' ');
  const last = points.length - 1;

  return (
    <div className="chart-wrap">
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label} এর সময়ভিত্তিক ধারা`}>
        <rect className="chart__band" x={P.l} y={y(ref[1])} width={W - P.l - P.r} height={y(ref[0]) - y(ref[1])} />
        <text className="chart__band-label" x={W - P.r - 6} y={y(ref[1]) + 15} textAnchor="end">স্বাভাবিক সীমা</text>
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart__grid" x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} />
            <text className="chart__tick" x={P.l - 8} y={y(t) + 4} textAnchor="end">{bn(t.toFixed(1))}</text>
          </g>
        ))}
        <polyline className="chart__line" fill="none" points={line} />
        {points.map((p, i) => (
          <g key={p.m}>
            <circle className={i === last ? 'chart__dot chart__dot--last' : 'chart__dot'} cx={x(i)} cy={y(p.v)} r={i === last ? 6 : 4} />
            <text className="chart__value" x={x(i)} y={y(p.v) - 11} textAnchor="middle">{bn(p.v.toFixed(1))}</text>
            <text className="chart__month" x={x(i)} y={H - 24} textAnchor="middle">{p.m}</text>
            <text className="chart__lab" x={x(i)} y={H - 8} textAnchor="middle">{p.lab}</text>
          </g>
        ))}
        <text className="chart__tick" x={P.l - 8} y={14} textAnchor="end">{unit}</text>
      </svg>
    </div>
  );
}
