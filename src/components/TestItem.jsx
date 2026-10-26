import StatusPill from './StatusPill.jsx';
import WhoTag from './WhoTag.jsx';
import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';
import { testStatus } from '../utils/data.js';

/** One ordered test: what it is, where it stands, and the action for whoever is looking. */
export default function TestItem({ item, children }) {
  return (
    <li className={cx('test', item.status === 'reported' && 'is-done')}>
      <span className="test__icon" aria-hidden="true"><Icon name={item.status === 'reported' ? 'check' : 'flask'} size={18} /></span>
      <div className="test__body">
        <div className="test__top">
          <strong>{item.name}</strong>
          <span className="test__pills">
            <StatusPill tone={item.required ? 'crit' : 'neutral'} dot={false}>{item.required ? 'জরুরি' : 'ঐচ্ছিক'}</StatusPill>
            <StatusPill tone={testStatus[item.status].tone}>{testStatus[item.status].label}</StatusPill>
          </span>
        </div>
        {item.lab && <span className="test__meta"><WhoTag name={item.lab} /> · {item.when}{item.collect ? ` · ${item.collect}` : ''}</span>}
        {item.status !== 'reported' && <span className="test__meta">প্রস্তুতি: {item.prep}</span>}
        {item.status === 'reported' && <span className="test__meta"><Icon name="link" size={12} /> রিপোর্ট আপলোড করেছেন: {item.by}</span>}
        {children && <div className="test__actions">{children}</div>}
      </div>
    </li>
  );
}
