import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Clock, Car, Building, Compass, Loader2 } from 'lucide-react';
import { LocationPreset, Coordinates, Carpark, OneMapSearchResultItem } from '../types';
import { POPULAR_LOCATIONS, formatDistance, getAvailabilityStatus } from '../data/singaporeCarparks';

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
  const [onemapResults, setOnemapResults] = useState<OneMapSearchResultItem[]>([]);
  const [isOnemapLoading, setIsOnemapLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external searchQuery changes
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  // Query OneMap API when user types in search bar with debounce
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setOnemapResults([]);
      setIsOnemapLoading(false);
      return;
    }

    setIsOnemapLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/onemap/search?searchVal=${encodeURIComponent(trimmedQuery)}&pageNum=1`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results)) {
            setOnemapResults(data.results.slice(0, 5));
          } else {
            setOnemapResults([]);
          }
        }
      } catch (err) {
        console.warn('OneMap search error:', err);
      } finally {
        setIsOnemapLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

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
  // Lot availability option in dropdown: 'ALL' (both Available & Filling Fast), 'AVAILABLE', or 'FILLING'
  const [lotAvailabilityOption, setLotAvailabilityOption] = useState<'ALL' | 'AVAILABLE' | 'FILLING'>('ALL');

  const trimmed = query.trim().toLowerCase();

  // Exclude Full lots completely (user mandate: Do not show Full lots)
  const nonFullCarparks = carparks.filter((cp) => {
    const status = getAvailabilityStatus(cp.availableLots, cp.totalLots).status;
    return status !== 'full';
  });

  const availableCount = nonFullCarparks.filter(
    (cp) => getAvailabilityStatus(cp.availableLots, cp.totalLots).status === 'available'
  ).length;

  const fillingFastCount = nonFullCarparks.filter(
    (cp) => getAvailabilityStatus(cp.availableLots, cp.totalLots).status === 'filling'
  ).length;

  // Filter based on user's selected availability option (Available vs Filling Fast)
  const filteredByStatusCarparks = nonFullCarparks.filter((cp) => {
    const status = getAvailabilityStatus(cp.availableLots, cp.totalLots).status;
    if (lotAvailabilityOption === 'AVAILABLE') return status === 'available';
    if (lotAvailabilityOption === 'FILLING') return status === 'filling';
    return true; // 'ALL' shows both Available and Filling Fast
  });

  // Matching carparks sorted by proximity distance (no full lots)
  const matchingCarparks = trimmed.length >= 1
    ? [...filteredByStatusCarparks]
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
        .slice(0, 10)
    : [];

  // Top nearby carparks to current location (no full lots)
  const nearbyCarparks = [...filteredByStatusCarparks]
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, 6);

  const matchingPresets = trimmed
    ? POPULAR_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(trimmed) ||
          loc.subtitle.toLowerCase().includes(trimmed) ||
          loc.area.toLowerCase().includes(trimmed) ||
          loc.keywords?.some((kw) => kw.includes(trimmed) || trimmed.includes(kw))
      )
    : [];

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

  const handleSelectOneMapItem = (item: OneMapSearchResultItem) => {
    const lat = parseFloat(item.LATITUDE);
    const lng = parseFloat(item.LONGITUDE);
    const displayName =
      item.BUILDING && item.BUILDING !== 'NIL'
        ? item.BUILDING
        : item.ROAD_NAME && item.ROAD_NAME !== 'NIL'
        ? `${item.BLK_NO ? item.BLK_NO + ' ' : ''}${item.ROAD_NAME}`
        : item.SEARCHVAL;

    setQuery('');
    setIsOpen(false);
    onSearchQueryChange?.('');

    if (!isNaN(lat) && !isNaN(lng)) {
      onSelectLocation({
        name: displayName,
        coordinates: { lat, lng },
      });
    }
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
    setOnemapResults([]);
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
      } else if (onemapResults.length > 0) {
        handleSelectOneMapItem(onemapResults[0]);
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

          {/* Quick Hotspot Chips Arranged by Location */}
          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectPreset(loc)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 text-xs font-medium transition cursor-pointer"
              >
                <span>{loc.name.split(' ')[0]}</span>
                <span className="text-[9px] text-slate-400 font-normal">({loc.region || loc.area})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[420px] overflow-y-auto z-50 divide-y divide-slate-100">
          {/* Availability Options Header Toolbar (Available & Filling Fast filter, No Full Lots) */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-0.5 hidden xs:inline">
                Filter Lots:
              </span>
              <button
                type="button"
                onClick={() => setLotAvailabilityOption('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  lotAvailabilityOption === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Lots ({availableCount + fillingFastCount})
              </button>
              <button
                type="button"
                onClick={() => setLotAvailabilityOption('AVAILABLE')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  lotAvailabilityOption === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available ({availableCount})
              </button>
              <button
                type="button"
                onClick={() => setLotAvailabilityOption('FILLING')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                  lotAvailabilityOption === 'FILLING'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Filling Fast ({fillingFastCount})
              </button>
            </div>

            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Full lots hidden
            </span>
          </div>

          {/* OneMap SG Live Addresses (when user typed 2+ chars) */}
          {query.trim().length >= 2 && (onemapResults.length > 0 || isOnemapLoading) && (
            <div className="p-2 bg-emerald-50/20">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-600" />
                  OneMap Singapore Addresses
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                  {isOnemapLoading ? 'Searching OneMap...' : `${onemapResults.length} found`}
                </span>
              </div>

              {isOnemapLoading && onemapResults.length === 0 ? (
                <div className="flex items-center justify-center py-3 text-xs text-slate-500 gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Looking up addresses on OneMap SG...</span>
                </div>
              ) : (
                onemapResults.map((item, idx) => {
                  const mainName =
                    item.BUILDING && item.BUILDING !== 'NIL'
                      ? item.BUILDING
                      : item.ROAD_NAME && item.ROAD_NAME !== 'NIL'
                      ? `${item.BLK_NO ? item.BLK_NO + ' ' : ''}${item.ROAD_NAME}`
                      : item.SEARCHVAL;

                  return (
                    <button
                      key={`${item.SEARCHVAL}-${item.POSTAL}-${idx}`}
                      type="button"
                      onClick={() => handleSelectOneMapItem(item)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white hover:shadow-2xs flex items-center justify-between transition cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center shrink-0 transition">
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-800 truncate">
                            {mainName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.ADDRESS}
                          </div>
                        </div>
                      </div>

                      {item.POSTAL && item.POSTAL !== 'NIL' && (
                        <div className="shrink-0 pl-1">
                          <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            S({item.POSTAL})
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Matching Parking Lots (No Full Lots) */}
          {query.trim().length >= 1 && matchingCarparks.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Matching Parking Lots</span>
                <span className="text-[10px] font-normal text-slate-400">
                  {lotAvailabilityOption === 'AVAILABLE'
                    ? 'Available only'
                    : lotAvailabilityOption === 'FILLING'
                    ? 'Filling Fast only'
                    : 'Available & Filling Fast'}
                </span>
              </div>
              {matchingCarparks.map((cp) => {
                const statusInfo = getAvailabilityStatus(cp.availableLots, cp.totalLots);
                return (
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          statusInfo.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            statusInfo.status === 'available' ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                        />
                        <span>{cp.availableLots} lots</span>
                        <span className="opacity-75 text-[10px]">({statusInfo.label})</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* When query is typed but no non-full lots match current filter */}
          {query.trim().length >= 1 && matchingCarparks.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              <p>
                No parking lots matching "{query}" with{' '}
                {lotAvailabilityOption === 'AVAILABLE'
                  ? 'Available'
                  : lotAvailabilityOption === 'FILLING'
                  ? 'Filling Fast'
                  : 'Available/Filling Fast'}{' '}
                status.
              </p>
              {lotAvailabilityOption !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setLotAvailabilityOption('ALL')}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Show all Available & Filling Fast lots
                </button>
              )}
            </div>
          )}

          {/* If query is empty, show Top Nearby Carparks directly (No Full Lots) */}
          {!query && nearbyCarparks.length > 0 && (
            <div className="p-2 bg-slate-50/50">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Nearby Parking Lots</span>
                <span className="text-[10px] font-semibold text-emerald-700">Near {currentLocationName}</span>
              </div>
              {nearbyCarparks.map((cp) => {
                const statusInfo = getAvailabilityStatus(cp.availableLots, cp.totalLots);
                return (
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
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          statusInfo.status === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            statusInfo.status === 'available' ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                        />
                        <span>{cp.availableLots} lots</span>
                        <span className="opacity-75 text-[10px]">({statusInfo.label})</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* When query is empty and no nearby lots match the selected filter */}
          {!query && nearbyCarparks.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              <p>
                No parking lots nearby with{' '}
                {lotAvailabilityOption === 'AVAILABLE' ? 'Available' : 'Filling Fast'} status.
              </p>
              {lotAvailabilityOption !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setLotAvailabilityOption('ALL')}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Show all Available & Filling Fast lots
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
