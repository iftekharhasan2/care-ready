import { useCallback, useEffect, useRef, useState } from 'react';

export default function useToast(duration = 3200) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const notify = useCallback(
    (message, tone = 'good') => {
      clearTimeout(timer.current);
      setToast({ message, tone, id: Date.now() });
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, notify };
}
