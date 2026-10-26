import { useState } from 'react';
import Icon from './Icon.jsx';
import { bn, cx } from '../utils/bn.js';
import { channelThread, channels, sampleNumber } from '../utils/data.js';

/** No-app entry: send photos by chat, get the packet link back by SMS. */
export default function ChannelEntry() {
  const [channel, setChannel] = useState('whatsapp');
  const current = channels[channel];
  const thread = channel === 'sms' ? channelThread.filter((m) => m.from === 'sms') : channelThread;

  return (
    <div className="channel">
      <div className="segmented" role="tablist" aria-label="পাঠানোর মাধ্যম">
        {Object.entries(channels).map(([key, c]) => (
          <button key={key} type="button" role="tab" aria-selected={channel === key} className={cx(channel === key && 'is-active')} onClick={() => setChannel(key)}>{c.label}</button>
        ))}
      </div>
      <p>{current.how}</p>
      <p className="channel__number"><Icon name="phone" size={16} /> {sampleNumber}</p>
      <ul className="thread" aria-label={`${current.label} কথোপকথনের নমুনা`}>
        {thread.map((m, i) => (
          <li key={i} className={cx('thread__msg', `thread__msg--${m.from}`)}>
            {m.from === 'sms' && <small className="thread__tag">এসএমএস</small>}
            {m.photos ? (
              <span className="thread__photos" aria-label={`${bn(m.photos)}টি ছবি`}>{Array.from({ length: m.photos }, (_, k) => (<i key={k} />))}</span>
            ) : (<p>{m.text}</p>)}
            <small>{m.when}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
