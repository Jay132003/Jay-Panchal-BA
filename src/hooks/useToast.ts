import { useCallback, useEffect, useState } from 'react';

export function useToast(duration = 1600) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const showToast = useCallback(
    (text: string) => {
      setMessage(text);
      setVisible(true);
    },
    [],
  );

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [visible, duration]);

  return { message, visible, showToast };
}
