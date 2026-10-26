import Icon from './Icon.jsx';
import useSpeech from '../hooks/useSpeech.js';
import { cx } from '../utils/bn.js';

export default function ListenButton({ text, label = 'শুনুন', className }) {
  const { speaking, speak, stop } = useSpeech();
  return (
    <button type="button" className={cx('listen', speaking && 'is-on', className)} aria-pressed={speaking} onClick={() => (speaking ? stop() : speak(text))}>
      {speaking ? <span className="listen__bars" aria-hidden="true"><i /><i /><i /><i /></span> : <Icon name="volume" size={16} />}
      {speaking ? 'থামান' : label}
    </button>
  );
}
