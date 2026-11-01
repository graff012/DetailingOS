import React from 'react';
import {
  TrendingUp,
  Radio,
  Car,
  FlaskConical,
} from 'lucide-react';
import { useShopStore, ActiveTab } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, bays, chemicals, language } = useShopStore();

  const occupiedBaysCount = bays.filter(b => b.status === 'OCCUPIED').length;
  const lowStockCount = chemicals.filter(c => c.currentStock <= c.reorderThreshold).length;

  const shortLabels: Record<ActiveTab, Record<'en' | 'ru' | 'uz', string>> = {
    forecast: { en: 'Forecast', ru: 'Прогноз', uz: 'Prognoz' },
    radar: { en: 'Radar', ru: 'Радар', uz: 'Radar' },
    bays: { en: 'Bays', ru: 'Боксы', uz: 'Bokslar' },
    operations: { en: 'CRM', ru: 'CRM', uz: 'CRM' },
  };

  const tabs: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'forecast',
      label: shortLabels.forecast[language] || 'Forecast',
      icon: TrendingUp,
    },
    {
      id: 'radar',
      label: shortLabels.radar[language] || 'Radar',
      icon: Radio,
    },
    {
      id: 'bays',
      label: shortLabels.bays[language] || 'Bays',
      icon: Car,
      badge: occupiedBaysCount,
      badgeColor: 'text-emerald bg-emerald/10 border-emerald/30',
    },
    {
      id: 'operations',
      label: shortLabels.operations[language] || 'CRM',
      icon: FlaskConical,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'text-amber bg-amber/10 border-amber/30',
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 py-1.5 shadow-lg select-none">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-md transition-all relative text-xs',
              isActive
                ? 'text-emerald font-semibold'
                : 'text-foreground-subtle hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'absolute -top-1.5 -right-2.5 text-[9px] font-mono font-bold px-1 rounded-full border tabular-nums',
                    tab.badgeColor || 'text-foreground bg-background border-border'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-sans tracking-tight mt-1 truncate max-w-[70px]">
              {tab.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-emerald mt-0.5" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
