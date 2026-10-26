const DIGITS = '০১২৩৪৫৬৭৮৯';

/** Latin digits → Bangla digits */
export const bn = (value) => String(value).replace(/\d/g, (d) => DIGITS[d]);

/** Taka amount with Bangla digits and grouping */
export const taka = (amount) => `৳${bn(Number(amount).toLocaleString('en-IN'))}`;

export const cx = (...parts) => parts.filter(Boolean).join(' ');

/** Bangla digits → Latin digits (for OTP and lookups) */
export const toLatin = (value) => String(value).replace(/[০-৯]/g, (d) => DIGITS.indexOf(d));

/** Seconds → Bangla m:ss */
export const clock = (seconds) => `${bn(Math.floor(seconds / 60))}:${bn(String(seconds % 60).padStart(2, '0'))}`;
