import Icon from './Icon.jsx';
import { cx } from '../utils/bn.js';

export default function TaskItem({ task, onToggle, ramadan }) {
  return (
    <li className={cx('task', task.done && 'is-done')}>
      <button type="button" className="tick" role="checkbox" aria-checked={task.done} aria-label={task.text} onClick={() => onToggle(task.id)}>
        {task.done && <Icon name="check" size={14} />}
      </button>
      <div>
        <span className="task__text">{task.text}</span>
        <span className="task__meta"><Icon name="clock" size={13} /> {ramadan ? task.ramadan : task.when} · অনুমোদন: {task.by}</span>
        {ramadan && task.hold && <span className="task__hold"><Icon name="alert" size={13} /> {task.hold}</span>}
      </div>
    </li>
  );
}
