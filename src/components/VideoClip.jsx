import { useState } from 'react';
import Avatar from './Avatar.jsx';
import Icon from './Icon.jsx';
import { bn, clock, cx } from '../utils/bn.js';

/** Stand-in player for the patient's short video. The demo has no real footage. */
export default function VideoClip({ video, name, avatar }) {
  const [playing, setPlaying] = useState(false);
  const size = (video.seconds * 0.055).toFixed(1);
  const toggle = () => setPlaying((v) => !v);
  return (
    <figure className={cx('clip', playing && 'is-playing')}>
      <div className="clip__screen">
        <span className="clip__tag"><Icon name="video" size={13} /> রোগীর ভিডিও</span>
        <Avatar kind={avatar} name={name} size="lg" />
        {!playing && <button type="button" className="clip__play" aria-label="ভিডিও চালান" onClick={toggle}><Icon name="play" size={24} /></button>}
        <div className="clip__controls">
          <button type="button" className="clip__ctl" aria-label={playing ? 'ভিডিও থামান' : 'ভিডিও চালান'} onClick={toggle}><Icon name={playing ? 'pause' : 'play'} size={16} /></button>
          <div className="clip__bar"><span onAnimationEnd={() => setPlaying(false)} /></div>
          <span className="clip__time num">{clock(video.seconds)}</span>
          <Icon name="volume" size={16} />
        </div>
      </div>
      <figcaption>{name} · {clock(video.seconds)} মিনিট · প্রায় {bn(size)} MB · নমুনা প্লেয়ার</figcaption>
    </figure>
  );
}
