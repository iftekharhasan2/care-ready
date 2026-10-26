import { motion } from 'framer-motion';
import Icon from '../components/Icon.jsx';
import StatusPill from '../components/StatusPill.jsx';
import logo from '../assets/logo.svg';
import hero from '../assets/hero.svg';
import patientImg from '../assets/role-patient.svg';
import clinicImg from '../assets/role-clinic.svg';
import doctorImg from '../assets/role-doctor.svg';
import { bn } from '../utils/bn.js';
import { howItWorks, landingFacts, landingFeatures, roleCards } from '../utils/data.js';

const IMAGES = { patient: patientImg, clinic: clinicImg, doctor: doctorImg };
const rise = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="brand">
          <img src={logo} alt="" width="38" height="38" />
          <div><strong>কেয়াররেডি হেলথ</strong><span>ডাক্তারের জন্য প্রস্তুত রেকর্ড</span></div>
        </div>
        <nav className="landing__links" aria-label="পাতার অংশ">
          <a href="#roles">কারা ব্যবহার করেন</a>
          <a href="#features">সুবিধা</a>
          <a href="#how">যেভাবে কাজ করে</a>
        </nav>
        <div className="landing__nav-end">
          <StatusPill tone="stamp">প্রোটোটাইপ</StatusPill>
          <a className="btn btn--primary" href="#roles">প্রবেশ করুন</a>
        </div>
      </header>

      <section className="landing__hero">
        <motion.div {...rise} transition={{ duration: 0.45 }}>
          <p className="eyebrow">সাক্ষাতের আগেই রেকর্ড তৈরি</p>
          <h1>ছড়ানো রিপোর্ট থেকে ডাক্তারের হাতে সাজানো রেকর্ড ফাইল</h1>
          <p className="landing__lead">ফোনে তোলা রিপোর্ট, এক্স-রে আর প্রেসক্রিপশন তারিখ ধরে সাজানো হয়, মানুষ মিলিয়ে দেখেন, আর পরামর্শের আগেই ডাক্তার পেয়ে যান।</p>
          <div className="landing__cta">
            <button type="button" className="btn btn--primary btn--lg" onClick={() => onEnter('patient')}>রোগী হিসেবে শুরু করুন <Icon name="arrow" size={18} /></button>
            <a className="btn btn--ghost btn--lg" href="#roles">আমি ক্লিনিক বা ডাক্তার</a>
          </div>
          <ul className="landing__facts">
            {landingFacts.map((f) => (<li key={f.label}><strong>{f.value}</strong><span>{f.label}</span></li>))}
          </ul>
        </motion.div>
        <motion.img src={hero} alt="ফোনে রিপোর্টের ছবি তোলা থেকে সিলমারা রেকর্ড ফাইল হয়ে ডাক্তারের কাছে পৌঁছানোর ধাপ" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} />
      </section>

      <section className="landing__section" id="roles">
        <p className="eyebrow">তিনজনের জন্য তিনটি আলাদা পর্দা</p>
        <h2>আপনি কে?</h2>
        <div className="roles">
          {roleCards.map((card, i) => (
            <motion.article key={card.role} className="role-card" data-role={card.role} {...rise} transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }} whileHover={{ y: -5 }}>
              <img src={IMAGES[card.role]} alt={card.alt} />
              <div className="role-card__body">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <ul>{card.points.map((p) => (<li key={p}><Icon name="check" size={15} /> {p}</li>))}</ul>
                <button type="button" className="btn btn--primary btn--block" onClick={() => onEnter(card.role)}>{card.cta} <Icon name="arrow" size={16} /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="landing__section" id="features">
        <p className="eyebrow">যা যা পাচ্ছেন</p>
        <h2>বাংলাদেশের রোগী, ক্লিনিক ও ডাক্তারের জন্য বানানো</h2>
        <div className="features">
          {landingFeatures.map((f) => (
            <article key={f.title} className="feature">
              <span className="feature__icon" aria-hidden="true"><Icon name={f.icon} size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing__section" id="how">
        <p className="eyebrow">যেভাবে কাজ করে</p>
        <h2>ছবি থেকে রেকর্ড ফাইল, তিন ধাপে</h2>
        <ol className="how">
          {howItWorks.map((step, i) => (
            <li key={step.title}><span className="how__num">{bn(i + 1)}</span><h3>{step.title}</h3><p>{step.text}</p></li>
          ))}
        </ol>
      </section>

      <section className="landing__section">
        <ul className="landing__trust">
          <li><Icon name="lock" size={22} /><div><strong>আপনার তথ্য বিক্রি হয় না</strong><span>কে কখন দেখেছে তা সবসময় দেখা যায়, বিনা খরচে।</span></div></li>
          <li><Icon name="shield" size={22} /><div><strong>মানুষ মিলিয়ে দেখেন</strong><span>কম নিশ্চয়তার বা ঝুঁকিপূর্ণ তথ্য উৎসের সাথে যাচাই হয়।</span></div></li>
          <li><Icon name="phone" size={22} /><div><strong>জরুরি অবস্থায় ৯৯৯</strong><span>এই সেবা জরুরি চিকিৎসার বিকল্প নয়।</span></div></li>
        </ul>
      </section>

      <footer className="landing__foot">
        <div className="brand">
          <img src={logo} alt="" width="32" height="32" />
          <div><strong>কেয়াররেডি হেলথ</strong><span>ডাক্তারের জন্য প্রস্তুত রেকর্ড</span></div>
        </div>
        <p>প্রোটোটাইপ। সব নাম, রিপোর্ট ও মূল্য কাল্পনিক। লক্ষ্যমাত্রা এখনো পাইলটে যাচাই হয়নি।</p>
      </footer>
    </div>
  );
}
