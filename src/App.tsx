/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { ToolRenderer } from './components/tools/ToolRenderer';

const AppContent: React.FC = () => {
  const { currentRoute, currentPath } = useNavigation();

  const renderCurrentView = () => {
    // 1. Direct Route Object Matching (Primary)
    if (currentRoute.type === 'tool') {
      return <ToolRenderer slug={currentRoute.slug} />;
    }

    // 2. Path-based tool matching (Fallback for direct URL entry)
    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '').split('?')[0];
      return <ToolRenderer slug={slug} />;
    }
    if (currentPath.startsWith('/tool/')) {
      const slug = currentPath.replace('/tool/', '').split('?')[0];
      return <ToolRenderer slug={slug} />;
    }

    // 3. Static Pages & Route Aliases
    switch (currentPath) {
      case '/all-tools':
        return <AllToolsPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy-policy':
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms':
      case '/terms-and-conditions':
        return <TermsConditionsPage />;
      case '/disclaimer':
        return <DisclaimerPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}
