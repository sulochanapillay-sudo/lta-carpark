import React, { useState, useRef } from 'react';
import { MapPin, Navigation, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { POPULAR_LOCATIONS, SINGAPORE_REGIONS } from '../data/singaporeCarparks';
import { Coordinates, LocationPreset, SingaporeRegion } from '../types';

interface PopularAreasBarProps {
  currentLocationName: string;
  onSelectLocation: (location: { name: string; coordinates: Coordinates }) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
}

export const PopularAreasBar: React.FC<PopularAreasBarProps> = ({
  currentLocationName,
  onSelectLocation,
  onUseCurrentLocation,
  isLocating = false,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<SingaporeRegion | 'ALL'>('ALL');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredLocations = selectedRegion === 'ALL'
    ? POPULAR_LOCATIONS
    : POPULAR_LOCATIONS.filter((loc) => loc.region === selectedRegion);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getRegionBadge = (region?: SingaporeRegion) => {
    switch (region) {
      case 'Central':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Downtown':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'East':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'West':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'North':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'South':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id="popular-areas-bar"
      className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xs py-2 px-3 sm:px-4 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
        {/* Row 1: Region Filters Header (Arranged based on location) */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-sm">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-slate-600 uppercase tracking-wider shrink-0 mr-1">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="hidden xs:inline">Singapore</span> Regions:
            </span>

            {/* Region Filter Buttons */}
            <button
              id="region-filter-all"
              type="button"
              onClick={() => setSelectedRegion('ALL')}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition cursor-pointer shrink-0 border ${
                selectedRegion === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
              }`}
            >
              All ({POPULAR_LOCATIONS.length})
            </button>

            {SINGAPORE_REGIONS.map((reg) => {
              const count = POPULAR_LOCATIONS.filter((l) => l.region === reg.region).length;
              const isSelected = selectedRegion === reg.region;
              return (
                <button
                  key={reg.region}
                  id={`region-filter-${reg.region.toLowerCase()}`}
                  type="button"
                  onClick={() => setSelectedRegion(reg.region)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold transition cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={reg.description}
                >
                  <span>{reg.label}</span>
                  <span className={`ml-1 text-xs opacity-80 font-semibold`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick GPS Location Button */}
          {onUseCurrentLocation && (
            <button
              id="quick-gps-btn"
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0 ml-auto"
              title="Use current GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Use</span> GPS
            </button>
          )}
        </div>

        {/* Row 2: Popular Singapore Area Buttons Arranged by Location */}
        <div className="relative flex items-center group">
          {/* Scroll Left Button (visible on hover / desktop) */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-2 z-10 w-6 h-6 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Scrollable Container with Area Buttons */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full scroll-smooth"
          >
            {filteredLocations.map((loc: LocationPreset) => {
              const isCurrent = currentLocationName.toLowerCase().includes(loc.name.toLowerCase()) ||
                loc.name.toLowerCase().includes(currentLocationName.toLowerCase());

              return (
                <button
                  key={loc.name}
                  id={`area-btn-${loc.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  type="button"
                  onClick={() => onSelectLocation({ name: loc.name, coordinates: loc.coordinates })}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer shrink-0 border whitespace-nowrap ${
                    isCurrent
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-300/60'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/60 hover:text-emerald-900 shadow-2xs'
                  }`}
                  title={`${loc.name} (${loc.subtitle}) - ${loc.region || loc.area} Region`}
                >
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />

                  <span>{loc.name}</span>

                  {/* Region Badge Pill */}
                  <span
                    className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-md border ${
                      isCurrent
                        ? 'bg-white/20 text-white border-white/30'
                        : getRegionBadge(loc.region)
                    }`}
                  >
                    {loc.region || loc.area}
                  </span>

                  {isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-2 z-10 w-6 h-6 rounded-full bg-white/95 border border-slate-200 shadow-md items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
