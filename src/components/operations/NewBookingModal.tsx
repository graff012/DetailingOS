import React, { useState } from 'react';
import { X, Calendar, DollarSign, Clock, ShieldCheck } from 'lucide-react';
import { useShopStore } from '../../store/shop-store';
import { PackageType } from '../../types';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, technicians, addNewBooking } = useShopStore();

  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [bayNumber, setBayNumber] = useState<number>(1);
  const [packageType, setPackageType] = useState<PackageType>('STAGE_2_CERAMIC_PACKAGE');
  const [technicianId, setTechnicianId] = useState<string>(technicians[0]?.id || '');
  const [totalPrice, setTotalPrice] = useState<number>(1250);
  const [billableHours, setBillableHours] = useState<number>(6.0);

  if (!isOpen) return null;

  const handlePackageChange = (pkg: PackageType) => {
    setPackageType(pkg);
    switch (pkg) {
      case 'EXPRESS_DECON_WASH':
        setTotalPrice(110);
        setBillableHours(1.25);
        setBayNumber(4);
        break;
      case 'MAINTENANCE_CERAMIC_WASH':
        setTotalPrice(140);
        setBillableHours(1.5);
        setBayNumber(4);
        break;
      case 'INTERIOR_DEEP_CLEAN':
        setTotalPrice(420);
        setBillableHours(3.5);
        setBayNumber(3);
        break;
      case 'STAGE_1_PAINT_CORRECTION':
        setTotalPrice(750);
        setBillableHours(4.5);
        setBayNumber(2);
        break;
      case 'STAGE_2_CERAMIC_PACKAGE':
        setTotalPrice(1250);
        setBillableHours(6.0);
        setBayNumber(2);
        break;
      case 'FULL_FRONT_PPF':
        setTotalPrice(2450);
        setBillableHours(8.5);
        setBayNumber(1);
        break;
      case 'TRACK_PACK_PPF':
        setTotalPrice(3800);
        setBillableHours(14.0);
        setBayNumber(1);
        break;
      case 'FULL_VEHICLE_PPF':
        setTotalPrice(6500);
        setBillableHours(24.0);
        setBayNumber(1);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    const tech = technicians.find(t => t.id === technicianId);

    const laborCost = Math.round(totalPrice * (tech?.commissionRate || 0.28));
    const chemicalCost = Math.round(totalPrice * 0.12);

    addNewBooking({
      vehicleId: selectedVehicleId,
      vehiclePlate: veh?.licensePlate || 'M-NEW-01',
      vehicleModel: veh ? `${veh.make} ${veh.model}` : 'Custom Vehicle',
      customerName: 'Studio Client',
      bayNumber,
      packageType,
      technicianId,
      technicianName: tech?.name || 'Assigned Tech',
      totalPrice,
      laborCost,
      chemicalCost,
      billableHours,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-card border border-border shadow-popover rounded-lg overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald" />
            <h2 className="text-sm font-semibold font-sans text-foreground">Schedule Studio Job</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-foreground-subtle hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          {/* Vehicle Selector */}
          <div>
            <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
              Client Vehicle (License Plate)
            </label>
            <select
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-border-bright font-mono"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.licensePlate} — {v.make} {v.model} ({v.color})
                </option>
              ))}
            </select>
          </div>

          {/* Package Type */}
          <div>
            <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
              Detailing / Protection Package
            </label>
            <select
              value={packageType}
              onChange={e => handlePackageChange(e.target.value as PackageType)}
              className="w-full bg-background border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:border-border-bright font-sans font-medium"
            >
              <option value="EXPRESS_DECON_WASH">Express Wash & Iron Decon ($110 • 1.25h)</option>
              <option value="MAINTENANCE_CERAMIC_WASH">Ceramic Warranty Maintenance Wash ($140 • 1.5h)</option>
              <option value="INTERIOR_DEEP_CLEAN">Interior Steam & Leather Guard ($420 • 3.5h)</option>
              <option value="STAGE_1_PAINT_CORRECTION">Stage 1 Gloss Correction ($750 • 4.5h)</option>
              <option value="STAGE_2_CERAMIC_PACKAGE">Stage 2 Ceramic Coating Gyeon ($1,250 • 6.0h)</option>
              <option value="FULL_FRONT_PPF">Full Front XPEL PPF Cleanroom ($2,450 • 8.5h)</option>
              <option value="TRACK_PACK_PPF">Track Pack PPF + Rocker Panels ($3,800 • 14.0h)</option>
              <option value="FULL_VEHICLE_PPF">Full Vehicle Stealth PPF ($6,500 • 24.0h)</option>
            </select>
          </div>

          {/* Bay Assignment & Tech Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
                Target Bay
              </label>
              <select
                value={bayNumber}
                onChange={e => setBayNumber(Number(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono focus:outline-none"
              >
                <option value={1}>Bay 1 — PPF Cleanroom</option>
                <option value={2}>Bay 2 — Ceramic & Correction</option>
                <option value={3}>Bay 3 — Interior Deep Clean</option>
                <option value={4}>Bay 4 — Express Wash & Decon</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
                Assigned Specialist
              </label>
              <select
                value={technicianId}
                onChange={e => setTechnicianId(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-sans focus:outline-none"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({Math.round(t.commissionRate * 100)}% Split)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Billable Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
                Total Price ($ USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={totalPrice}
                  onChange={e => setTotalPrice(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono tabular-nums focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-foreground-muted mb-1 uppercase">
                Estimated Bay Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={billableHours}
                onChange={e => setBillableHours(Number(e.target.value))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono tabular-nums focus:outline-none"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-border flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border border-border text-foreground-muted hover:text-foreground hover:bg-card-hover font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald hover:bg-emerald/90 text-background font-semibold font-sans transition-all shadow-sm"
            >
              Confirm & Book Bay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
