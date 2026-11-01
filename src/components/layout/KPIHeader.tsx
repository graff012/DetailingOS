import React, { useState, useRef } from 'react';
import { DollarSign, Activity, Target, Zap } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { cn } from '../../lib/utils';

export const KPIHeader: React.FC = () => {
  const { bayUtilSlider, adSpendSlider, t } = useShopStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const index = Math.round((scrollLeft / maxScroll) * (kpis.length - 1));
    setActiveIndex(Math.min(kpis.length - 1, Math.max(0, index)));
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll<HTMLElement>('.kpi-card-item');
    const targetCard = cards[index];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 bg-card border-b border-border z-10 select-none">
      {/* 4 Boxes Row (Swipeable and self-centering on mobile, 4-column grid on desktop) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-stretch overflow-x-auto lg:grid lg:grid-cols-4 gap-2.5 sm:gap-3 py-2.5 sm:py-3.5 snap-x snap-mandatory no-scrollbar scroll-smooth kpi-carousel-snap"
      >
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="kpi-card-item w-[240px] xs:w-[260px] shrink-0 snap-center lg:w-auto lg:min-w-0 lg:max-w-none lg:snap-align-none p-3 sm:p-4 rounded-lg bg-background border border-border hover:border-border-bright transition-all shadow-card flex flex-col justify-between space-y-1.5 sm:space-y-2.5"
            >
              {/* Top row: Label & Icon */}
              <div className="flex items-center justify-between text-xs text-foreground-muted">
                <span className="font-sans font-medium text-[11px] sm:text-xs text-foreground-subtle tracking-tight truncate pr-1">
                  {kpi.title}
                </span>
                <div className="w-5 h-5 rounded bg-card border border-border flex items-center justify-center text-foreground-subtle shrink-0">
                  <Icon className="w-3 h-3 text-emerald" />
                </div>
              </div>

              {/* Middle row: Big Metric */}
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight text-foreground tabular-nums">
                {kpi.value}
              </div>

              {/* Bottom row: Delta Tag & Context */}
              <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 text-xs">
                <span
                  className={cn(
                    'text-[10px] sm:text-[11px] font-mono font-bold px-1.5 py-0.2 rounded border tabular-nums shrink-0',
                    kpi.deltaType === 'positive'
                      ? 'text-emerald bg-emerald/10 border-emerald/20'
                      : 'text-guardsRed bg-guardsRed/10 border-guardsRed/20'
                  )}
                >
                  {kpi.delta}
                </span>
                <span className="text-[10px] sm:text-[11px] text-foreground-subtle font-sans whitespace-nowrap overflow-hidden text-ellipsis">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Swipe Pagination Indicator Dots */}
      <div className="flex justify-center items-center gap-1.5 pb-2 lg:hidden">
        {kpis.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              activeIndex === i ? 'w-5 bg-emerald' : 'w-1.5 bg-border hover:bg-border-bright'
            )}
            title={`Card ${i + 1}`}
            aria-label={`Go to metric ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
