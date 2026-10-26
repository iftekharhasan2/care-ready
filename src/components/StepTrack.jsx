import Icon from './Icon.jsx';
import { bn, cx } from '../utils/bn.js';

/** Ordered process: steps before `current` are done. */
export default function StepTrack({ steps, current }) {
  return (
    <ol className="steps">
      {steps.map((step, i) => (
        <li key={step} className={cx('steps__item', i < current && 'is-done', i === current && 'is-current')} aria-current={i === current ? 'step' : undefined}>
          <span className="steps__mark">{i < current ? <Icon name="check" size={14} /> : bn(i + 1)}</span>
          <span className="steps__label">{step}</span>
        </li>
      ))}
    </ol>
  );
}
