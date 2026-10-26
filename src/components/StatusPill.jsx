import { cx } from '../utils/bn.js';

export default function StatusPill({ tone = 'neutral', children, dot = true }) {
  return (
    <span className={cx('pill', `pill--${tone}`)}>
      {dot && <span className="pill__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
