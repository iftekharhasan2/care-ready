import { useCallback, useEffect, useRef, useState } from 'react';

/** Reads Bangla text aloud when the device has a voice for it; always shows a speaking state. */
export default function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const timer = useRef();

  const stop = useCallback(() => {
    clearTimeout(timer.current);
    try { window.speechSynthesis?.cancel(); } catch { /* not available */ }
    setSpeaking(false);
  }, []);

  const speak = useCallback((text) => {
    stop();
    setSpeaking(true);
    const estimate = Math.min(14000, 1500 + text.length * 60);
    try {
      if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'bn-BD';
        utterance.rate = 0.9;
        utterance.onend = () => { clearTimeout(timer.current); setSpeaking(false); };
        window.speechSynthesis.speak(utterance);
      }
    } catch { /* fall back to the timed visual state */ }
    timer.current = setTimeout(() => setSpeaking(false), estimate);
  }, [stop]);

  useEffect(() => stop, [stop]);
  return { speaking, speak, stop };
}
