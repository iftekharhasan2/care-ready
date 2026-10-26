import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

/** A person's or clinic's unique ID, selectable and copyable. */
export default function IdChip({ id, label }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard refused: the ID text itself is selectable */ }
  };

  return (
    <span className="id-chip">
      <span className="id-chip__label">{label}</span>
      <span className="id-chip__value">{id}</span>
      <button type="button" onClick={copy} aria-label={`${label} কপি করুন`}><Icon name={copied ? 'check' : 'link'} size={13} /> {copied ? 'কপি হয়েছে' : 'কপি'}</button>
    </span>
  );
}
