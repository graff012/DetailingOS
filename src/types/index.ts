// DetailingOS Core TypeScript Types

export type AcquisitionChannel =
  | 'INSTAGRAM_REEL'
  | 'INSTAGRAM_DM'
  | 'META_AD'
  | 'TELEGRAM_DIRECT'
  | 'REPEAT_CLIENT'
  | 'VIP_REFERRAL'
  | 'WALK_IN';

export type CoatingType =
  | 'NONE'
  | 'CARNAUBA_WAX'
  | 'SYNTHETIC_SEALANT'
  | 'CERAMIC_1_YEAR'
  | 'CERAMIC_3_YEAR_GYEON'
  | 'CERAMIC_5_YEAR_MOHS'
  | 'PPF_XPEL_STEALTH'
  | 'PPF_XPEL_ULTIMATE_PLUS';

export type BookingStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'IR_CURING'
  | 'QUALITY_INSPECTION'
  | 'COMPLETED'
  | 'CANCELLED';

export type PackageType =
  | 'EXPRESS_DECON_WASH'
  | 'MAINTENANCE_CERAMIC_WASH'
  | 'INTERIOR_DEEP_CLEAN'
  | 'STAGE_1_PAINT_CORRECTION'
  | 'STAGE_2_CERAMIC_PACKAGE'
  | 'FULL_FRONT_PPF'
  | 'TRACK_PACK_PPF'
  | 'FULL_VEHICLE_PPF';

export type PanelZone =
  | 'FRONT_BUMPER'
  | 'HOOD'
  | 'FRONT_LEFT_FENDER'
  | 'FRONT_RIGHT_FENDER'
  | 'DRIVER_DOOR'
  | 'PASSENGER_DOOR'
  | 'REAR_LEFT_DOOR'
  | 'REAR_RIGHT_DOOR'
  | 'ROOF'
  | 'REAR_LEFT_QUARTER'
  | 'REAR_RIGHT_QUARTER'
  | 'TRUNK_LID'
  | 'REAR_BUMPER'
  | 'WHEELS_AND_CALIPERS'
  | 'WINDSHIELD';

export type DamageType =
  | 'SCRATCH'
  | 'DENT'
  | 'ROCK_CHIP'
  | 'SWIRL_MARKS'
  | 'CLEARCOAT_OXIDATION'
  | 'CURB_RASH'
  | 'WATER_SPOTS';

export type ChemicalCategory =
  | 'COATING_CERAMIC'
  | 'PPF_FILM'
  | 'POLISH_COMPOUND'
  | 'CLEANER_DEGREASER'
  | 'WASH_SHAMPOO'
  | 'ACCESSORY_PAD'
  | 'MICROFIBER';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'KILL_SWITCHED';

export type CreativeType =
  | 'REEL_WATER_BEADING'
  | 'REEL_50_50_CORRECTION'
  | 'REEL_PPF_SELF_HEALING'
  | 'POST_CAROUSEL_TRANSFORMATION'
  | 'STORY_POLL_DISCOUNT';

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  instagramHandle?: string;
  telegramUsername?: string;
  acquisitionChannel: AcquisitionChannel;
  notes?: string;
  createdAt: string;
}

export interface InspectionMarker {
  id: string;
  bookingId?: string;
  vehicleId: string;
  panelZone: PanelZone;
  damageType: DamageType;
  coordinateX: number; // 0-100% SVG coordinates
  coordinateY: number; // 0-100% SVG coordinates
  notes?: string;
  severity: 'LIGHT' | 'MODERATE' | 'SEVERE';
  photoUrl?: string;
  timestamp: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  paintCode?: string;
  coatingType: CoatingType;
  coatingAppliedAt?: string;
  nextMaintenanceDueAt: string; // ISO string
  inspectionMarkers: InspectionMarker[];
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  customerName: string;
  bayNumber: number; // 1 to 4
  packageType: PackageType;
  status: BookingStatus;
  totalPrice: number;
  laborCost: number;
  chemicalCost: number;
  billableHours: number;
  elapsedMinutes: number;
  estimatedMinutes: number;
  technicianId: string;
  technicianName: string;
  igCampaignId?: string;
  stage: 'Pre-Wash' | 'Clay & Iron Decon' | '2-Step Polish' | 'Coating Application' | 'IR Curing' | 'Final Inspection' | 'Ready';
  scheduledAt: string;
  completedAt?: string;
  inspectionDone: boolean;
}

export interface Bay {
  id: number;
  name: string;
  type: 'PPF Cleanroom' | 'Ceramic & Paint Correction' | 'Interior Deep Clean' | 'Express Wash & Decon';
  currentBooking?: Booking;
  status: 'OCCUPIED' | 'AVAILABLE' | 'MAINTENANCE';
  targetTurnaroundHours: number;
  hourlyRevenueBenchmark: number;
}

export interface ChemicalInventory {
  id: string;
  name: string;
  brand: string;
  category: ChemicalCategory;
  unit: string;
  currentStock: number;
  maxCapacity: number;
  burnRatePerJob: number;
  reorderThreshold: number;
  costPerUnit: number;
  supplier: string;
  lastRestockedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  commissionRate: number; // e.g. 0.28 = 28%
  activeBay: number | null;
  baseSalaryMonthly: number;
  totalCompletedJobs: number;
  currentMonthRevenueGenerated: number;
  phone: string;
  avatarInitials: string;
}

export interface IgCampaign {
  id: string;
  metaCampaignId: string;
  name: string;
  creativeType: CreativeType;
  creativeThumbnail: string;
  creativeVideoUrl?: string;
  radiusKm: number;
  targetInterests: string[];
  ageMin: number;
  ageMax: number;
  dailyBudget: number;
  totalSpend: number;
  leadsGenerated: number;
  costPerLead: number;
  bookingsAttributed: number;
  revenueAttributed: number;
  autoKillCplLimit: number;
  weatherTriggered: boolean;
  status: CampaignStatus;
}

export interface BeforeAfterMedia {
  id: string;
  vehiclePlate: string;
  vehicleModel: string;
  packageType: PackageType;
  technicianName: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  date: string;
  isQueuedForIG: boolean;
  igQueueStatus?: 'READY' | 'SCHEDULED' | 'PUBLISHED';
}

export interface WeatherCondition {
  day: string;
  tempC: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Thunderstorm';
  precipitationProbability: number;
  icon: string;
  isFavorableForWash: boolean;
}

export interface MCPToolCallLog {
  id: string;
  timestamp: string;
  toolName: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  arguments: Record<string, unknown>;
  response?: Record<string, unknown>;
  latencyMs: number;
}
