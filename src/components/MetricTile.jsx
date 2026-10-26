import Icon from './Icon.jsx';

export default function MetricTile({ label, value, sub, tone, icon }) {
  return (
    <div className={`metric metric--${tone}`}>
      <div className="metric__text">
        <span className="metric__label">{label}</span>
        <strong className="metric__value">{value}</strong>
        <span className="metric__sub">{sub}</span>
      </div>
      {icon && <span className="metric__icon" aria-hidden="true"><Icon name={icon} size={20} /></span>}
    </div>
  );
}
