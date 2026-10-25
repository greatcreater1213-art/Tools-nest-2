import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PageRoute = 
  | { type: 'home' }
  | { type: 'all-tools'; category?: string }
  | { type: 'tool'; slug: string }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'privacy' }
  | { type: 'terms' }
  | { type: 'disclaimer' };

interface NavigationContextType {
  currentRoute: PageRoute;
  currentPath: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateTo: (path: string) => void;
  navigateTool: (slug: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function parsePathAndQuery(rawPath: string, queryString?: string): { route: PageRoute; path: string } {
  const [cleanPathOnly, inlineQuery] = rawPath.split('?');
  const path = (cleanPathOnly || '').replace(/^\/+/, '').trim();
  const query = inlineQuery || (queryString ? queryString.replace(/^\?/, '') : '');

  if (!path || path === '') {
    return { route: { type: 'home' }, path: '/' };
  }

  if (path === 'all-tools') {
    const params = new URLSearchParams(query);
    const category = params.get('category') || undefined;
    return { route: { type: 'all-tools', category }, path: '/all-tools' };
  }

  if (path.startsWith('tools/')) {
    const slug = path.replace('tools/', '').trim().split('/')[0];
    return { route: { type: 'tool', slug }, path: `/tools/${slug}` };
  }

  if (path.startsWith('tool/')) {
    const slug = path.replace('tool/', '').trim().split('/')[0];
    return { route: { type: 'tool', slug }, path: `/tools/${slug}` };
  }

  if (path === 'about') return { route: { type: 'about' }, path: '/about' };
  if (path === 'contact') return { route: { type: 'contact' }, path: '/contact' };
  if (path === 'privacy' || path === 'privacy-policy') return { route: { type: 'privacy' }, path: '/privacy-policy' };
  if (path === 'terms' || path === 'terms-and-conditions') return { route: { type: 'terms' }, path: '/terms' };
  if (path === 'disclaimer') return { route: { type: 'disclaimer' }, path: '/disclaimer' };

  // Fallback to home
  return { route: { type: 'home' }, path: '/' };
}

function getCurrentNavState(): { route: PageRoute; path: string } {
  if (typeof window === 'undefined') {
    return { route: { type: 'home' }, path: '/' };
  }

  // 1. Check if an active hash route exists (e.g. #/tools/image-compressor or #about)
  const hash = window.location.hash;
  const strippedHash = hash.replace(/^#\/?/, '').trim();

  if (strippedHash && strippedHash !== '') {
    return parsePathAndQuery(strippedHash, window.location.search);
  }

  // 2. Otherwise use the standard window.location.pathname and search
  return parsePathAndQuery(window.location.pathname, window.location.search);
}

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navState, setNavState] = useState(() => getCurrentNavState());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // If the page was loaded with a legacy hash route, seamlessly normalize URL in address bar
    if (window.location.hash) {
      const strippedHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (strippedHash && strippedHash !== '') {
        const [hashPath, hashQuery] = strippedHash.split('?');
        const targetPath = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
        const query = hashQuery ? `?${hashQuery}` : '';
        window.history.replaceState({}, '', `${targetPath}${query}`);
      }
    }

    const handleLocationChange = () => {
      const parsed = getCurrentNavState();
      setNavState(parsed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    const targetPath = path.startsWith('/') ? path : `/${path}`;
    const currentFull = window.location.pathname + window.location.search;

    if (currentFull === targetPath && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState({}, '', targetPath);
    setNavState(getCurrentNavState());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTool = (slug: string) => {
    navigateTo(`/tools/${slug}`);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute: navState.route,
        currentPath: navState.path,
        searchQuery,
        setSearchQuery,
        navigateTo,
        navigateTool,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
