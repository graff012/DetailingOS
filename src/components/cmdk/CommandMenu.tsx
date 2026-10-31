import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import {
  Car,
  Search,
  Sparkles,
  TrendingUp,
  Radio,
  FlaskConical,
  Wrench,
  ShieldAlert,
  ArrowRight,
  Send,
  Zap,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';

export const CommandMenu: React.FC<{ onOpenNewBooking: () => void }> = ({ onOpenNewBooking }) => {
  const {
    isCmdkOpen,
    setIsCmdkOpen,
    vehicles,
    customers,
    setActiveTab,
    setSelectedVehicleId,
    activateWeatherPromotion,
    campaigns,
    sendRetentionReminder,
    addToast,
  } = useShopStore();

  const [search, setSearch] = useState('');

  // Close on Escape or click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCmdkOpen) {
        setIsCmdkOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCmdkOpen, setIsCmdkOpen]);

  if (!isCmdkOpen) return null;

  const weatherCamp = campaigns.find(c => c.weatherTriggered);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-card border border-border shadow-popover rounded-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Command
          label="Global Search Command Bar"
          className="w-full flex flex-col"
          shouldFilter={true}
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-border bg-card-subtle gap-3">
            <Search className="w-4 h-4 text-foreground-subtle shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search license plate (e.g. M-GT-992), client, or run command..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none font-sans"
              autoFocus
            />
            <kbd className="text-[10px] font-mono text-foreground-subtle bg-background px-1.5 py-0.5 rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <Command.List className="max-h-[380px] overflow-y-auto p-2 space-y-2 text-xs">
            <Command.Empty className="py-8 text-center text-xs text-foreground-subtle font-mono">
              No matching license plates, clients, or commands found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="QUICK COMMANDS" className="text-[10px] font-mono text-foreground-subtle uppercase px-2 py-1">
              <Command.Item
                value="new booking schedule vehicle"
                onSelect={() => {
                  setIsCmdkOpen(false);
                  onOpenNewBooking();
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-emerald" />
                  <span className="font-medium text-xs">+ Schedule New Studio Booking</span>
                </div>
                <span className="font-mono text-[10px] text-foreground-subtle group-hover:text-foreground">Enter ↵</span>
              </Command.Item>

              {weatherCamp && (
                <Command.Item
                  value="activate weather promo mcp campaign"
                  onSelect={async () => {
                    setIsCmdkOpen(false);
                    await activateWeatherPromotion(weatherCamp.id);
                  }}
                  className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber" />
                    <span className="font-medium text-xs">Deploy Weather-Triggered Reel via MCP (8km Radius)</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald">1-Click MCP</span>
                </Command.Item>
              )}
            </Command.Group>

            {/* Navigation Commands */}
            <Command.Group heading="NAVIGATION VIEWS" className="text-[10px] font-mono text-foreground-subtle uppercase px-2 py-1">
              <Command.Item
                value="view overview executive 90-day forecast ltv cac"
                onSelect={() => {
                  setActiveTab('forecast');
                  setIsCmdkOpen(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald" />
                  <span>Executive Overview & 90-Day Financial Forecast</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle" />
              </Command.Item>

              <Command.Item
                value="view instagram ads radar targeting meta mcp kill switch"
                onSelect={() => {
                  setActiveTab('radar');
                  setIsCmdkOpen(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-emerald" />
                  <span>Instagram Ad Targeting Radar (Meta MCP Command Center)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle" />
              </Command.Item>

              <Command.Item
                value="view live bays car damage liability map walkaround inspection"
                onSelect={() => {
                  setActiveTab('bays');
                  setIsCmdkOpen(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-emerald" />
                  <span>Live Bays Tracker & Digital Vehicle Walkaround Map</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle" />
              </Command.Item>

              <Command.Item
                value="view chemical burn-rate consumables retention crm technician commissions"
                onSelect={() => {
                  setActiveTab('operations');
                  setIsCmdkOpen(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 text-amber" />
                  <span>Chemical Inventory, Retention CRM & Commissions</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-foreground-subtle" />
              </Command.Item>
            </Command.Group>

            {/* License Plates & Vehicles */}
            <Command.Group heading="VEHICLES & CLIENT RECORDS" className="text-[10px] font-mono text-foreground-subtle uppercase px-2 py-1">
              {vehicles.map(v => {
                const cust = customers.find(c => c.id === v.customerId);

                return (
                  <Command.Item
                    key={v.id}
                    value={`${v.licensePlate} ${v.make} ${v.model} ${cust?.fullName || ''} ${v.color}`}
                    onSelect={() => {
                      setSelectedVehicleId(v.id);
                      setActiveTab('bays');
                      setIsCmdkOpen(false);
                    }}
                    className="flex items-center justify-between px-2.5 py-2 rounded text-foreground hover:bg-card-hover cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-xs text-foreground px-2 py-0.5 rounded bg-background border border-border tabular-nums tracking-wide">
                        {v.licensePlate}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-xs text-foreground">
                          {v.make} {v.model}
                        </span>
                        <span className="text-[11px] text-foreground-subtle">
                          Owner: {cust?.fullName} • {v.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-foreground-subtle">
                        {v.inspectionMarkers.length} Pins
                      </span>
                      <span className="text-[11px] font-mono text-emerald group-hover:underline flex items-center gap-1">
                        Inspect Map →
                      </span>
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          {/* Footer Keyboard hints */}
          <div className="px-4 py-2 border-t border-border bg-card-subtle flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span>DetailingOS Command Bar</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
