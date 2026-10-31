import React, { useState } from 'react';
import {
  Sun,
  Plus,
  Search,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC<{ onOpenNewBooking: () => void }> = ({ onOpenNewBooking }) => {
  const { campaigns, activateWeatherPromotion, setIsCmdkOpen, chemicals, t } = useShopStore();

  const weatherCamp = campaigns.find(c => c.weatherTriggered);
  const lowStockCount = chemicals.filter(c => c.currentStock <= c.reorderThreshold).length;

  const [weatherActivating, setWeatherActivating] = useState(false);

  const handleQuickWeatherPromo = async () => {
    if (!weatherCamp) return;
    setWeatherActivating(true);
    await activateWeatherPromotion(weatherCamp.id);
    setWeatherActivating(false);
  };

  return (
    <header className="h-14 bg-card border-b border-border px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Weather Trigger Promo Banner Pill */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-background border border-border text-xs">
          <div className="flex items-center gap-1.5 text-foreground-muted font-mono text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber" />
            <span className="font-medium text-foreground">{t.header.weatherCity}</span>
            <span className="text-foreground-subtle">• {t.header.sunnyForecast}</span>
          </div>

          {weatherCamp && weatherCamp.status !== 'ACTIVE' ? (
            <button
              onClick={handleQuickWeatherPromo}
              disabled={weatherActivating}
              className="ml-2 px-2 py-0.5 rounded bg-emerald/10 hover:bg-emerald/20 text-emerald border border-emerald/30 text-[10px] font-mono font-medium transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {weatherActivating ? '...' : t.header.activateWeatherReel}
            </button>
          ) : (
            <span className="ml-1 px-1.5 py-0.2 rounded bg-emerald/10 text-emerald text-[10px] font-mono border border-emerald/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-ping" />
              {t.header.weatherReelActive}
            </span>
          )}
        </div>

        {lowStockCount > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-amber/10 border border-amber/20 text-amber text-[11px] font-mono">
            <ShieldAlert className="w-3 h-3" />
            <span>{lowStockCount} {t.header.chemAlert}</span>
          </div>
        )}
      </div>

      {/* Right: Actions, Global Search Trigger, Language Switcher & Booking CTA */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setIsCmdkOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-background border border-border hover:border-border-bright text-xs text-foreground-muted hover:text-foreground transition-all"
        >
          <Search className="w-3.5 h-3.5 text-foreground-subtle" />
          <span className="font-sans text-[11px] hidden sm:inline">{t.header.searchPlaceholder}</span>
          <kbd className="font-mono text-[10px] bg-card px-1 py-0.5 rounded border border-border text-foreground-subtle">
            ⌘K
          </kbd>
        </button>

        {/* Language Switcher Dropdown (EN / RU / UZ) */}
        <LanguageSwitcher />

        <button
          onClick={onOpenNewBooking}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald hover:bg-emerald/90 text-background font-medium text-xs font-sans transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.header.newBooking}</span>
        </button>
      </div>
    </header>
  );
};
