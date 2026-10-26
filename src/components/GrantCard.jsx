import { motion } from 'framer-motion';
import StatusPill from './StatusPill.jsx';
import Avatar from './Avatar.jsx';
import { cx } from '../utils/bn.js';

export default function GrantCard({ grant, onRevoke }) {
  return (
    <motion.li layout className={cx('grant', !grant.active && 'is-revoked')} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Avatar kind={grant.avatar} name={grant.name} size="lg" />
      <div className="grant__body">
        <div className="grant__top">
          <div>
            <strong>{grant.name}</strong>
            <span className="muted">{grant.relation}</span>
          </div>
          <StatusPill tone={grant.active ? 'good' : 'neutral'}>{grant.active ? 'চালু' : 'বাতিল'}</StatusPill>
        </div>
        <ul className="tags">
          {grant.scope.map((s) => (<li key={s}>{s}</li>))}
        </ul>
        <dl className="grant__meta">
          <div><dt>মেয়াদ শেষ</dt><dd>{grant.expiry}</dd></div>
          <div><dt>সর্বশেষ ব্যবহার</dt><dd>{grant.last}</dd></div>
          <div><dt>অন্যকে শেয়ার</dt><dd>অনুমতি নেই</dd></div>
        </dl>
      </div>
      {grant.active && (
        <button type="button" className="btn btn--danger" onClick={() => onRevoke(grant.id)}>অনুমতি বাতিল করুন</button>
      )}
    </motion.li>
  );
}
