import * as React from 'react';

export const useIntersectionObserver = ({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true
}: {
  root?: any;
  target?: React.RefObject<HTMLElement>;
  onIntersect: () => Promise<any>;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}) => {
  React.useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold
      }
    );

    const element = target && target.current;
    if (!element) return;

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [target?.current, enabled]);
}
