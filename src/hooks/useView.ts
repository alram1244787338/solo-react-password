import { useCallback, useEffect, useState } from 'react';
import type { ViewName } from '@/types';

export const VALID_VIEWS: ViewName[] = ['home', 'generator', 'strength', 'passphrase', 'vault'];

export const parseHash = (hash: string, fallback: ViewName = 'home'): ViewName => {
  const raw = hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!raw) return fallback;
  return (VALID_VIEWS as string[]).includes(raw) ? (raw as ViewName) : fallback;
};

export function useView(initial?: ViewName): [ViewName, (view: ViewName) => void] {
  const [view, setViewState] = useState<ViewName>(() => {
    if (typeof window === 'undefined') return initial ?? 'home';
    return parseHash(window.location.hash, initial);
  });

  useEffect(() => {
    const onHashChange = () => {
      setViewState(parseHash(window.location.hash));
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return [view, navigate];
}
