import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Clock, Car } from 'lucide-react';
import { LocationPreset, Coordinates, Carpark } from '../types';
import { POPULAR_LOCATIONS, formatDistance } from '../data/singaporeCarparks';

interface SearchBarProps {
  currentLocationName: string;
  onSelectLocation: (location: { name: string; coordinates: Coordinates }) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  carparks: Carpark[];
  compact?: boolean;
  hideLocationPill?: boolean;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentLocationName,
  onSelectLocation,
  onSelectCarpark,
  onUseCurrentLocation,
  isLocating,
  carparks,
  compact = false,
  hideLocationPill = false,
  searchQuery = '',
  onSearchQueryChange,
}) => {
  const [query, setQuery] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external searchQuery changes
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter preset locations and carparks matching query
  const trimmed = query.trim().toLowerCase();

  const matchingPresets = POPULAR_LOCATIONS.filter((loc) => {
    if (!trimmed) return true;
    return (
      loc.name.toLowerCase().includes(trimmed) ||
      loc.subtitle.toLowerCase().includes(trimmed) ||
      loc.area.toLowerCase().includes(trimmed) ||
      loc.keywords?.some((kw) => kw.includes(trimmed) || trimmed.includes(kw))
    );
  });

  // Matching carparks sorted by proximity distance
  const matchingCarparks = trimmed.length >= 1
    ? [...carparks]
        .filter(
          (cp) =>
            cp.name.toLowerCase().includes(trimmed) ||
            cp.address.toLowerCase().includes(trimmed) ||
            cp.code.toLowerCase().includes(trimmed) ||
            cp.area.toLowerCase().includes(trimmed) ||
            cp.agency.toLowerCase().includes(trimmed) ||
            cp.carparkType.toLowerCase().includes(trimmed)
        )
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 8)
    : [];

  // Top nearby carparks to current location (when query is empty)
  const nearbyCarparks = [...carparks]
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, 4);

  const handleSelectPreset = (preset: LocationPreset) => {
    setQuery('');
    setIsOpen(false);
    onSearchQueryChange?.('');
    onSelectLocation({
      name: preset.name,
      coordinates: preset.coordinates,
    });
  };

  const handleSelectCarparkItem = (cp: Carpark) => {
    setQuery('');
    setIsOpen(false);
    onSearchQueryChange?.('');
    onSelectCarpark(cp);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    onSearchQueryChange?.(val);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    onSearchQueryChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 1. Check if query specifically matches a location preset (e.g. "Orchard", "Jurong", "Tampines", "MBS")
      const matchedPreset = POPULAR_LOCATIONS.find(
        (loc) =>
          loc.name.toLowerCase().includes(trimmed) ||
          loc.area.toLowerCase() === trimmed ||
          loc.keywords?.some((kw) => kw === trimmed || kw.includes(trimmed))
      );

      if (matchedPreset) {
        handleSelectPreset(matchedPreset);
      } else if (matchingCarparks.length > 0) {
        handleSelectCarparkItem(matchingCarparks[0]);
      } else if (matchingPresets.length > 0) {
        handleSelectPreset(matchingPresets[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-30">
      {/* Main Search Input Box */}
      <div
        className={`flex items-center transition-all focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 ${
          compact
            ? 'bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-xl border border-slate-200/90 px-2.5 sm:px-3 py-1.5 shadow-2xs'
            : 'bg-white rounded-2xl shadow-md border border-slate-200/90 px-3.5 py-2.5'
        }`}
      >
        <Search className={`text-slate-400 shrink-0 ${compact ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-2.5'}`} />
        <input
          id="carpark-search-input"
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            compact
              ? `Search carpark or area near ${currentLocationName}...`
              : 'Search location or carpark in Singapore (e.g. Orchard, Jem, MBS)...'
          }
          className={`w-full bg-transparent text-slate-800 placeholder-slate-400 font-medium outline-none ${
            compact ? 'text-xs sm:text-sm' : 'text-sm md:text-base'
          }`}
        />

        {query && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition mr-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* GPS Current Location button */}
        <button
          id="use-current-gps-btn"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className={`flex items-center gap-1.5 rounded-lg sm:rounded-xl text-xs font-semibold tracking-wide shrink-0 transition ${
            compact ? 'px-2 py-1' : 'px-3 py-1.5'
          } ${
            isLocating
              ? 'bg-emerald-100 text-emerald-700 animate-pulse'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200'
          }`}
          title="Detect GPS location in Singapore"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'Near Me'}</span>
        </button>
      </div>

      {/* Active Target Location Pill Bar (hidden when in compact header mode) */}
      {!hideLocationPill && (
        <div className="flex items-center gap-2 mt-2 px-1 text-xs text-slate-600 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Location:
          </span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full shrink-0 border border-slate-200">
            {currentLocationName}
          </span>

          {/* Quick Hotspot Chips */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {POPULAR_LOCATIONS.slice(0, 5).map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectPreset(loc)}
                className="px-2.5 py-0.5 rounded-full text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-medium transition cursor-pointer"
              >
                {loc.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[380px] overflow-y-auto z-50 divide-y divide-slate-100">
          {/* Matching Carparks */}
          {matchingCarparks.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Parking Lots</span>
                <span className="text-[10px] font-normal text-slate-400">Ordered by proximity</span>
              </div>
              {matchingCarparks.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => handleSelectCarparkItem(cp)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 truncate flex items-center gap-1.5">
                      <span>{cp.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded text-slate-500 bg-slate-100 shrink-0">
                        {cp.agency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                      <span>{cp.address}</span>
                      {cp.distance !== undefined && (
                        <span className="text-emerald-700 font-medium shrink-0">
                          • {formatDistance(cp.distance)} away
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cp.availableLots > 30
                          ? 'bg-emerald-100 text-emerald-800'
                          : cp.availableLots > 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cp.availableLots} lots
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* If query is empty, show Top Nearby Carparks directly */}
          {!query && nearbyCarparks.length > 0 && (
            <div className="p-2 bg-slate-50/50">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Nearby Parking Lots</span>
                <span className="text-[10px] font-semibold text-emerald-700">Near {currentLocationName}</span>
              </div>
              {nearbyCarparks.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => handleSelectCarparkItem(cp)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white hover:shadow-2xs flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 truncate flex items-center gap-1.5">
                      <span>{cp.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded text-slate-500 bg-slate-200/70 shrink-0">
                        {cp.agency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate flex items-center gap-2 mt-0.5">
                      <span>{cp.address}</span>
                      {cp.distance !== undefined && (
                        <span className="text-emerald-700 font-medium shrink-0">
                          • {formatDistance(cp.distance)} away
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cp.availableLots > 30
                          ? 'bg-emerald-100 text-emerald-800'
                          : cp.availableLots > 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {cp.availableLots} lots
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular / Matching Locations */}
          <div className="p-2">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{query ? 'Suggested Locations' : 'Popular Singapore Areas'}</span>
              <span className="text-[10px] font-normal text-slate-400">Tap to search</span>
            </div>

            {matchingPresets.length > 0 ? (
              matchingPresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50/60 flex items-center gap-3 transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800">
                      {preset.name}
                    </div>
                    <div className="text-xs text-slate-500">{preset.subtitle}</div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {preset.area}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-center text-xs text-slate-500">
                No matching locations found. Press enter to search location or try 'Orchard', 'MBS', 'Jurong', 'Tampines'.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
