import { useCallback, useEffect, useState } from 'react';
import type { ViewName } from '@/types';

const VALID_VIEWS: ViewName[] = ['home', 'generator', 'strength', 'passphrase', 'vault'];

const parseHash = (fallback: ViewName = 'home'): ViewName => {
  const raw = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!raw) return fallback;
  return (VALID_VIEWS as string[]).includes(raw) ? (raw as ViewName) : fallback;
};

export function useView(initial?: ViewName): [ViewName, (view: ViewName) => void] {
  const [view, setViewState] = useState<ViewName>(() => {
    if (typeof window === 'undefined') return initial ?? 'home';
    return parseHash(initial);
  });

  useEffect(() => {
    const onHashChange = () => {
      setViewState(parseHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((next: ViewName) => {
    setViewState(next);
    if (typeof window !== 'undefined') {
      const hash = next === 'home' ? '' : `#${next}`;
      if (window.location.hash !== hash) {
        if (next === 'home') {
          history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.location.hash = next;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [view, navigate];
}
