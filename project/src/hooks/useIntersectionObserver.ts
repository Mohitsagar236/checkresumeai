import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function useIntersectionObserver(threshold = 0.1) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  return { ref, inView, hasAnimated };
}