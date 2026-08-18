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

function parseHash(hash: string): { route: PageRoute; path: string } {
  const cleanHash = hash.replace(/^#\/?/, '').trim();
  const [pathname, queryString] = cleanHash.split('?');
  const path = pathname || '';

  if (!path || path === '') {
    return { route: { type: 'home' }, path: '/' };
  }

  if (path === 'all-tools') {
    const params = new URLSearchParams(queryString || '');
    const category = params.get('category') || undefined;
    return { route: { type: 'all-tools', category }, path: '/all-tools' };
  }

  if (path.startsWith('tools/')) {
    const slug = path.replace('tools/', '').trim();
    return { route: { type: 'tool', slug }, path: `/tools/${slug}` };
  }

  if (path.startsWith('tool/')) {
    const slug = path.replace('tool/', '').trim();
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

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navState, setNavState] = useState(() => parseHash(window.location.hash));
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setNavState(parsed);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string) => {
    const targetHash = path.startsWith('/') ? `#${path}` : `#/${path}`;
    if (window.location.hash === targetHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = targetHash;
    }
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
