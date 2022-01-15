import React, { RefObject } from 'react';

export function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true
}: {
  root?: any;
  target?: any;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}) {
  // console.log(
  //   `useIntersectionObserver:\n root ${root}\n target ${target}\n onIntersect ${onIntersect}\n threshold ${threshold}\n rootMargin ${rootMargin}\n enabled ${enabled}`
  // );

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target.current, enabled]);
}
