import React, { useState } from 'react';
import { ShopStoreProvider, useShopStore } from './store/shop-store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KPIHeader } from './components/layout/KPIHeader';
import { CommandMenu } from './components/cmdk/CommandMenu';
import { ToastContainer } from './components/ui/ToastContainer';
import { NewBookingModal } from './components/operations/NewBookingModal';
import { ExecutiveForecastTab } from './components/dashboard/ExecutiveForecastTab';
import { IGRadarTab } from './components/ig-radar/IGRadarTab';
import { LiveBaysWalkaroundTab } from './components/bays/LiveBaysWalkaroundTab';
import { OperationsTab } from './components/operations/OperationsTab';

const MainLayout: React.FC = () => {
  const { activeTab } = useShopStore();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Status Bar */}
        <Header onOpenNewBooking={() => setIsBookingModalOpen(true)} />

        {/* 4-Card KPI Sparklines Header */}
        <KPIHeader />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'forecast' && <ExecutiveForecastTab />}
          {activeTab === 'radar' && <IGRadarTab />}
          {activeTab === 'bays' && <LiveBaysWalkaroundTab />}
          {activeTab === 'operations' && <OperationsTab />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CommandMenu onOpenNewBooking={() => setIsBookingModalOpen(true)} />
      <NewBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
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
