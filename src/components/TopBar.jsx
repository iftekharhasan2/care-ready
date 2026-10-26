import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Avatar from './Avatar.jsx';
import IdChip from './IdChip.jsx';
import { ROLES } from '../utils/data.js';

export default function TopBar({ role, page, lowData, onToggleLowData, bigText, onToggleBigText }) {
  const { label, user, nav } = ROLES[role];
  const current = nav.find((n) => n.id === page);
  const [open, setOpen] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (e.key === 'Escape' || (e.type === 'pointerdown' && !menu.current?.contains(e.target))) setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);

  return (
    <header className="topbar">
      <nav className="topbar__crumb" aria-label="আপনি এখন যেখানে">
        <span>{label}</span><Icon name="chevron" size={14} /><strong>{current?.label}</strong>
      </nav>
      <div className="topbar__tools">
        {role === 'patient' && <span className="emergency"><Icon name="phone" size={15} /> জরুরি অবস্থায় ৯৯৯</span>}
        <IdChip id={user.id} label={user.idLabel} />
        <div className="menu" ref={menu}>
          <button type="button" className="icon-btn" aria-haspopup="true" aria-expanded={open} aria-label="প্রদর্শনের সেটিং" onClick={() => setOpen((v) => !v)}><Icon name="gear" size={18} /></button>
          {open && (
            <div className="menu__pop">
              <p className="menu__title">প্রদর্শন</p>
              <button type="button" className="switch" role="switch" aria-checked={bigText} onClick={onToggleBigText}>
                <span className="switch__knob" aria-hidden="true" /><span><strong><Icon name="text" size={15} /> বড় লেখা</strong><small>সব লেখা বড় করে দেখায়</small></span>
              </button>
              <button type="button" className="switch" role="switch" aria-checked={lowData} onClick={onToggleLowData}>
                <span className="switch__knob" aria-hidden="true" /><span><strong><Icon name="signal" size={15} /> কম ডেটা মোড</strong><small>ছবি ও নড়াচড়া কমায়</small></span>
              </button>
              <p className="menu__note">প্রোটোটাইপ। সব নাম, রিপোর্ট ও মূল্য নমুনা।</p>
            </div>
          )}
        </div>
        <div className="topbar__patient">
          <Avatar kind={user.avatar} name={user.name} />
          <div><strong>{user.name}</strong><span>{user.line}</span></div>
        </div>
      </div>
    </header>
  );
}
