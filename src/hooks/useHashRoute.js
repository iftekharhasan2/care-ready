import { useCallback, useEffect, useState } from 'react';

const parse = (pages) => {
  try {
    const [role, page] = window.location.hash.slice(1).split('.');
    if (pages[role]) return { role, page: pages[role][page] ? page : 'home' };
  } catch { /* fall through to the landing page */ }
  return { role: null, page: null };
};

/** Route = role + page, kept in a bare #role.page anchor so every screen can be linked. */
export default function useHashRoute(pages) {
  const [route, setRoute] = useState(() => parse(pages));

  useEffect(() => {
    const onHash = () => setRoute(parse(pages));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [pages]);

  const go = useCallback((role, page = 'home') => {
    setRoute({ role, page: role ? page : null });
    try {
      window.history.replaceState(null, '', role ? `#${role}.${page}` : window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    } catch { /* the anchor is a convenience only */ }
  }, []);

  return { ...route, go };
}
