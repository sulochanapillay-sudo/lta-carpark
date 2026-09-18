import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Navigation, X, Clock } from 'lucide-react';
import { LocationPreset, Coordinates, Carpark } from '../types';
import { POPULAR_LOCATIONS } from '../data/singaporeCarparks';

interface SearchBarProps {
  currentLocationName: string;
  onSelectLocation: (location: { name: string; coordinates: Coordinates }) => void;
  onSelectCarpark: (carpark: Carpark) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  carparks: Carpark[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentLocationName,
  onSelectLocation,
  onSelectCarpark,
  onUseCurrentLocation,
  isLocating,
  carparks,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const matchingPresets = POPULAR_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(trimmed) ||
      loc.subtitle.toLowerCase().includes(trimmed) ||
      loc.area.toLowerCase().includes(trimmed)
  );

  const matchingCarparks = trimmed.length >= 2
    ? carparks
        .filter(
          (cp) =>
            cp.name.toLowerCase().includes(trimmed) ||
            cp.address.toLowerCase().includes(trimmed) ||
            cp.code.toLowerCase().includes(trimmed) ||
            cp.area.toLowerCase().includes(trimmed)
        )
        .slice(0, 5)
    : [];

  const handleSelectPreset = (preset: LocationPreset) => {
    setQuery('');
    setIsOpen(false);
    onSelectLocation({
      name: preset.name,
      coordinates: preset.coordinates,
    });
  };

  const handleSelectCarparkItem = (cp: Carpark) => {
    setQuery('');
    setIsOpen(false);
    onSelectCarpark(cp);
  };

  return (
    <div ref={containerRef} className="relative w-full z-30">
      {/* Main Search Input Box */}
      <div className="flex items-center bg-white rounded-2xl shadow-md border border-slate-200/90 px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500">
        <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2.5" />
        <input
          id="carpark-search-input"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search location in Singapore (e.g. Orchard, MBS, Jurong)..."
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm md:text-base font-medium outline-none"
        />

        {query && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition mr-1"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* GPS Current Location button */}
        <button
          id="use-current-gps-btn"
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide shrink-0 transition ${
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

      {/* Active Target Location Pill Bar */}
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

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[380px] overflow-y-auto z-50 divide-y divide-slate-100">
          {/* Matching Carparks */}
          {matchingCarparks.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Direct Carpark Matches
              </div>
              {matchingCarparks.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => handleSelectCarparkItem(cp)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                      {cp.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{cp.address}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
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
