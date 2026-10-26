import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { clock, cx } from '../utils/bn.js';
import { VIDEO_LIMIT, videoTips } from '../utils/data.js';

/** Simulated recorder with a hard 2-minute limit. The demo clock runs 20× faster than real time. */
export default function VideoRecorder({ seconds, onRecorded }) {
  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState(false);
  const timer = useRef();

  useEffect(() => {
    if (!recording) return undefined;
    timer.current = setInterval(() => setElapsed((s) => Math.min(VIDEO_LIMIT, s + 4)), 200);
    return () => clearInterval(timer.current);
  }, [recording]);

  useEffect(() => {
    if (recording && elapsed >= VIDEO_LIMIT) { setRecording(false); onRecorded(VIDEO_LIMIT); }
  }, [elapsed, recording, onRecorded]);

  const start = () => { setElapsed(0); onRecorded(0); setRecording(true); };
  const stop = () => { setRecording(false); onRecorded(Math.max(elapsed, 8)); };
  const shown = recording ? elapsed : seconds;

  return (
    <div className={cx('recorder', recording && 'is-recording')}>
      <div className="recorder__top">
        <span className="recorder__time num"><span className="recorder__dot" aria-hidden="true" />{clock(shown)} / {clock(VIDEO_LIMIT)}</span>
        {recording ? (
          <button type="button" className="btn btn--danger" onClick={stop}>রেকর্ড থামান</button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={start}><Icon name="record" size={16} /> {seconds ? 'আবার রেকর্ড করুন' : 'ভিডিও রেকর্ড করুন'}</button>
        )}
      </div>
      <div className="bar bar--lg" role="progressbar" aria-valuenow={shown} aria-valuemin="0" aria-valuemax={VIDEO_LIMIT} aria-label="ভিডিওর দৈর্ঘ্য"><span style={{ width: `${(shown / VIDEO_LIMIT) * 100}%` }} className={!recording && seconds ? 'is-done' : ''} /></div>
      <small aria-live="polite">{recording ? 'রেকর্ড হচ্ছে। ২ মিনিট হলে নিজে থেকে থেমে যাবে।' : seconds >= VIDEO_LIMIT ? '২ মিনিট শেষ, রেকর্ড থেমেছে। ভিডিও পাঠানোর জন্য প্রস্তুত।' : seconds ? 'ভিডিও পাঠানোর জন্য প্রস্তুত।' : 'সর্বোচ্চ ২ মিনিট। ডেমোতে ক্যামেরা চালু হয় না, ঘড়ি দ্রুত চলে।'}</small>
      <ul className="tags">{videoTips.map((t) => (<li key={t}>{t}</li>))}</ul>
    </div>
  );
}
