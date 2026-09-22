import { Carpark, LocationPreset, SingaporeRegion } from '../types';

export const SINGAPORE_DEFAULT_CENTER = {
  lat: 1.3008,
  lng: 103.8398, // Orchard / Central SG
};

export const POPULAR_LOCATIONS: LocationPreset[] = [
  // --- CENTRAL REGION ---
  {
    name: 'Orchard Road',
    subtitle: 'Shopping & Leisure Belt',
    area: 'Central',
    region: 'Central',
    coordinates: { lat: 1.3048, lng: 103.8318 },
    keywords: ['orchard', 'somerset', 'dhoby ghaut', 'ion', 'takashimaya', 'ngee ann', 'emerald hill', 'central', 'scotts'],
  },
  {
    name: 'Bugis Junction',
    subtitle: 'Victoria St & Rochor Hub',
    area: 'Central',
    region: 'Central',
    coordinates: { lat: 1.3005, lng: 103.8553 },
    keywords: ['bugis', 'victoria', 'albert centre', 'rochor', 'middle road', 'iluma', 'bugis+'],
  },
  {
    name: 'Chinatown Point',
    subtitle: 'New Bridge Road & Outram',
    area: 'Central',
    region: 'Central',
    coordinates: { lat: 1.2847, lng: 103.8443 },
    keywords: ['chinatown', 'outram', 'new bridge', 'smith street', 'kreta ayer', 'chinatown complex'],
  },

  // --- DOWNTOWN & CBD REGION ---
  {
    name: 'Marina Bay Sands',
    subtitle: 'Bayfront & Financial District',
    area: 'Downtown',
    region: 'Downtown',
    coordinates: { lat: 1.2834, lng: 103.8607 },
    keywords: ['marina bay', 'mbs', 'bayfront', 'downtown', 'suntec', 'one raffles quay', 'shenton'],
  },
  {
    name: 'Raffles Place',
    subtitle: 'Central Business District (CBD)',
    area: 'Downtown',
    region: 'Downtown',
    coordinates: { lat: 1.2839, lng: 103.8515 },
    keywords: ['raffles place', 'raffles', 'cbd', 'financial district', 'one raffles quay', 'boat quay', 'collyer'],
  },

  // --- SOUTH REGION ---
  {
    name: 'VivoCity & Harbourfront',
    subtitle: 'Harbourfront & Sentosa Gateway',
    area: 'South',
    region: 'South',
    coordinates: { lat: 1.2644, lng: 103.8222 },
    keywords: ['vivocity', 'harbourfront', 'sentosa', 'telok blangah', 'south', 'keppel'],
  },

  // --- EAST REGION ---
  {
    name: 'Tampines Hub',
    subtitle: 'Tampines Central & Our Tampines Hub',
    area: 'East',
    region: 'East',
    coordinates: { lat: 1.3532, lng: 103.9402 },
    keywords: ['tampines', 'our tampines hub', 'oth', 'tampines mall', 'tampines central', 'east'],
  },
  {
    name: 'Jewel Changi Airport',
    subtitle: 'Airport Boulevard & Terminal Hub',
    area: 'East',
    region: 'East',
    coordinates: { lat: 1.3602, lng: 103.9897 },
    keywords: ['jewel', 'changi', 'airport', 'terminal', 'airport boulevard', 'east'],
  },

  // --- WEST REGION ---
  {
    name: 'Jurong East',
    subtitle: 'Westgate & JEM Commercial Hub',
    area: 'West',
    region: 'West',
    coordinates: { lat: 1.3331, lng: 103.7436 },
    keywords: ['jurong', 'jurong east', 'jem', 'westgate', 'jurong gateway', 'imm', 'west'],
  },

  // --- NORTH & NORTH-EAST REGION ---
  {
    name: 'Ang Mo Kio Town Centre',
    subtitle: 'AMK Hub & Ave 3 Hub',
    area: 'North',
    region: 'North',
    coordinates: { lat: 1.3691, lng: 103.8496 },
    keywords: ['ang mo kio', 'amk', 'amk hub', 'ave 3', 'north-east', 'ang mo kio central', 'north'],
  },
  {
    name: 'Woodlands Square',
    subtitle: 'Causeway Point & Civic Centre',
    area: 'North',
    region: 'North',
    coordinates: { lat: 1.4361, lng: 103.7865 },
    keywords: ['woodlands', 'causeway point', 'woodlands square', 'north', 'woodlands street 31'],
  },
];

