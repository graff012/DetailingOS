import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Sliders,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import {
  generate90DayForecast,
  getDetailingCohortModels,
  analyzeBayBottleneck,
} from '../../lib/finance-engine';
import { formatCurrency, cn } from '../../lib/utils';

export const ExecutiveForecastTab: React.FC = () => {
  const {
    adSpendSlider,
    setAdSpendSlider,
    bayUtilSlider,
    setBayUtilSlider,
    t,
  } = useShopStore();

  // Dynamic 90-day time-series points based on current sliders
  const forecastData = useMemo(() => {
    return generate90DayForecast(adSpendSlider, bayUtilSlider, 142, 21.5);
  }, [adSpendSlider, bayUtilSlider]);

  // Cohort LTV analysis models
  const cohorts = useMemo(() => {
    return getDetailingCohortModels();
  }, []);

  // Operational bottleneck calculation
  const bottleneck = useMemo(() => {
    return analyzeBayBottleneck({
      weeklyRevenueTarget: 16500,
      bay1PpfJobRevenue: 3600,
      otherBaysProjectedRevenue: 8400,
      bay2ExpressWashPrice: 85,
    });
  }, []);

  // Summary forecast aggregates
  const day90Projected = forecastData[150]?.projectedRevenue || 0;
  const total90DayVolume = forecastData
    .filter(p => !p.isHistorical)
    .reduce((acc, p) => acc + p.projectedRevenue, 0);

  // Scenario quick setters
  const applyScenario = (adSpend: number, util: number) => {
    setAdSpendSlider(adSpend);
    setBayUtilSlider(util);
  };

  return (
    <div className="space-y-5">
      {/* 1. Main Forecast & Interactive Simulation Card */}
      <div className="p-5 rounded-lg bg-card border border-border shadow-card space-y-4">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald" />
              <h2 className="text-sm font-semibold tracking-tight text-foreground font-sans">
                {t.forecast.title}
              </h2>
            </div>
            <p className="text-xs text-foreground-subtle font-mono mt-0.5">
              {t.forecast.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="text-[10px] text-foreground-subtle uppercase">{t.forecast.total90d}</div>
              <div className="text-sm font-bold text-emerald tabular-nums">
                {formatCurrency(total90DayVolume)}
              </div>
            </div>
            <div className="h-7 w-px bg-border" />
            <div className="text-right">
              <div className="text-[10px] text-foreground-subtle uppercase">{t.forecast.day90RunRate}</div>
              <div className="text-sm font-bold text-foreground tabular-nums">
                {formatCurrency(day90Projected * 30)}/mo
              </div>
            </div>
          </div>
        </div>

        {/* Quick Scenario Buttons & Interactive Sliders */}
        <div className="space-y-3 pt-1">
          {/* Quick Scenario Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="text-[11px] text-foreground-subtle">{t.forecast.scenarios}</span>
            <button
              onClick={() => applyScenario(25, 75)}
              className={cn(
                'px-2.5 py-1 rounded text-xs transition-all border',
                adSpendSlider === 25 && bayUtilSlider === 75
                  ? 'bg-emerald/10 border-emerald/40 text-emerald font-semibold'
                  : 'bg-background border-border text-foreground-muted hover:text-foreground'
              )}
            >
              {t.forecast.scenarioConservative}
            </button>
            <button
              onClick={() => applyScenario(65, 82)}
              className={cn(
                'px-2.5 py-1 rounded text-xs transition-all border',
                adSpendSlider === 65 && bayUtilSlider === 82
                  ? 'bg-emerald/10 border-emerald/40 text-emerald font-semibold'
                  : 'bg-background border-border text-foreground-muted hover:text-foreground'
              )}
            >
              {t.forecast.scenarioGrowth}
            </button>
            <button
              onClick={() => applyScenario(120, 92)}
              className={cn(
                'px-2.5 py-1 rounded text-xs transition-all border',
                adSpendSlider === 120 && bayUtilSlider === 92
                  ? 'bg-emerald/10 border-emerald/40 text-emerald font-semibold'
                  : 'bg-background border-border text-foreground-muted hover:text-foreground'
              )}
            >
              {t.forecast.scenarioScale}
            </button>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Slider 1: Ad Spend */}
            <div className="space-y-1.5 p-3 rounded-md bg-background border border-border/70">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5 font-sans">
                  <Sliders className="w-3.5 h-3.5 text-emerald" />
                  {t.forecast.dailyAdSpend}
                </span>
                <span className="font-mono font-bold text-emerald tabular-nums">
                  ${adSpendSlider}/d{' '}
                  <span className="text-[11px] text-foreground-subtle font-normal">
                    (${adSpendSlider * 30}/mo)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={adSpendSlider}
                onChange={e => setAdSpendSlider(Number(e.target.value))}
                className="w-full accent-emerald bg-card h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Slider 2: Bay Utilization */}
            <div className="space-y-1.5 p-3 rounded-md bg-background border border-border/70">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground flex items-center gap-1.5 font-sans">
                  <Target className="w-3.5 h-3.5 text-emerald" />
                  {t.forecast.targetBayUtil}
                </span>
                <span className="font-mono font-bold text-emerald tabular-nums">
                  {bayUtilSlider}%{' '}
                  <span className="text-[11px] text-foreground-subtle font-normal">
                    ({Math.round((bayUtilSlider / 100) * 4 * 48)} hrs/wk)
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                step={1}
                value={bayUtilSlider}
                onChange={e => setBayUtilSlider(Number(e.target.value))}
                className="w-full accent-emerald bg-card h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 2. Recharts Area Chart */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-foreground">
                <span className="w-2.5 h-0.5 bg-foreground" /> {t.forecast.histActuals}
              </span>
              <span className="flex items-center gap-1 text-emerald">
                <span className="w-2.5 h-0.5 bg-emerald" /> {t.forecast.projMean}
              </span>
              <span className="flex items-center gap-1 text-foreground-subtle">
                <span className="w-2.5 h-2 bg-emerald/10 border border-emerald/20" /> {t.forecast.confidenceCone}
              </span>
            </div>
            <span className="text-[11px] font-mono text-foreground-subtle hidden sm:inline">
              {t.forecast.updatedSmoothing}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={forecastData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="confidenceCone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                <XAxis
                  dataKey="dateStr"
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#27272A' }}
                  interval={14}
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#27272A' }}
                  tickFormatter={val => `$${val}`}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="p-2.5 rounded bg-[#121215] border border-border shadow-popover text-xs font-mono">
                        <div className="text-[10px] text-foreground-subtle mb-1 flex items-center justify-between gap-4">
                          <span>{d.dateStr}</span>
                          <span className={d.isHistorical ? 'text-foreground' : 'text-emerald font-bold'}>
                            {d.isHistorical ? t.forecast.histActuals : t.forecast.projMean}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {d.isHistorical ? (
                            <div className="text-sm font-bold text-foreground tabular-nums">
                              {formatCurrency(d.actualRevenue)}
                            </div>
                          ) : (
                            <>
                              <div className="text-sm font-bold text-emerald tabular-nums">
                                {formatCurrency(d.projectedRevenue)}
                              </div>
                              <div className="text-[10px] text-foreground-subtle flex justify-between gap-4">
                                <span>Range:</span>
                                <span className="tabular-nums">
                                  {formatCurrency(d.lowerConfidenceBound)} – {formatCurrency(d.upperConfidenceBound)}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="text-[10px] text-foreground-muted pt-1 border-t border-border flex justify-between gap-3">
                            <span>Maint. Recurring:</span>
                            <span className="tabular-nums">{formatCurrency(d.maintRecurringPortion)}</span>
                          </div>
                          <div className="text-[10px] text-foreground-muted flex justify-between gap-3">
                            <span>Ad-Acquired:</span>
                            <span className="tabular-nums">{formatCurrency(d.adAcquiredPortion)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="upperConfidenceBound"
                  stroke="none"
                  fill="url(#confidenceCone)"
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="lowerConfidenceBound"
                  stroke="none"
                  fill="#09090B"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="actualRevenue"
                  stroke="#FAFAFA"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="projectedRevenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2-Column: Customer Economics (LTV) & Studio Capacity (Bottleneck) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Customer Economics (LTV Cohorts) */}
        <div className="p-4 sm:p-5 rounded-lg bg-card border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                {t.forecast.cohortLtvTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded">
              {t.forecast.funnelRoas} {cohorts.conversionFunnelInsight.sixtyDayROAS}x
            </span>
          </div>

          {/* Clean 2-Card Cohort Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-md bg-background border border-border space-y-2">
              <span className="text-xs font-bold text-foreground font-sans block">
                Standard Wash
              </span>
              <div className="space-y-1 font-mono text-[11px] text-foreground-subtle">
                <div className="flex justify-between">
                  <span>{t.forecast.avgTicketSize}</span>
                  <span className="text-foreground tabular-nums">${cohorts.standardWashCohort.averageTicketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.forecast.visitsPerYear}</span>
                  <span className="text-foreground tabular-nums">{cohorts.standardWashCohort.visitsPerYear}x</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.forecast.grossMargin}</span>
                  <span className="text-foreground tabular-nums">{Math.round(cohorts.standardWashCohort.grossMarginPercent * 100)}%</span>
                </div>
                <div className="pt-1.5 border-t border-border flex justify-between font-bold">
                  <span className="text-foreground">{t.forecast.baseLtv}</span>
                  <span className="text-foreground tabular-nums">
                    {formatCurrency(cohorts.standardWashCohort.calculatedLtv)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-md bg-background border border-emerald/20 space-y-2">
              <span className="text-xs font-bold text-emerald font-sans flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ceramic & PPF VIP
              </span>
              <div className="space-y-1 font-mono text-[11px] text-foreground-subtle">
                <div className="flex justify-between">
                  <span>{t.forecast.initialPackage}</span>
                  <span className="text-foreground tabular-nums">$1,450</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.forecast.maintTicket}</span>
                  <span className="text-foreground tabular-nums">${cohorts.ceramicVipCohort.averageTicketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.forecast.grossMargin}</span>
                  <span className="text-emerald tabular-nums">{Math.round(cohorts.ceramicVipCohort.grossMarginPercent * 100)}%</span>
                </div>
                <div className="pt-1.5 border-t border-border flex justify-between font-bold">
                  <span className="text-foreground">{t.forecast.vipLtv}</span>
                  <span className="text-emerald tabular-nums">
                    {formatCurrency(cohorts.ceramicVipCohort.calculatedLtv)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel Takeaway */}
          <div className="p-2.5 rounded-md bg-card-subtle border border-border text-xs font-mono text-foreground-subtle flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {t.forecast.funnelLogicDesc}
            </p>
          </div>
        </div>

        {/* Shop Capacity (Bottleneck) */}
        <div className="p-4 sm:p-5 rounded-lg bg-card border border-border shadow-card space-y-3.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                {t.forecast.shopBottleneckTitle}
              </h3>
            </div>
            <span
              className={cn(
                'text-[10px] font-mono px-2 py-0.5 rounded border font-semibold',
                bottleneck.isBottleneckFeasible
                  ? 'text-emerald bg-emerald/10 border-emerald/20'
                  : 'text-amber bg-amber/10 border-amber/20'
              )}
            >
              {bottleneck.isBottleneckFeasible ? t.forecast.scheduleBalanced : t.forecast.turnoverDeficitAlert}
            </span>
          </div>

          <p className="text-foreground-subtle text-xs leading-relaxed">
            {t.forecast.bottleneckScenario}
          </p>

          <div className="p-3 rounded-md bg-background border border-border font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-foreground-subtle">{t.forecast.weeklyTarget}</span>
              <span className="text-foreground font-bold tabular-nums">
                {formatCurrency(bottleneck.weeklyRevenueTarget)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-subtle">{t.forecast.bay1PpfLocked}</span>
              <span className="text-emerald tabular-nums">+{formatCurrency(bottleneck.bay1PpfJobRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-subtle">{t.forecast.otherBaysBaseline}</span>
              <span className="text-foreground tabular-nums">+{formatCurrency(bottleneck.otherBaysProjectedRevenue)}</span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between">
              <span className="text-foreground-subtle">{t.forecast.bay2Shortfall}</span>
              <span className="text-amber font-bold tabular-nums">
                {formatCurrency(bottleneck.revenueShortfall)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-border/40">
              <span className="text-foreground-subtle">{t.forecast.requiredExpressWashes}</span>
              <span className="text-foreground font-bold tabular-nums px-2 py-0.5 rounded bg-card border border-border">
                {bottleneck.requiredExpressWashes} washes
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
            <span>{t.forecast.bay2Capacity} {bottleneck.maxFeasibleExpressWashes} slots/wk</span>
            <span className={bottleneck.isBottleneckFeasible ? 'text-emerald font-semibold' : 'text-amber font-semibold'}>
              {bottleneck.isBottleneckFeasible
                ? `+${bottleneck.surplusDeficit} ${t.forecast.bufferRemaining}`
                : `${t.forecast.overtimeSlots}: +${Math.abs(bottleneck.surplusDeficit)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
