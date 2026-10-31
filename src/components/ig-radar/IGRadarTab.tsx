import React, { useState } from 'react';
import {
  Radio,
  Send,
  Zap,
  MapPin,
  Sun,
  CloudRain,
  ShieldAlert,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { MetaMCPService, KNOWN_INTERESTS } from '../../services/meta-mcp.service';
import { formatCurrency, formatNumber, cn } from '../../lib/utils';
import { IgCampaign } from '../../types';

export const IGRadarTab: React.FC = () => {
  const {
    campaigns,
    weather,
    mcpLogs,
    toggleCampaignStatus,
    updateKillSwitchThreshold,
    executeNaturalLanguageMcpPrompt,
    activateWeatherPromotion,
  } = useShopStore();

  const metaMcp = MetaMCPService.getInstance();

  // Natural Language Prompt state
  const [promptText, setPromptText] = useState(
    'Target Porsche and BMW owners within 10km with the Gyeon Ceramic Reel at $20/day'
  );
  const [isExecutingPrompt, setIsExecutingPrompt] = useState(false);

  // Live parsed preview of current prompt
  const parsedPreview = metaMcp.parseNaturalLanguagePrompt(promptText);

  // Interactive Geo-Radius Builder state
  const [geoRadius, setGeoRadius] = useState<number>(10);
  const [minAge, setMinAge] = useState<number>(25);
  const [maxAge, setMaxAge] = useState<number>(60);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Porsche',
    'BMW M',
    'Track Days',
  ]);

  // Handle NLP Prompt submission
  const handleExecutePrompt = async () => {
    if (!promptText.trim()) return;
    setIsExecutingPrompt(true);
    await executeNaturalLanguageMcpPrompt(promptText);
    setIsExecutingPrompt(false);
  };

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const weatherCamp = campaigns.find(c => c.weatherTriggered);

  return (
    <div className="space-y-6">
      {/* 1. Natural Language MCP Command Bar */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Meta Ads MCP Natural Language Command Bar
            </h2>
          </div>
          <span className="text-[10px] font-mono text-foreground-subtle flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
            Meta Marketing Graph API v25.0
          </span>
        </div>

        {/* Input & Action */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="e.g. Target Porsche and BMW owners within 10km with Gyeon Reel at $20/day..."
              className="w-full bg-background border border-border rounded px-3.5 py-2.5 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-border-bright font-sans"
            />
          </div>
          <button
            onClick={handleExecutePrompt}
            disabled={isExecutingPrompt || !promptText.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded bg-emerald hover:bg-emerald/90 text-background font-medium text-xs transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            {isExecutingPrompt ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{isExecutingPrompt ? 'Executing MCP...' : 'Compile & Deploy'}</span>
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
          <span className="text-foreground-subtle text-[10px] self-center mr-1">PRESETS:</span>
          {[
            'Boost SUV ads for rainy weekend at $25/day within 8km',
            'Target Porsche 911 GT3 owners within 12km with XPEL PPF Reel at $40/day',
            'Target Mercedes-AMG & Tesla within 15km for Ceramic Coating at $30/day',
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setPromptText(preset)}
              className="px-2 py-0.5 rounded bg-background border border-border hover:border-border-bright text-foreground-subtle hover:text-foreground transition-colors text-[10px]"
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Live MCP Tool Execution Preview Box */}
        <div className="p-3 rounded bg-card-subtle border border-border space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <Terminal className="w-3 h-3 text-emerald" />
              Compiled MCP Tool Execution Plan:
            </span>
            <span>
              Target Budget: ${parsedPreview.detectedDailyBudget}/day • Radius: {parsedPreview.detectedRadiusKm}km
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {parsedPreview.generatedToolCalls.map((call, i) => (
              <div
                key={i}
                className="p-2 rounded bg-background border border-border text-[11px] font-mono space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald font-semibold">{call.toolName}</span>
                  <span className="text-foreground-subtle">#{i + 1}</span>
                </div>
                <p className="text-foreground-subtle text-[10px] leading-tight truncate">
                  {call.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2-Column: Weather Promo Card & Hyper-Local Geo-Radius Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather-Triggered Promo Automation Card */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Weather-Triggered Promo Engine
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded">
                Weather Window: OPEN
              </span>
            </div>

            {/* 5-Day Weather Forecast Strip */}
            <div className="grid grid-cols-5 gap-2 my-3">
              {weather.map((w, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'p-2 rounded border text-center flex flex-col items-center gap-1 font-mono transition-all',
                    w.isFavorableForWash
                      ? 'bg-background border-border text-foreground'
                      : 'bg-card-subtle border-border/40 text-foreground-subtle'
                  )}
                >
                  <span className="text-[10px] text-foreground-subtle">{w.day}</span>
                  {w.isFavorableForWash ? (
                    <Sun className="w-4 h-4 text-amber" />
                  ) : (
                    <CloudRain className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-xs font-bold tabular-nums">{w.tempC}°C</span>
                  <span className="text-[9px] text-foreground-subtle tabular-nums">
                    {w.precipitationProbability}% Rain
                  </span>
                </div>
              ))}
            </div>

            {/* Weather Actionable Prompt */}
            <div className="p-3 rounded bg-amber/5 border border-amber/20 text-xs font-sans space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Sunny Window Trigger Activated
              </div>
              <p className="text-foreground-subtle text-[11px] leading-relaxed">
                4 consecutive sunny days ahead in Munich/Stuttgart. Rain has cleared paint contaminants.
                Recommended: Deploy a $25/day "Post-Rain Hydrophobic Decon" Reel targeting vehicles within 8km.
              </p>
            </div>
          </div>

          {/* Trigger Button */}
          {weatherCamp && (
            <button
              onClick={() => activateWeatherPromotion(weatherCamp.id)}
              disabled={weatherCamp.status === 'ACTIVE'}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2 px-3 rounded font-medium text-xs font-mono transition-all',
                weatherCamp.status === 'ACTIVE'
                  ? 'bg-emerald/10 border border-emerald/30 text-emerald cursor-default'
                  : 'bg-emerald hover:bg-emerald/90 text-background active:scale-98 shadow-sm'
              )}
            >
              {weatherCamp.status === 'ACTIVE' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                  <span>Weather Promo Currently ACTIVE via MCP (Radius: 8km • $25/day)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>1-Click Activate Weather Promo via MCP</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Hyper-Local Geo-Radius & Luxury Interest Builder */}
        <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Geo-Radius & Luxury Audience Builder
              </h3>
            </div>
            <span className="text-[10px] font-mono text-foreground-subtle">
              Studio: {metaMcp.GARAGE_COORDINATES.lat.toFixed(4)}°N, {metaMcp.GARAGE_COORDINATES.lng.toFixed(4)}°E
            </span>
          </div>

          {/* Geo-Radius Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-foreground font-sans">
                Studio Geo-Radius Drop-Pin
              </span>
              <span className="font-mono font-bold text-emerald tabular-nums bg-background px-2 py-0.5 rounded border border-border">
                {geoRadius} km radius
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={25}
              step={1}
              value={geoRadius}
              onChange={e => setGeoRadius(Number(e.target.value))}
              className="w-full accent-emerald bg-background h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-foreground-subtle">
              <span>5 km (City Center VIP)</span>
              <span>15 km (Greater Metro)</span>
              <span>25 km (Regional Supercar Belt)</span>
            </div>
          </div>

          {/* Luxury Interest Cluster Tags */}
          <div className="space-y-2">
            <label className="block text-[11px] font-mono text-foreground-muted uppercase">
              High-Ticket Interest Clusters (Graph API Verified)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(KNOWN_INTERESTS).map(key => {
                const interest = KNOWN_INTERESTS[key];
                const isSelected = selectedInterests.includes(interest.name);

                return (
                  <button
                    key={interest.id}
                    onClick={() => handleInterestToggle(interest.name)}
                    className={cn(
                      'px-2.5 py-1 rounded text-[11px] font-mono transition-all border flex items-center gap-1.5',
                      isSelected
                        ? 'bg-emerald/10 border-emerald/40 text-emerald font-medium'
                        : 'bg-background border-border text-foreground-subtle hover:text-foreground'
                    )}
                  >
                    <span>{interest.name}</span>
                    <span className="text-[9px] opacity-70">
                      ({formatNumber(interest.audienceSize)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audience Estimate Pill */}
          <div className="p-2.5 rounded bg-background border border-border flex items-center justify-between text-xs font-mono">
            <span className="text-foreground-subtle">Estimated High-Ticket Reach:</span>
            <span className="text-emerald font-bold tabular-nums">
              ~{formatNumber(Math.round(18000 * Math.pow(geoRadius / 5, 1.35)))} Luxury Owners
            </span>
          </div>
        </div>
      </div>

      {/* 3. Active Reels Matrix & Automated Kill-Switch Rules Table */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Active Reels Matrix & Automated Kill-Switch Rules
            </h3>
          </div>
          <span className="text-[10px] font-mono text-foreground-subtle">
            Auto-pause armed if Cost Per Lead &gt; $18.00
          </span>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-foreground-subtle text-[10px] uppercase">
                <th className="py-2 px-3">Ad Creative & Campaign</th>
                <th className="py-2 px-3">Radius</th>
                <th className="py-2 px-3">Spend</th>
                <th className="py-2 px-3">Leads</th>
                <th className="py-2 px-3">Cost / Lead</th>
                <th className="py-2 px-3">Attr. Revenue</th>
                <th className="py-2 px-3">ROAS</th>
                <th className="py-2 px-3 text-right">Kill / Scale Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {campaigns.map(camp => {
                const isKillSwitched = camp.status === 'KILL_SWITCHED';
                const isCplBreached = camp.costPerLead > camp.autoKillCplLimit;
                const roas = camp.totalSpend > 0 ? (camp.revenueAttributed / camp.totalSpend) : 0;

                return (
                  <tr key={camp.id} className="hover:bg-card-hover/50 transition-colors">
                    {/* Creative & Title */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={camp.creativeThumbnail}
                          alt="Ad thumbnail"
                          className="w-10 h-10 rounded object-cover border border-border shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground truncate max-w-xs font-sans text-xs">
                            {camp.name}
                          </span>
                          <span className="text-[10px] text-foreground-subtle truncate">
                            {camp.creativeType.replace(/_/g, ' ')} • ${camp.dailyBudget}/day
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Radius */}
                    <td className="py-2.5 px-3 text-foreground tabular-nums">
                      {camp.radiusKm} km
                    </td>

                    {/* Spend */}
                    <td className="py-2.5 px-3 text-foreground tabular-nums">
                      {formatCurrency(camp.totalSpend)}
                    </td>

                    {/* Leads */}
                    <td className="py-2.5 px-3 text-foreground tabular-nums font-bold">
                      {camp.leadsGenerated}
                    </td>

                    {/* Cost Per Lead */}
                    <td className="py-2.5 px-3 tabular-nums">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[11px] font-bold border',
                          isCplBreached
                            ? 'text-guardsRed bg-guardsRed/10 border-guardsRed/20'
                            : 'text-emerald bg-emerald/10 border-emerald/20'
                        )}
                      >
                        ${camp.costPerLead.toFixed(2)}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-2.5 px-3 text-foreground tabular-nums font-bold">
                      {formatCurrency(camp.revenueAttributed)}
                    </td>

                    {/* ROAS */}
                    <td className="py-2.5 px-3 tabular-nums font-bold">
                      <span className={roas >= 4.0 ? 'text-emerald' : 'text-amber'}>
                        {roas.toFixed(2)}x
                      </span>
                    </td>

                    {/* Kill-Switch / Toggle */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isKillSwitched ? (
                          <span className="px-2 py-0.5 rounded bg-guardsRed/10 border border-guardsRed/30 text-guardsRed text-[10px] font-bold">
                            RULE KILLED (&gt; $18)
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleCampaignStatus(camp.id)}
                            className={cn(
                              'px-2.5 py-1 rounded text-[10px] font-bold transition-all border flex items-center gap-1',
                              camp.status === 'ACTIVE'
                                ? 'bg-emerald/10 border-emerald/30 text-emerald hover:bg-emerald/20'
                                : 'bg-background border-border text-foreground-subtle hover:text-foreground'
                            )}
                          >
                            {camp.status === 'ACTIVE' ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                                ACTIVE
                              </>
                            ) : (
                              <>
                                <Pause className="w-3 h-3" />
                                PAUSED
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live MCP JSON-RPC Log Console */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Meta MCP JSON-RPC 2.0 Call Stack (Graph API v25.0)
            </h3>
          </div>
          <span className="text-[10px] text-foreground-subtle">
            {mcpLogs.length} RPC Calls Logged
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1.5 text-[11px] pr-1">
          {mcpLogs.map(log => (
            <div
              key={log.id}
              className="p-2 rounded bg-background border border-border/70 flex flex-col gap-1 hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-1 py-0.2 rounded font-bold uppercase text-[9px]',
                      log.status === 'SUCCESS' ? 'text-emerald bg-emerald/10' : 'text-guardsRed bg-guardsRed/10'
                    )}
                  >
                    {log.status}
                  </span>
                  <span className="text-foreground font-bold">{log.toolName}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground-subtle">
                  <span>{log.latencyMs}ms</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
              <div className="text-[10px] text-foreground-subtle truncate">
                <span className="text-foreground-muted">args:</span> {JSON.stringify(log.arguments)}
              </div>
              {log.response && (
                <div className="text-[10px] text-emerald/80 truncate">
                  <span className="text-foreground-muted">result:</span> {JSON.stringify(log.response)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