export interface RegionGroupConfig {
  region: SingaporeRegion;
  label: string;
  description: string;
  badgeClass: string;
}

export const SINGAPORE_REGIONS: RegionGroupConfig[] = [
  {
    region: 'Central',
    label: 'Central',
    description: 'Orchard, Bugis, Chinatown',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    region: 'Downtown',
    label: 'Downtown / CBD',
    description: 'Marina Bay, Raffles Place',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    region: 'East',
    label: 'East',
    description: 'Tampines, Changi Jewel',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    region: 'West',
    label: 'West',
    description: 'Jurong East, Westgate, Jem',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  {
    region: 'North',
    label: 'North / NE',
    description: 'Ang Mo Kio, Woodlands',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  {
    region: 'South',
    label: 'South',
    description: 'VivoCity, Harbourfront, Sentosa',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

export const INITIAL_CARPARKS: Carpark[] = [
  // --- ORCHARD / SOMERSET / DHOBY GHAUT ---
  {
    id: 'cp-01',
    code: 'ION01',
    name: 'ION Orchard Carpark',
    address: '2 Orchard Turn, Singapore 238801',
    area: 'Orchard',
    latitude: 1.3040,
    longitude: 103.8319,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$3.00 for 1st hr, $1.50 / 30 mins',
      saturdayRate: '$3.50 for 1st hr, $1.50 / 30 mins',
      sundayRate: '$3.50 for 1st hr, $1.50 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 500,
    availableLots: 84,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 450, availableLots: 72 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 12 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-02',
    code: 'NGE01',
    name: 'Takashimaya / Ngee Ann City',
    address: '391 Orchard Road, Singapore 238873',
    area: 'Orchard',
    latitude: 1.3025,
    longitude: 103.8344,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.60 for 1st hr, $1.30 / 30 mins',
      saturdayRate: '$4.28 for 1st 2 hrs, $1.60 / 30 mins',
      sundayRate: '$4.28 for 1st 2 hrs, $1.60 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 620,
    availableLots: 142,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 570, availableLots: 125 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 17 },
    ],
    lastUpdated: '1 min ago',
  },
  {
    id: 'cp-03',
    code: 'SOM01',
    name: '313@somerset',
    address: '313 Orchard Road, Singapore 238895',
    area: 'Orchard',
    latitude: 1.3011,
    longitude: 103.8385,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.50 for 1st hr, $1.20 / 30 mins',
      saturdayRate: '$3.20 for 1st hr, $1.50 / 30 mins',
      sundayRate: '$3.20 for 1st hr, $1.50 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 220,
    availableLots: 18,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 200, availableLots: 14 },
      { type: 'Y', label: 'Motorcycles', totalLots: 20, availableLots: 4 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-04',
    code: 'PLZ01',
    name: 'Plaza Singapura',
    address: '68 Orchard Road, Singapore 238839',
    area: 'Orchard',
    latitude: 1.3007,
    longitude: 103.8450,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.57 for 1st hr, $1.28 / 30 mins',
      saturdayRate: '$3.21 for 1st 2 hrs, $1.28 / 30 mins',
      sundayRate: '$3.21 for 1st 2 hrs, $1.28 / 30 mins',
      gracePeriodMinutes: 15,
    },
    totalLots: 700,
    availableLots: 245,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 640, availableLots: 215 },
      { type: 'Y', label: 'Motorcycles', totalLots: 60, availableLots: 30 },
    ],
    lastUpdated: '2 mins ago',
  },
  {
    id: 'cp-05',
    code: 'HDB-OR01',
    name: 'Blk 12 Emerald Hill HDB Carpark',
    address: 'Emerald Hill Road, Singapore 229294',
    area: 'Orchard',
    latitude: 1.3032,
    longitude: 103.8390,
    agency: 'HDB',
    carparkType: 'Surface',
    paymentSystem: 'Electronic',
    rates: {
      weekdayMinRate: '$1.20 / 30 mins (Central Area)',
      saturdayRate: '$1.20 / 30 mins',
      sundayRate: 'Free Parking 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 90,
    availableLots: 8,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 80, availableLots: 6 },
      { type: 'Y', label: 'Motorcycles', totalLots: 10, availableLots: 2 },
    ],
    lastUpdated: 'Just now',
  },

  // --- MARINA BAY & CBD ---
  {
    id: 'cp-06',
    code: 'MBS01',
    name: 'Marina Bay Sands Central Carpark',
    address: '10 Bayfront Avenue, Singapore 018956',
    area: 'Marina Bay',
    latitude: 1.2838,
    longitude: 103.8591,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$14.00 7am-7pm, then $1.50 / hr',
      saturdayRate: '$16.00 flat rate per entry',
      sundayRate: '$16.00 flat rate per entry',
      gracePeriodMinutes: 10,
    },
    totalLots: 1200,
    availableLots: 418,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 1100, availableLots: 380 },
      { type: 'Y', label: 'Motorcycles', totalLots: 100, availableLots: 38 },
    ],
    lastUpdated: '1 min ago',
  },
  {
    id: 'cp-07',
    code: 'SNT01',
    name: 'Suntec City Mall Carpark (Zone Red & Green)',
    address: '3 Temasek Boulevard, Singapore 038983',
    area: 'Marina Bay',
    latitude: 1.2935,
    longitude: 103.8572,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.60 for 1st hr, $0.60 / 15 mins',
      saturdayRate: '$2.80 per entry (all day)',
      sundayRate: '$2.80 per entry (all day)',
      gracePeriodMinutes: 15,
    },
    totalLots: 3100,
    availableLots: 980,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 2900, availableLots: 910 },
      { type: 'Y', label: 'Motorcycles', totalLots: 200, availableLots: 70 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-08',
    code: 'URA-MB01',
    name: 'Marina South Pier Open Carpark (URA)',
    address: '31 Marina Coastal Drive, Singapore 018988',
    area: 'Marina Bay',
    latitude: 1.2711,
    longitude: 103.8631,
    agency: 'URA',
    carparkType: 'Surface',
    paymentSystem: 'Electronic',
    rates: {
      weekdayMinRate: '$0.60 / 30 mins',
      saturdayRate: '$0.60 / 30 mins',
      sundayRate: 'Free 7am - 10:30pm',
      gracePeriodMinutes: 15,
    },
    totalLots: 150,
    availableLots: 64,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 130, availableLots: 54 },
      { type: 'Y', label: 'Motorcycles', totalLots: 20, availableLots: 10 },
    ],
    lastUpdated: '3 mins ago',
  },
  {
    id: 'cp-09',
    code: 'ORQ01',
    name: 'One Raffles Quay Carpark',
    address: '1 Raffles Quay, Singapore 048583',
    area: 'Downtown',
    latitude: 1.2818,
    longitude: 103.8521,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$3.50 / 30 mins (Peak CBD)',
      saturdayRate: '$3.21 per entry',
      sundayRate: '$3.21 per entry',
      gracePeriodMinutes: 10,
    },
    totalLots: 350,
    availableLots: 26,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 310, availableLots: 22 },
      { type: 'Y', label: 'Motorcycles', totalLots: 40, availableLots: 4 },
    ],
    lastUpdated: 'Just now',
  },

  // --- BUGIS & ROCHOR ---
  {
    id: 'cp-10',
    code: 'BGJ01',
    name: 'Bugis Junction Carpark',
    address: '200 Victoria Street, Singapore 188021',
    area: 'Bugis',
    latitude: 1.3002,
    longitude: 103.8552,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 1.9,
    rates: {
      weekdayMinRate: '$2.50 for 1st hr, $1.20 / 30 mins',
      saturdayRate: '$3.00 for 1st hr, $1.50 / 30 mins',
      sundayRate: '$3.00 for 1st hr, $1.50 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 420,
    availableLots: 45,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 380, availableLots: 38 },
      { type: 'Y', label: 'Motorcycles', totalLots: 40, availableLots: 7 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-11',
    code: 'HDB-AB01',
    name: 'Albert Centre Multi-Storey Carpark',
    address: 'Blk 270 Queen Street, Singapore 180270',
    area: 'Bugis',
    latitude: 1.3014,
    longitude: 103.8536,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$1.20 / 30 mins (Central Zone)',
      saturdayRate: '$1.20 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 480,
    availableLots: 122,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 420, availableLots: 98 },
      { type: 'Y', label: 'Motorcycles', totalLots: 60, availableLots: 24 },
    ],
    lastUpdated: '2 mins ago',
  },
  {
    id: 'cp-12',
    code: 'BGP01',
    name: 'Bugis+ (formerly Iluma)',
    address: '201 Victoria Street, Singapore 188067',
    area: 'Bugis',
    latitude: 1.3009,
    longitude: 103.8543,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.50 for 1st hr, $1.20 / 30 mins',
      saturdayRate: '$3.00 for 1st hr, $1.50 / 30 mins',
      sundayRate: '$3.00 for 1st hr, $1.50 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 300,
    availableLots: 96,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 270, availableLots: 85 },
      { type: 'Y', label: 'Motorcycles', totalLots: 30, availableLots: 11 },
    ],
    lastUpdated: 'Just now',
  },

  // --- CHINATOWN ---
  {
    id: 'cp-13',
    code: 'HDB-CN01',
    name: 'Chinatown Complex Multi-Storey Carpark',
    address: '335 Smith Street, Singapore 050335',
    area: 'Chinatown',
    latitude: 1.2824,
    longitude: 103.8432,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$1.20 / 30 mins',
      saturdayRate: '$1.20 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 380,
    availableLots: 31,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 330, availableLots: 22 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 9 },
    ],
    lastUpdated: '1 min ago',
  },
  {
    id: 'cp-14',
    code: 'CPT01',
    name: 'Chinatown Point Carpark',
    address: '133 New Bridge Road, Singapore 059413',
    area: 'Chinatown',
    latitude: 1.2848,
    longitude: 103.8444,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$2.50 for 1st hr, $1.25 / 30 mins',
      saturdayRate: '$3.00 for 1st 2 hrs, $1.50 / 30 mins',
      sundayRate: '$3.00 for 1st 2 hrs, $1.50 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 280,
    availableLots: 108,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 250, availableLots: 94 },
      { type: 'Y', label: 'Motorcycles', totalLots: 30, availableLots: 14 },
    ],
    lastUpdated: 'Just now',
  },

  // --- JURONG EAST (WEST) ---
  {
    id: 'cp-15',
    code: 'WST01',
    name: 'Westgate Shopping Mall Carpark',
    address: '3 Gateway Drive, Singapore 608532',
    area: 'West',
    latitude: 1.3341,
    longitude: 103.7431,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$1.60 for 1st hr, $0.50 / 15 mins',
      saturdayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      sundayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      gracePeriodMinutes: 15,
    },
    totalLots: 610,
    availableLots: 188,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 560, availableLots: 170 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 18 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-16',
    code: 'JEM01',
    name: 'Jem Carpark',
    address: '50 Jurong Gateway Road, Singapore 608549',
    area: 'West',
    latitude: 1.3332,
    longitude: 103.7441,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$1.70 for 1st hr, $0.50 / 15 mins',
      saturdayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      sundayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      gracePeriodMinutes: 15,
    },
    totalLots: 670,
    availableLots: 215,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 610, availableLots: 195 },
      { type: 'Y', label: 'Motorcycles', totalLots: 60, availableLots: 20 },
    ],
    lastUpdated: '2 mins ago',
  },
  {
    id: 'cp-17',
    code: 'HDB-JE01',
    name: 'Blk 134 Jurong Gateway HDB Carpark',
    address: 'Jurong Gateway Road, Singapore 600134',
    area: 'West',
    latitude: 1.3325,
    longitude: 103.7410,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.15,
    rates: {
      weekdayMinRate: '$0.60 / 30 mins',
      saturdayRate: '$0.60 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 420,
    availableLots: 78,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 370, availableLots: 66 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 12 },
    ],
    lastUpdated: '1 min ago',
  },

  // --- TAMPINES (EAST) ---
  {
    id: 'cp-18',
    code: 'OTH01',
    name: 'Our Tampines Hub Carpark',
    address: '1 Tampines Walk, Singapore 528523',
    area: 'East',
    latitude: 1.3533,
    longitude: 103.9405,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$0.024 / min ($1.44 / hr)',
      saturdayRate: '$0.024 / min ($1.44 / hr)',
      sundayRate: '$0.024 / min ($1.44 / hr)',
      gracePeriodMinutes: 10,
    },
    totalLots: 1400,
    availableLots: 560,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 1250, availableLots: 490 },
      { type: 'Y', label: 'Motorcycles', totalLots: 120, availableLots: 55 },
      { type: 'H', label: 'Heavy Vehicles', totalLots: 30, availableLots: 15 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-19',
    code: 'TPM01',
    name: 'Tampines Mall Carpark',
    address: '4 Tampines Central 5, Singapore 529510',
    area: 'East',
    latitude: 1.3524,
    longitude: 103.9438,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$1.50 for 1st hr, $0.50 / 15 mins',
      saturdayRate: '$2.40 for 1st 2 hrs, $0.60 / 15 mins',
      sundayRate: '$2.40 for 1st 2 hrs, $0.60 / 15 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 600,
    availableLots: 42,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 550, availableLots: 34 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 8 },
    ],
    lastUpdated: '1 min ago',
  },
  {
    id: 'cp-20',
    code: 'HDB-TM01',
    name: 'Blk 506 Tampines Central 1 MSCP',
    address: 'Tampines Central 1, Singapore 520506',
    area: 'East',
    latitude: 1.3551,
    longitude: 103.9442,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.15,
    rates: {
      weekdayMinRate: '$0.60 / 30 mins',
      saturdayRate: '$0.60 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 510,
    availableLots: 135,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 460, availableLots: 118 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 17 },
    ],
    lastUpdated: '2 mins ago',
  },

  // --- VIVOCITY & HARBOURFRONT (SOUTH) ---
  {
    id: 'cp-21',
    code: 'VVC01',
    name: 'VivoCity Multi-Storey Carpark',
    address: '1 HarbourFront Walk, Singapore 098585',
    area: 'South',
    latitude: 1.2642,
    longitude: 103.8224,
    agency: 'Commercial',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$1.60 for 1st hr, $0.80 / 30 mins',
      saturdayRate: '$1.80 for 1st hr, $0.90 / 30 mins',
      sundayRate: '$1.80 for 1st hr, $0.90 / 30 mins',
      gracePeriodMinutes: 15,
    },
    totalLots: 2180,
    availableLots: 640,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 2000, availableLots: 580 },
      { type: 'Y', label: 'Motorcycles', totalLots: 180, availableLots: 60 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-22',
    code: 'HBF01',
    name: 'HarbourFront Centre Carpark',
    address: '1 Maritime Square, Singapore 099253',
    area: 'South',
    latitude: 1.2655,
    longitude: 103.8198,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.0,
    rates: {
      weekdayMinRate: '$1.70 for 1st hr, $0.85 / 30 mins',
      saturdayRate: '$3.40 for 1st 2 hrs, $1.10 / 30 mins',
      sundayRate: '$3.40 for 1st 2 hrs, $1.10 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 850,
    availableLots: 310,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 780, availableLots: 280 },
      { type: 'Y', label: 'Motorcycles', totalLots: 70, availableLots: 30 },
    ],
    lastUpdated: '4 mins ago',
  },

  // --- ANG MO KIO (NORTH-EAST) ---
  {
    id: 'cp-23',
    code: 'AMK01',
    name: 'AMK Hub Carpark',
    address: '53 Ang Mo Kio Ave 3, Singapore 569933',
    area: 'North-East',
    latitude: 1.3694,
    longitude: 103.8488,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$1.40 for 1st hr, $0.70 / 30 mins',
      saturdayRate: '$1.60 for 1st hr, $0.80 / 30 mins',
      sundayRate: '$1.60 for 1st hr, $0.80 / 30 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 450,
    availableLots: 88,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 400, availableLots: 76 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 12 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-24',
    code: 'HDB-AM01',
    name: 'Blk 712 Ang Mo Kio Central MSCP',
    address: 'Ang Mo Kio Ave 6, Singapore 560712',
    area: 'North-East',
    latitude: 1.3712,
    longitude: 103.8475,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.15,
    rates: {
      weekdayMinRate: '$0.60 / 30 mins',
      saturdayRate: '$0.60 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 540,
    availableLots: 165,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 490, availableLots: 145 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 20 },
    ],
    lastUpdated: '1 min ago',
  },

  // --- WOODLANDS (NORTH) ---
  {
    id: 'cp-25',
    code: 'CWP01',
    name: 'Causeway Point Shopping Centre',
    address: '1 Woodlands Square, Singapore 738099',
    area: 'North',
    latitude: 1.4360,
    longitude: 103.7862,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$1.40 for 1st hr, $0.60 / 15 mins',
      saturdayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      sundayRate: '$2.50 for 1st 2 hrs, $0.60 / 15 mins',
      gracePeriodMinutes: 10,
    },
    totalLots: 820,
    availableLots: 290,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 750, availableLots: 260 },
      { type: 'Y', label: 'Motorcycles', totalLots: 70, availableLots: 30 },
    ],
    lastUpdated: 'Just now',
  },
  {
    id: 'cp-26',
    code: 'HDB-WL01',
    name: 'Blk 303 Woodlands Street 31 MSCP',
    address: 'Woodlands Street 31, Singapore 730303',
    area: 'North',
    latitude: 1.4328,
    longitude: 103.7745,
    agency: 'HDB',
    carparkType: 'Multi-Storey',
    paymentSystem: 'Electronic',
    heightLimit: 2.15,
    rates: {
      weekdayMinRate: '$0.60 / 30 mins',
      saturdayRate: '$0.60 / 30 mins',
      sundayRate: 'Free 7:00 AM - 10:30 PM',
      gracePeriodMinutes: 15,
    },
    totalLots: 460,
    availableLots: 194,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 410, availableLots: 172 },
      { type: 'Y', label: 'Motorcycles', totalLots: 50, availableLots: 22 },
    ],
    lastUpdated: '2 mins ago',
  },

  // --- CHANGI AIRPORT / JEWEL (EAST) ---
  {
    id: 'cp-27',
    code: 'JWL01',
    name: 'Jewel Changi Airport (General Carpark B3-B5)',
    address: '78 Airport Boulevard, Singapore 819666',
    area: 'East',
    latitude: 1.3602,
    longitude: 103.9897,
    agency: 'Commercial',
    carparkType: 'Basement',
    paymentSystem: 'Electronic',
    heightLimit: 2.1,
    rates: {
      weekdayMinRate: '$0.04 / min ($2.40 / hr)',
      saturdayRate: '$0.04 / min ($2.40 / hr)',
      sundayRate: '$0.04 / min ($2.40 / hr)',
      gracePeriodMinutes: 10,
    },
    totalLots: 2500,
    availableLots: 780,
    lotsBreakdown: [
      { type: 'C', label: 'Cars', totalLots: 2350, availableLots: 720 },
      { type: 'Y', label: 'Motorcycles', totalLots: 150, availableLots: 60 },
    ],
    lastUpdated: 'Just now',
  },
];

/**
 * Calculates distance in meters between two lat/lng coordinates (Haversine Formula)
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format distance cleanly (e.g. "350 m" or "1.4 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Determine lot availability status tier
 */
export function getAvailabilityStatus(available: number, total: number): {
  status: 'available' | 'filling' | 'full';
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  percent: number;
} {
  const percent = total > 0 ? Math.round((available / total) * 100) : 0;
  
  if (available <= 10 || percent <= 10) {
    return {
      status: 'full',
      label: available === 0 ? 'Full' : 'Almost Full',
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-200',
      badgeBg: 'bg-rose-600',
      percent,
    };
  }
  if (available <= 40 || percent <= 25) {
    return {
      status: 'filling',
      label: 'Filling Fast',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      badgeBg: 'bg-amber-500',
      percent,
    };
  }
  return {
    status: 'available',
    label: 'Available',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    badgeBg: 'bg-emerald-600',
    percent,
  };
}
