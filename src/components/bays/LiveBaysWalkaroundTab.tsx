import React, { useState } from 'react';
import {
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Camera,
  Share2,
  Plus,
  Trash2,
  Wrench,
  Sparkles,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { DamageType, PanelZone } from '../../types';
import { formatHours, formatCurrency, cn } from '../../lib/utils';

export const LiveBaysWalkaroundTab: React.FC = () => {
  const {
    bays,
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    advanceBookingStage,
    completeBooking,
    addInspectionMarker,
    removeInspectionMarker,
    beforeAfterMedia,
    pushMediaToIgQueue,
  } = useShopStore();

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  // Damage marker placement form state
  const [selectedDamageType, setSelectedDamageType] = useState<DamageType>('ROCK_CHIP');
  const [selectedPanelZone, setSelectedPanelZone] = useState<PanelZone>('FRONT_BUMPER');
  const [markerNotes, setMarkerNotes] = useState('');
  const [severity, setSeverity] = useState<'LIGHT' | 'MODERATE' | 'SEVERE'>('LIGHT');

  // Handle click on top-down SVG vehicle to drop pin
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Approximate panel zone based on Y coordinate
    let zone: PanelZone = 'HOOD';
    if (y < 20) zone = 'FRONT_BUMPER';
    else if (y < 35) zone = 'HOOD';
    else if (y < 65) {
      if (x < 30) zone = 'DRIVER_DOOR';
      else if (x > 70) zone = 'PASSENGER_DOOR';
      else zone = 'ROOF';
    } else if (y < 85) {
      zone = x < 50 ? 'REAR_LEFT_QUARTER' : 'REAR_RIGHT_QUARTER';
    } else {
      zone = 'REAR_BUMPER';
    }

    addInspectionMarker({
      vehicleId: selectedVehicle.id,
      panelZone: zone,
      damageType: selectedDamageType,
      coordinateX: x,
      coordinateY: y,
      severity,
      notes: markerNotes || `Liability pre-inspection note for ${selectedDamageType.replace('_', ' ')}`,
    });

    setMarkerNotes('');
  };

  const damageColorMap: Record<DamageType, string> = {
    SCRATCH: '#EF4444', // Guards Red
    DENT: '#F59E0B', // Amber
    ROCK_CHIP: '#EF4444',
    SWIRL_MARKS: '#3B82F6',
    CLEARCOAT_OXIDATION: '#A855F7',
    CURB_RASH: '#F59E0B',
    WATER_SPOTS: '#06B6D4',
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Bay Tracker (4 Bays Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Live Shop Bays Tracker (Turnaround & Stage Stepper)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-foreground-subtle">
            All 4 Bays Monitored Live
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {bays.map(bay => {
            const booking = bay.currentBooking;
            const progressPercent = booking
              ? Math.min(100, Math.round((booking.elapsedMinutes / booking.estimatedMinutes) * 100))
              : 0;

            return (
              <div
                key={bay.id}
                className="p-3.5 rounded-lg bg-card border border-border hover:border-border-bright transition-all shadow-card flex flex-col justify-between space-y-3"
              >
                {/* Bay Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-foreground font-sans">
                      {bay.name}
                    </span>
                    <span className="text-[10px] font-mono text-foreground-subtle">
                      Benchmark: ${bay.hourlyRevenueBenchmark}/hr
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border',
                      bay.status === 'OCCUPIED'
                        ? 'text-emerald bg-emerald/10 border-emerald/20'
                        : 'text-foreground-subtle bg-background border-border'
                    )}
                  >
                    {bay.status}
                  </span>
                </div>

                {/* Booking Info */}
                {booking ? (
                  <div className="space-y-2.5">
                    {/* Vehicle & Plate */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-foreground truncate">
                          {booking.vehicleModel}
                        </span>
                        <span className="text-[10px] text-foreground-subtle truncate">
                          Tech: {booking.technicianName}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded bg-background border border-border text-foreground tabular-nums shrink-0">
                        {booking.vehiclePlate}
                      </span>
                    </div>

                    {/* Stage Badge & Elapsed Time */}
                    <div className="p-2 rounded bg-background border border-border text-[11px] font-mono space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-foreground-subtle uppercase">Current Stage:</span>
                        <span className="text-emerald font-semibold">{booking.stage}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 bg-card border border-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-foreground-subtle">
                        <span>Elapsed: {formatHours(booking.elapsedMinutes)}</span>
                        <span>Est: {formatHours(booking.estimatedMinutes)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => advanceBookingStage(booking.id)}
                        disabled={booking.stage === 'Ready' || booking.status === 'COMPLETED'}
                        className="py-1 px-2 rounded bg-card-hover hover:bg-card border border-border text-[10px] font-mono text-foreground font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
                      >
                        <ArrowRight className="w-3 h-3 text-emerald" />
                        <span>Advance Stage</span>
                      </button>

                      <button
                        onClick={() => completeBooking(booking.id)}
                        disabled={booking.status === 'COMPLETED'}
                        className="py-1 px-2 rounded bg-emerald/10 hover:bg-emerald/20 text-emerald border border-emerald/30 text-[10px] font-mono font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Complete Job</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-foreground-subtle font-mono">
                    Bay Ready for Next Vehicle
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Digital Vehicle Walkaround (Pre-Inspection Liability Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Interactive SVG Car Map */}
        <div className="lg:col-span-7 p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Digital Vehicle Walkaround (Liability Pre-Inspection)
              </h3>
            </div>

            {/* Vehicle Switcher */}
            <select
              value={selectedVehicle.id}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="bg-background border border-border text-foreground text-xs font-mono rounded px-2 py-1 focus:outline-none"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.licensePlate} — {v.model}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-foreground-subtle">
            <span>Click any vehicle panel to drop a liability damage pin</span>
            <span className="text-emerald font-semibold">
              {selectedVehicle.inspectionMarkers.length} Active Liability Markers
            </span>
          </div>

          {/* SVG Vehicle Container */}
          <div className="relative w-full aspect-[16/9] bg-background/90 rounded-lg border border-border flex items-center justify-center p-4 overflow-hidden select-none">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-72 cursor-crosshair drop-shadow-md"
              onClick={handleSvgClick}
            >
              {/* Car Silhouette Top-Down */}
              {/* Wheels */}
              <rect x="22" y="15" width="5" height="14" rx="2" fill="#27272A" stroke="#3F3F46" strokeWidth="0.5" />
              <rect x="73" y="15" width="5" height="14" rx="2" fill="#27272A" stroke="#3F3F46" strokeWidth="0.5" />
              <rect x="22" y="68" width="5" height="15" rx="2" fill="#27272A" stroke="#3F3F46" strokeWidth="0.5" />
              <rect x="73" y="68" width="5" height="15" rx="2" fill="#27272A" stroke="#3F3F46" strokeWidth="0.5" />

              {/* Main Body Outline */}
              <path
                d="M32 10 
                   C32 6, 68 6, 68 10 
                   C74 13, 76 22, 75 35 
                   C77 48, 77 62, 75 75 
                   C76 86, 72 92, 68 94 
                   C62 95, 38 95, 32 94 
                   C28 92, 24 86, 25 75 
                   C23 62, 23 48, 25 35 
                   C24 22, 26 13, 32 10 Z"
                fill="#121215"
                stroke="#3F3F46"
                strokeWidth="1.2"
              />

              {/* Front Bumper & Splitter */}
              <path d="M33 11 C42 8, 58 8, 67 11" fill="none" stroke="#27272A" strokeWidth="1" />
              
              {/* Hood Lines */}
              <path d="M35 15 L36 33 L64 33 L65 15" fill="#18181C" stroke="#27272A" strokeWidth="0.75" />

              {/* Windshield */}
              <path
                d="M36 34 L38 45 L62 45 L64 34 Z"
                fill="#09090B"
                stroke="#3F3F46"
                strokeWidth="0.75"
              />

              {/* Roof */}
              <rect x="37" y="46" width="26" height="24" rx="2" fill="#18181C" stroke="#27272A" strokeWidth="0.75" />

              {/* Rear Window */}
              <path
                d="M38 71 L40 79 L60 79 L62 71 Z"
                fill="#09090B"
                stroke="#3F3F46"
                strokeWidth="0.75"
              />

              {/* Rear Deck / Spoiler */}
              <path d="M33 87 C44 91, 56 91, 67 87" fill="none" stroke="#27272A" strokeWidth="1" />

              {/* Dropped Damage Pins */}
              {selectedVehicle.inspectionMarkers.map((marker, index) => {
                const color = damageColorMap[marker.damageType] || '#EF4444';
                return (
                  <g key={marker.id} className="cursor-pointer group">
                    <circle
                      cx={marker.coordinateX}
                      cy={marker.coordinateY}
                      r="2.5"
                      fill={color}
                      stroke="#FAFAFA"
                      strokeWidth="0.5"
                      className="animate-pulse"
                    />
                    <text
                      x={marker.coordinateX}
                      y={marker.coordinateY - 3.5}
                      fontSize="3.2"
                      fill="#FAFAFA"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {index + 1}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Quick Pin Type Palette Overlay */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-card/90 border border-border px-2 py-1 rounded text-[10px] font-mono">
              <span className="text-foreground-subtle">Pin:</span>
              {(['ROCK_CHIP', 'SCRATCH', 'SWIRL_MARKS', 'DENT', 'CURB_RASH'] as DamageType[]).map(type => (
                <button
                  key={type}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedDamageType(type);
                  }}
                  className={cn(
                    'px-1.5 py-0.5 rounded border transition-all',
                    selectedDamageType === type
                      ? 'bg-card border-border-bright text-foreground font-bold'
                      : 'border-transparent text-foreground-subtle hover:text-foreground'
                  )}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: damageColorMap[type] }}
                  />
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Damage Pins List & Liability Notes */}
        <div className="lg:col-span-5 p-4 rounded-lg bg-card border border-border shadow-card space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                Liability Log: {selectedVehicle.licensePlate}
              </h4>
              <span className="text-[10px] font-mono text-foreground-subtle">
                {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.color})
              </span>
            </div>

            {/* Damage Marker List */}
            <div className="max-h-64 overflow-y-auto space-y-2 my-2 pr-1">
              {selectedVehicle.inspectionMarkers.length === 0 ? (
                <div className="py-12 text-center text-xs text-foreground-subtle font-mono">
                  No pre-existing damages recorded. Vehicle clean.
                </div>
              ) : (
                selectedVehicle.inspectionMarkers.map((marker, index) => (
                  <div
                    key={marker.id}
                    className="p-2 rounded bg-background border border-border flex items-start justify-between gap-2 text-xs font-mono"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-background shrink-0 mt-0.5"
                        style={{ backgroundColor: damageColorMap[marker.damageType] }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">
                            {marker.damageType.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-foreground-subtle">
                            • {marker.panelZone.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[10px] text-foreground-subtle truncate mt-0.5">
                          {marker.notes || 'Documented before technician handover.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeInspectionMarker(marker.id)}
                      className="text-foreground-subtle hover:text-guardsRed p-1 transition-colors shrink-0"
                      title="Clear liability pin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Custom Liability Note */}
          <div className="pt-2 border-t border-border space-y-1.5">
            <input
              type="text"
              value={markerNotes}
              onChange={e => setMarkerNotes(e.target.value)}
              placeholder="Liability note (e.g. Deep scratch near door handle)..."
              className="w-full bg-background border border-border rounded px-2.5 py-1.5 text-xs text-foreground placeholder:text-foreground-subtle font-mono focus:outline-none"
            />
            <div className="text-[10px] font-mono text-foreground-subtle">
              Type note above then click the car diagram to place pin.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Before/After Media Vault (5-Second Transformation Showcase) */}
      <div className="p-4 rounded-lg bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
              Before/After Media Vault & 1-Click IG MCP Queue
            </h3>
          </div>
          <span className="text-[10px] font-mono text-foreground-subtle">
            Detailer Transformation Showcase
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {beforeAfterMedia.map(media => (
            <div
              key={media.id}
              className="p-3 rounded bg-background border border-border space-y-2 text-xs font-mono"
            >
              {/* Media Comparison Images */}
              <div className="grid grid-cols-2 gap-1.5 rounded overflow-hidden h-28 border border-border">
                <div className="relative">
                  <img
                    src={media.beforePhotoUrl}
                    alt="Before"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                  <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/75 text-[9px] text-foreground font-bold">
                    BEFORE
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={media.afterPhotoUrl}
                    alt="After"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-emerald/90 text-[9px] text-background font-bold">
                    AFTER
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex justify-between items-start pt-1">
                <div>
                  <span className="font-bold text-foreground text-xs block font-sans">
                    {media.vehicleModel}
                  </span>
                  <span className="text-[10px] text-foreground-subtle block">
                    {media.vehiclePlate} • {media.technicianName}
                  </span>
                </div>
                <span className="text-[10px] text-foreground-subtle">{media.date}</span>
              </div>

              {/* Push to Meta MCP CTA */}
              <button
                onClick={() => pushMediaToIgQueue(media.id)}
                disabled={media.isQueuedForIG}
                className={cn(
                  'w-full py-1.5 px-2 rounded font-medium text-[11px] font-mono transition-all border flex items-center justify-center gap-1.5',
                  media.isQueuedForIG
                    ? 'bg-emerald/10 border-emerald/30 text-emerald cursor-default'
                    : 'bg-card hover:bg-card-hover border-border text-foreground'
                )}
              >
                {media.isQueuedForIG ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
                    <span>Queued to Meta MCP Reel Ads</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Push to IG MCP Ad Queue</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
