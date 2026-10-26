import { Fragment } from 'react';
import Icon from './Icon.jsx';
import Avatar from './Avatar.jsx';
import logo from '../assets/logo.svg';
import { ROLES } from '../utils/data.js';
import { bn, cx } from '../utils/bn.js';

export default function Sidebar({ role, active, onSelect, onSwitchRole, badges = {} }) {
  const { label, user, nav } = ROLES[role];
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="" width="36" height="36" />
        <div>
          <strong>কেয়াররেডি হেলথ</strong>
          <span>{label}</span>
        </div>
      </div>
      <nav className="nav" aria-label="প্রধান মেনু">
        {nav.map((item, i) => (
          <Fragment key={item.id}>
            {item.group && item.group !== nav[i - 1]?.group && <p className="nav__group">{item.group}</p>}
            <button type="button" className={cx('nav__item', active === item.id && 'is-active')} aria-current={active === item.id ? 'page' : undefined} onClick={() => onSelect(item.id)}>
              <Icon name={item.icon} size={19} />
              <span className="nav__label">{item.label}</span>
              {badges[item.id] > 0 && <span className="nav__badge" aria-label={`${bn(badges[item.id])}টি কাজ বাকি`}>{bn(badges[item.id])}</span>}
            </button>
          </Fragment>
        ))}
      </nav>
      <button type="button" className="role-chip" onClick={onSwitchRole}>
        <Avatar kind={user.avatar} name={user.name} />
        <span><strong>{user.name}</strong><small>ভূমিকা বদলান</small></span>
        <Icon name="swap" size={16} />
      </button>
      <p className="sidebar__trust"><Icon name="lock" size={15} /> আপনার তথ্য বিক্রি হয় না</p>
    </aside>
  );
}
