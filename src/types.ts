export type VehicleType = 'C' | 'Y' | 'H'; // Car, Motorcycle, Heavy

export type AgencyType = 'HDB' | 'URA' | 'LTA' | 'Commercial';

export interface LotBreakdown {
  type: VehicleType;
  label: string;
  totalLots: number;
  availableLots: number;
}

export interface Carpark {
  id: string;
  code: string;
  name: string;
  address: string;
  area: string; // e.g. "Orchard", "Marina Bay", "Jurong East", "Tampines"
  latitude: number;
  longitude: number;
  agency: AgencyType;
  carparkType: 'Basement' | 'Multi-Storey' | 'Surface' | 'Mechanised';
  paymentSystem: 'Electronic' | 'Coupon';
  heightLimit?: number; // in meters, e.g. 2.0
  rates: {
    weekdayMinRate: string; // e.g. "$1.20 / 30 mins"
    saturdayRate: string;
    sundayRate: string;
    gracePeriodMinutes: number;
  };
  totalLots: number;
  availableLots: number;
  lotsBreakdown: LotBreakdown[];
  lastUpdated: string;
  distance?: number; // calculated in meters from current target
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationPreset {
  name: string;
  subtitle: string;
  area: string;
  coordinates: Coordinates;
}

export interface FilterOptions {
  vehicleType: VehicleType | 'ALL';
  agency: AgencyType | 'ALL';
  onlyAvailable: boolean;
  minLots: number;
  sortBy: 'distance' | 'availability' | 'cheapest';
}
