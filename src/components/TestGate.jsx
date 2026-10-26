import Icon from './Icon.jsx';
import { bn } from '../utils/bn.js';
import { missingTests, reportedCount, requiredItems, testsReady } from '../utils/tests.js';

/** Shows whether the second appointment is unlocked, and exactly what is still missing. */
export default function TestGate({ order }) {
  const ready = testsReady(order);
  const total = requiredItems(order).length;
  const done = reportedCount(order);
  return (
    <div className={ready ? 'gate gate--open' : 'gate'}>
      <div className="gate__head">
        <span className="gate__icon" aria-hidden="true"><Icon name={ready ? 'check' : 'lock'} size={20} /></span>
        <div>
          <strong>{ready ? 'দ্বিতীয় সাক্ষাৎ খোলা' : 'দ্বিতীয় সাক্ষাৎ এখনো বন্ধ'}</strong>
          <span>{bn(total)}টি জরুরি পরীক্ষার মধ্যে {bn(done)}টির রিপোর্ট এসেছে</span>
        </div>
      </div>
      <div className="bar bar--lg" role="progressbar" aria-valuenow={done} aria-valuemin="0" aria-valuemax={total} aria-label="জরুরি পরীক্ষার রিপোর্ট"><span style={{ width: `${total ? (done / total) * 100 : 100}%` }} className={ready ? 'is-done' : ''} /></div>
      {!ready && (
        <ul className="gate__missing">
          {missingTests(order).map((it) => (<li key={it.id}><Icon name="clock" size={14} /> {it.name}: রিপোর্ট বাকি</li>))}
        </ul>
      )}
    </div>
  );
}
