import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { bn, cx } from '../utils/bn.js';
import { uploadQueue } from '../utils/data.js';

/** Offline-first upload: files wait in a queue, show their data cost, and go when signal returns. */
export default function UploadZone({ notify, onCamera }) {
  const [online, setOnline] = useState(false);
  const [jobs, setJobs] = useState(uploadQueue);
  const pending = jobs.filter((j) => j.progress < 100).length;
  const remaining = jobs.reduce((sum, j) => sum + j.mb * (1 - j.progress / 100), 0);

  useEffect(() => {
    if (!online || !pending) return undefined;
    const t = setTimeout(() => {
      setJobs((list) => list.map((j) => ({ ...j, progress: 100 })));
      notify('সংযোগ ফিরেছে। অপেক্ষায় থাকা ফাইল যেখানে থেমেছিল সেখান থেকে চলে গেছে।');
    }, 900);
    return () => clearTimeout(t);
  }, [online, pending, notify]);

  return (
    <div className="upload">
      <div className="upload__actions">
        <button type="button" className="upload__drop" onClick={onCamera}>
          <Icon name="camera" size={22} />
          <span><strong>ছবি তুলুন</strong><small>তোলার সময়ই বলে দেবে কী ঠিক করতে হবে</small></span>
        </button>
        <button type="button" className="upload__drop" onClick={() => notify('ডেমোতে ফাইল বাছাই বন্ধ আছে।', 'warn')}>
          <Icon name="upload" size={22} />
          <span><strong>ফাইল বা PDF বাছুন</strong><small>রিপোর্ট, প্রেসক্রিপশন, ছাড়পত্র</small></span>
        </button>
      </div>
      <div className="upload__job">
        <div className="upload__row">
          <strong>অপেক্ষায় থাকা ফাইল</strong>
          <button type="button" className={cx('net', online && 'is-on')} aria-pressed={online} onClick={() => setOnline((v) => !v)}>
            <Icon name="signal" size={14} /> {online ? 'সংযোগ আছে' : 'সংযোগ নেই'} <small>(ডেমো সুইচ)</small>
          </button>
        </div>
        {jobs.map((j) => (
          <div key={j.id} className="upload__file">
            <div className="upload__row"><span>{j.name}</span><span className="num">{bn(j.progress)}%</span></div>
            <div className="bar" role="progressbar" aria-valuenow={j.progress} aria-valuemin="0" aria-valuemax="100" aria-label={`${j.name} আপলোড`}>
              <span style={{ width: `${j.progress}%` }} className={j.progress >= 100 ? 'is-done' : ''} />
            </div>
            <small>মূল ফাইল {j.raw} MB, পাঠানো হবে {bn(j.mb.toFixed(1))} MB (লেখা পড়ার মান ঠিক রেখে)</small>
          </div>
        ))}
        <small className="upload__cost">
          {pending ? `বাকিটা পাঠাতে প্রায় ${bn(remaining.toFixed(1))} MB ডেটা লাগবে। সংযোগ এলে নিজে থেকেই যাবে, আবার শুরু থেকে নয়।` : 'সব ফাইল চলে গেছে। ছবির মান যাচাই চলছে।'}
        </small>
      </div>
    </div>
  );
}
