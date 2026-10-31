import React from 'react';
import { DollarSign, Activity, Target, Zap } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const KPIHeader: React.FC = () => {
  const { bayUtilSlider, adSpendSlider, t } = useShopStore();

  const kpis = [
    {
      title: t.kpi.netRevenue,
      value: '$14,280',
      delta: '+18.4%',
      deltaType: 'positive',
      subtext: t.kpi.revSubtext,
      icon: DollarSign,
    },
    {
      title: t.kpi.bayUtil,
      value: `${bayUtilSlider.toFixed(1)}%`,
      delta: bayUtilSlider >= 80 ? t.kpi.optimal : t.kpi.healthy,
      deltaType: 'positive',
      subtext: t.kpi.bayUtilSubtext,
      icon: Activity,
    },
    {
      title: t.kpi.cac,
      value: '$18.40',
      delta: '-12.3%',
      deltaType: 'positive',
      subtext: t.kpi.cacSubtext,
      icon: Target,
    },
    {
      title: t.kpi.roas,
      value: '4.82x',
      delta: '+0.65x',
      deltaType: 'positive',
      subtext: `$${adSpendSlider}/d ${t.kpi.roasSubtext}`,
      icon: Zap,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:px-6 border-b border-border bg-card/40">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;

        return (
          <div
            key={idx}
            className="p-4 rounded-lg bg-card border border-border hover:border-border-bright transition-all shadow-card flex flex-col justify-between space-y-2.5"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="font-sans font-medium text-xs text-foreground-subtle tracking-tight">
                {kpi.title}
              </span>
              <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center text-foreground-subtle">
                <Icon className="w-3 h-3 text-emerald" />
              </div>
            </div>

            {/* Middle row: Big Metric */}
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
              {kpi.value}
            </div>

            {/* Bottom row: Delta Tag & Full-width Context (Never Truncates) */}
            <div className="flex items-center gap-2 pt-0.5 text-xs">
              <span
                className={cn(
                  'text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border tabular-nums shrink-0',
                  kpi.deltaType === 'positive'
                    ? 'text-emerald bg-emerald/10 border-emerald/20'
                    : 'text-guardsRed bg-guardsRed/10 border-guardsRed/20'
                )}
              >
                {kpi.delta}
              </span>
              <span className="text-[11px] text-foreground-subtle font-sans whitespace-nowrap overflow-hidden text-ellipsis">
                {kpi.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
