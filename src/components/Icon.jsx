const PATHS = {
  packet: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M9 15l2 2 4-4',
  passport: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z M5 18a2 2 0 0 1 2-2h12 M9 8h6',
  clinic: 'M4 21V7l8-4 8 4v14 M9 21v-5h6v5 M12 8v4 M10 10h4',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.7 2.5 15.3 0 18 M12 3c-2.5 2.7-2.5 15.3 0 18',
  family: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.5a3.5 3.5 0 0 1 0 6.5 M18 14.5a6 6 0 0 1 3.5 5.5',
  follow: 'M4 7l1.5 1.5L8 6 M4 13l1.5 1.5L8 12 M4 19l1.5 1.5L8 18 M11 7h9 M11 13h9 M11 19h9',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 4l9 16H3z M12 10v4 M12 17.2v.3',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  upload: 'M12 16V5 M7.5 9.5L12 5l4.5 4.5 M5 19h14',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7.5V12l3 2',
  shield: 'M12 3l7 3v5.5c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V6z M9 12l2 2 4-4',
  phone: 'M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
  signal: 'M4 19v-3 M9 19v-6 M14 19v-9 M19 19V5',
  refresh: 'M20 11a8 8 0 0 0-14.5-4.5L4 8 M4 4v4h4 M4 13a8 8 0 0 0 14.5 4.5L20 16 M20 20v-4h-4',
  x: 'M6 6l12 12 M18 6L6 18',
  pill: 'M4.5 12.5l8-8a5 5 0 0 1 7 7l-8 8a5 5 0 0 1-7-7z M8.5 8.5l7 7',
  calendar: 'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z M4 10h16 M8 3v4 M16 3v4',
  message: 'M4 5h16v11H9l-5 4z',
  send: 'M4 12l16-8-6 16-3-7z',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M5.5 11.5a6.5 6.5 0 0 0 13 0 M12 18v3',
  volume: 'M4 9.5v5h3.5L12 18V6L7.5 9.5z M15.5 9a4 4 0 0 1 0 6 M18 6.5a7.5 7.5 0 0 1 0 11',
  camera: 'M4 8h3l1.5-2h7L17 8h3v11H4z M12 10.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  print: 'M7 9V4h10v5 M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2 M7 14h10v6H7z',
  plane: 'M10 3.5c0-1 .8-1.5 2-1.5s2 .5 2 1.5V9l7 4v2l-7-2v4.5l2 1.5V21l-4-1-4 1v-1.5l2-1.5V13l-7 2v-2l7-4z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  text: 'M3 8V6h10v2 M8 6v13 M6 19h4 M14 13v-1.5h7V13 M17.5 11.5V19 M16 19h3',
  store: 'M4 9l1.5-5h13L20 9 M4 9v11h16V9 M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9 M9 20v-6h6v6',
  lock: 'M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  home: 'M4 11l8-7 8 7 M6 10v10h4v-6h4v6h4V10',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  swap: 'M4 8h13 M13 4l4 4-4 4 M20 16H7 M11 12l-4 4 4 4',
  video: 'M4 7h11v10H4z M15 10.5l5-3v9l-5-3',
  play: 'M8 5l11 7-11 7z',
  pause: 'M8 5v14 M16 5v14',
  record: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z',
  chevron: 'M9 6l6 6-6 6',
  flask: 'M9 3h6 M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3 M7.5 15h9',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M16 16l4.5 4.5',
};

export default function Icon({ name, size = 18, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
