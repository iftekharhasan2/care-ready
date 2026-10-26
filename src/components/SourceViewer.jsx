import { cx } from '../utils/bn.js';

/** A mock of the original page with the row a value was read from highlighted. */
export default function SourceViewer({ title, lines, hit, hand }) {
  return (
    <figure className="source-view">
      <div className={cx('source-view__page', hand && 'source-view__page--hand')}>
        {lines.map((line, i) => (<pre key={line} className={cx(i === hit && 'is-hit')}>{line}</pre>))}
      </div>
      <figcaption>{title}</figcaption>
    </figure>
  );
}
