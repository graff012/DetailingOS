import React, { useState, useRef, useEffect } from 'react';
import { ShopStoreProvider, useShopStore } from './store/shop-store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KPIHeader } from './components/layout/KPIHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CommandMenu } from './components/cmdk/CommandMenu';
import { ToastContainer } from './components/ui/ToastContainer';
import { NewBookingModal } from './components/operations/NewBookingModal';
import { YongoqIntegrationModal } from './components/operations/YongoqIntegrationModal';
import { ExecutiveForecastTab } from './components/dashboard/ExecutiveForecastTab';
import { IGRadarTab } from './components/ig-radar/IGRadarTab';
import { LiveBaysWalkaroundTab } from './components/bays/LiveBaysWalkaroundTab';
import { OperationsTab } from './components/operations/OperationsTab';
import { cn } from './lib/utils';

const MainLayout: React.FC = () => {
  const { activeTab, isYongoqModalOpen, setIsYongoqModalOpen } = useShopStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('modal') === 'booking';
    }
    return false;
  });

  // Scroll-reactive KPI banner state (collapses on scroll down, expands on scroll up)
  const [isKpiVisible, setIsKpiVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('kpi') === 'hidden') return false;
    }
    return true;
  });
  const lastScrollTop = useRef(0);

  const handleMainScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;

    // Always keep visible when near the top of the workspace
    if (currentScrollTop <= 15) {
      setIsKpiVisible(true);
      lastScrollTop.current = currentScrollTop;
      return;
    }

    // Scroll delta threshold to avoid jitter on tiny micro-scrolls
    const delta = currentScrollTop - lastScrollTop.current;
    if (Math.abs(delta) < 8) return;

    if (delta > 0) {
      // User is scrolling down -> collapse the 4 boxes to maximize content space
      setIsKpiVisible(false);
    } else {
      // User is scrolling up -> smoothly reveal the 4 boxes
      setIsKpiVisible(true);
    }

    lastScrollTop.current = currentScrollTop;
  };

  // Re-show KPI header whenever user switches tabs
  useEffect(() => {
    setIsKpiVisible(true);
    lastScrollTop.current = 0;
  }, [activeTab]);

  return (
    <div className="flex h-screen w-full max-w-full overflow-x-hidden overflow-y-hidden bg-background text-foreground font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden w-full max-w-full">
        {/* Top Header Status Bar */}
        <Header onOpenNewBooking={() => setIsBookingModalOpen(true)} />

        {/* 4-Card KPI Header (Scroll-reactive: collapses on scroll down, expands on scroll up) */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden shrink-0',
            isKpiVisible
              ? 'max-h-56 opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
          )}
        >
          <KPIHeader />
        </div>

        {/* Scrollable Main Workspace */}
        <main
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full p-3 sm:p-6 pb-24 lg:pb-6 space-y-5 sm:space-y-6"
        >
          {activeTab === 'forecast' && <ExecutiveForecastTab />}
          {activeTab === 'radar' && <IGRadarTab />}
          {activeTab === 'bays' && <LiveBaysWalkaroundTab />}
          {activeTab === 'operations' && <OperationsTab />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop lg) */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <CommandMenu onOpenNewBooking={() => setIsBookingModalOpen(true)} />
      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
      <YongoqIntegrationModal
        isOpen={isYongoqModalOpen}
        onClose={() => setIsYongoqModalOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ShopStoreProvider>
      <MainLayout />
    </ShopStoreProvider>
  );
};

export default App;
