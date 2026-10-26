import { cx } from '../utils/bn.js';

export default function Panel({ title, hint, action, className, children }) {
  return (
    <section className={cx('panel', className)}>
      {(title || action) && (
        <header className="panel__head">
          <div>
            {title && <h2 className="panel__title">{title}</h2>}
            {hint && <p className="panel__hint">{hint}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
