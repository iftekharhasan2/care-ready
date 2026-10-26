import { useState } from 'react';
import Icon from './Icon.jsx';
import { brandMap } from '../utils/data.js';

const norm = (v) => v.trim().toLowerCase();

/** Prescriptions use brand names; this maps a brand to its generic and maker. */
export default function BrandLookup() {
  const [query, setQuery] = useState('Angilock');
  const q = norm(query);
  const hit = q && brandMap.find((b) => norm(b.brand).startsWith(q) || b.bn.startsWith(query.trim()));

  return (
    <div className="brand-lookup">
      <label className="field" htmlFor="brand-query">
        <span>প্রেসক্রিপশনে লেখা ব্র্যান্ডের নাম</span>
        <span className="brand-lookup__input"><Icon name="search" size={16} /><input id="brand-query" type="text" value={query} placeholder="যেমন: Napa বা নাপা" onChange={(e) => setQuery(e.target.value)} /></span>
      </label>
      <div className="choices">
        {brandMap.map((b) => (<button key={b.brand} type="button" className="choice choice--small" onClick={() => setQuery(b.brand)}>{b.bn}</button>))}
      </div>
      <p className="brand-lookup__result" aria-live="polite">
        {hit ? (<><strong>{hit.bn} ({hit.brand})</strong> হলো <strong>{hit.generic}</strong>, {hit.use}। প্রস্তুতকারক: {hit.maker}।</>) : 'এই নামটি তালিকায় নেই। ছবি পাঠালে একজন মানুষ মিলিয়ে দেখবেন।'}
      </p>
      <p className="footnote">নমুনা তালিকা। একই জেনেরিক আলাদা ব্র্যান্ডে থাকলে দুবার খাওয়া এড়াতে সতর্ক করা হবে।</p>
    </div>
  );
}
