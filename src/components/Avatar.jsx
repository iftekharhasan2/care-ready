import patient from '../assets/avatar-patient.svg';
import doctor from '../assets/avatar-doctor.svg';
import clinic from '../assets/avatar-clinic.svg';
import son from '../assets/avatar-son.svg';
import { cx } from '../utils/bn.js';

const IMAGES = { patient, doctor, clinic, son };

/** Illustrated portrait when we have one, otherwise the person's initial. */
export default function Avatar({ kind, name = '', size = 'md' }) {
  const src = IMAGES[kind];
  if (src) return <img className={cx('avatar-img', `avatar-img--${size}`)} src={src} alt="" />;
  return <span className={cx('avatar', size === 'lg' && 'avatar--lg')} aria-hidden="true">{name.replace('ডা. ', '')[0]}</span>;
}
