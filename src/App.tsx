import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Carpark,
  Coordinates,
  FilterOptions,
} from './types';
import {
  INITIAL_CARPARKS,
  SINGAPORE_DEFAULT_CENTER,
  calculateDistanceMeters,
} from './data/singaporeCarparks';
import { SearchBar } from './components/SearchBar';
import { CarparkMap } from './components/CarparkMap';
import { CarparkCard } from './components/CarparkCard';
import { CarparkDetailModal } from './components/CarparkDetailModal';
import { FilterModal } from './components/FilterModal';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { FavoritesView } from './components/FavoritesView';
import { ApiConnectInfoView } from './components/ApiConnectInfoView';
import {
  SlidersHorizontal,
  MapPin,
  Car,
  Compass,
  ArrowUpDown,
  Radio,
  ChevronUp,
} from 'lucide-react';

const STORAGE_KEY_FAVORITES = 'sg_carpark_favorites_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  // Search Target Location State
  const [targetLocation, setTargetLocation] = useState<Coordinates>(SINGAPORE_DEFAULT_CENTER);
  const [targetLocationName, setTargetLocationName] = useState<string>('Orchard Road');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Carpark Data State
  const [carparks, setCarparks] = useState<Carpark[]>(INITIAL_CARPARKS);
  const [selectedCarpark, setSelectedCarpark] = useState<Carpark | null>(null);
  const [detailModalCarpark, setDetailModalCarpark] = useState<Carpark | null>(null);

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : ['cp-01', 'cp-06']; // Pre-populate ION & MBS as samples
    } catch {
      return ['cp-01', 'cp-06'];
    }
  });

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    vehicleType: 'ALL',
    agency: 'ALL',
    onlyAvailable: false,
    minLots: 0,
    sortBy: 'distance',
  });
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Live Auto-Refresh State
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>('Just now');
  const [mapDrawerExpanded, setMapDrawerExpanded] = useState<boolean>(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favoriteIds]);

  // Calculate distance for all carparks whenever target location changes
  const carparksWithDistance = useMemo(() => {
    return carparks.map((cp) => {
      const distance = calculateDistanceMeters(
        targetLocation.lat,
        targetLocation.lng,
        cp.latitude,
        cp.longitude
      );
      return { ...cp, distance };
    });
  }, [carparks, targetLocation]);

  // Filter and sort carparks
  const filteredCarparks = useMemo(() => {
    let list = [...carparksWithDistance];

    // Filter by Agency
    if (filters.agency !== 'ALL') {
      list = list.filter((cp) => cp.agency === filters.agency);
    }

    // Filter by Vehicle Type
    if (filters.vehicleType !== 'ALL') {
      list = list.filter((cp) =>
        cp.lotsBreakdown.some((b) => b.type === filters.vehicleType && b.availableLots > 0)
      );
    }

    // Filter by Availability
    if (filters.onlyAvailable) {
      list = list.filter((cp) => cp.availableLots > 5);
    }

    // Sort
    if (filters.sortBy === 'distance') {
      list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (filters.sortBy === 'availability') {
      list.sort((a, b) => b.availableLots - a.availableLots);
    } else if (filters.sortBy === 'cheapest') {
      // HDB first, then lowest starting rate
      list.sort((a, b) => {
        if (a.agency === 'HDB' && b.agency !== 'HDB') return -1;
        if (b.agency === 'HDB' && a.agency !== 'HDB') return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [carparksWithDistance, filters]);

  // Favorite Carparks List
  const favoriteCarparks = useMemo(() => {
    return carparksWithDistance.filter((cp) => favoriteIds.includes(cp.id));
  }, [carparksWithDistance, favoriteIds]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Handle Location Selected from Search Bar
  const handleSelectLocation = useCallback(
    (loc: { name: string; coordinates: Coordinates }) => {
      setTargetLocation(loc.coordinates);
      setTargetLocationName(loc.name);
      setSelectedCarpark(null);
    },
    []
  );

  // Handle Carpark Selected from Search Bar
  const handleSelectCarpark = useCallback((cp: Carpark) => {
    setSelectedCarpark(cp);
    setTargetLocation({ lat: cp.latitude, lng: cp.longitude });
    setTargetLocationName(cp.name);
  }, []);

  // Handle GPS Current Location
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Verify coordinates are reasonably within Singapore bounding box (1.15 to 1.48 lat, 103.6 to 104.1 lng)
        const isSingapore =
          latitude >= 1.15 && latitude <= 1.48 && longitude >= 103.6 && longitude <= 104.1;

        if (isSingapore) {
          setTargetLocation({ lat: latitude, lng: longitude });
          setTargetLocationName('Current GPS Location');
        } else {
          // If outside Singapore, center on Singapore City Hall / Central
          setTargetLocation({ lat: 1.2930, lng: 103.8520 });
          setTargetLocationName('Singapore (City Hall)');
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        // Fallback gracefully to central Singapore
        setTargetLocation(SINGAPORE_DEFAULT_CENTER);
        setTargetLocationName('Orchard Road (Default)');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  // Simulate real-time lot fluctuations
  const triggerLotFluctuation = useCallback((targetId?: string) => {
    setCarparks((prev) =>
      prev.map((cp) => {
        if (targetId && cp.id !== targetId) return cp;
        // 40% chance of lot count changing slightly (-2 to +2 lots)
        if (targetId || Math.random() < 0.4) {
          const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
          const newAvail = Math.max(0, Math.min(cp.totalLots, cp.availableLots + delta));

          // Also adjust car breakdown
          const updatedBreakdown = cp.lotsBreakdown.map((b) => {
            if (b.type === 'C') {
              const carAvail = Math.max(0, Math.min(b.totalLots, b.availableLots + delta));
              return { ...b, availableLots: carAvail };
            }
            return b;
          });

          return {
            ...cp,
            availableLots: newAvail,
            lotsBreakdown: updatedBreakdown,
            lastUpdated: 'Just now',
          };
        }
        return cp;
      })
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastRefreshTime(timeStr);
  }, []);

  // Auto-refresh interval (every 15 seconds) to simulate live real-time feeds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      triggerLotFluctuation();
    }, 15000);
    return () => clearInterval(timer);
  }, [autoRefresh, triggerLotFluctuation]);

  // Open detail modal
  const handleOpenDetails = useCallback((cp: Carpark, e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailModalCarpark(cp);
  }, []);

  // Active filters count
  const activeFiltersCount =
    (filters.agency !== 'ALL' ? 1 : 0) +
    (filters.vehicleType !== 'ALL' ? 1 : 0) +
    (filters.onlyAvailable ? 1 : 0) +
    (filters.sortBy !== 'distance' ? 1 : 0);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Top App Header */}
      <header className="shrink-0 bg-white border-b border-slate-200/90 z-40 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          {/* App Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              P
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
                SG Carpark
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live
                </span>
              </h1>
            </div>
          </div>

          {/* Search Bar before Filters in the Header */}
          <div className="flex-1 max-w-xl min-w-0">
            <SearchBar
              currentLocationName={targetLocationName}
              onSelectLocation={handleSelectLocation}
              onSelectCarpark={handleSelectCarpark}
              onUseCurrentLocation={handleUseCurrentLocation}
              isLocating={isLocating}
              carparks={carparks}
              compact
              hideLocationPill
            />
          </div>

          {/* Filters Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="header-filter-btn"
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                activeFiltersCount > 0
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* TAB 1: MAP VIEW */}
        {activeTab === 'map' && (
          <div className="relative w-full h-full flex flex-col">
            {/* Active Focus Pill on Map */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-slate-200/90 text-xs font-semibold text-slate-700 pointer-events-auto">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Near {targetLocationName}</span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="flex-1 w-full h-full">
              <CarparkMap
                carparks={filteredCarparks}
                selectedCarpark={selectedCarpark}
                onSelectCarpark={(cp) => {
                  setSelectedCarpark(cp);
                  setMapDrawerExpanded(true);
                }}
                centerLocation={targetLocation}
                centerLocationName={targetLocationName}
              />
            </div>

            {/* Bottom Floating Sheet / Nearby Drawer on Map */}
            <div
              className={`absolute left-0 right-0 bottom-14 z-20 transition-all duration-300 ${
                mapDrawerExpanded ? 'max-h-[50vh]' : 'max-h-36 sm:max-h-40'
              }`}
            >
              <div className="max-w-2xl mx-auto px-3">
                <div className="bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-3xl shadow-xl border border-slate-200/90 p-3 sm:p-4 flex flex-col">
                  {/* Drawer Handle & Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => setMapDrawerExpanded(!mapDrawerExpanded)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-emerald-700 cursor-pointer"
                    >
                      <ChevronUp
                        className={`w-4 h-4 transition-transform duration-200 ${
                          mapDrawerExpanded ? 'rotate-180' : ''
                        }`}
                      />
                      <span>
                        Nearby Parking Lots ({filteredCarparks.length}) near {targetLocationName}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className="text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View All in List →
                    </button>
                  </div>

                  {/* Horizontal Scrollable Carpark Cards */}
                  <div className="flex gap-3 overflow-x-auto py-2.5 no-scrollbar snap-x">
                    {filteredCarparks.slice(0, 6).map((cp) => (
                      <div
                        key={cp.id}
                        className="w-72 sm:w-80 shrink-0 snap-start"
                      >
                        <CarparkCard
                          carpark={cp}
                          isSelected={selectedCarpark?.id === cp.id}
                          isFavorite={favoriteIds.includes(cp.id)}
                          onSelect={(c) => setSelectedCarpark(c)}
                          onToggleFavorite={handleToggleFavorite}
                          onOpenDetails={handleOpenDetails}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIST VIEW */}
        {activeTab === 'list' && (
          <div className="w-full h-full overflow-y-auto pb-24">
            <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
              {/* Quick Agency Filters */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'HDB', 'URA', 'Commercial'] as const).map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setFilters({ ...filters, agency: ag })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shrink-0 border ${
                        filters.agency === ag
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {ag === 'ALL' ? 'All Operators' : ag}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Sort:
                  </span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })
                    }
                    className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
                  >
                    <option value="distance">Nearest</option>
                    <option value="availability">Most Lots</option>
                    <option value="cheapest">Cheapest</option>
                  </select>
                </div>
              </div>

              {/* Results Stats */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Showing <strong className="text-slate-800">{filteredCarparks.length}</strong> carparks near {targetLocationName}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  Live lots refreshed {lastRefreshTime}
                </span>
              </div>

              {/* Carpark Cards List */}
              {filteredCarparks.length > 0 ? (
                <div className="space-y-3">
                  {filteredCarparks.map((cp) => (
                    <CarparkCard
                      key={cp.id}
                      carpark={cp}
                      isSelected={selectedCarpark?.id === cp.id}
                      isFavorite={favoriteIds.includes(cp.id)}
                      onSelect={(c) => {
                        setSelectedCarpark(c);
                        setActiveTab('map');
                      }}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenDetails={handleOpenDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs my-4">
                  <Car className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-800">No carparks match your filters</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Try adjusting your operator selection, vacancy requirements, or search a different area in Singapore.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        vehicleType: 'ALL',
                        agency: 'ALL',
                        onlyAvailable: false,
                        minLots: 0,
                        sortBy: 'distance',
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: FAVORITES VIEW */}
        {activeTab === 'favorites' && (
          <div className="w-full h-full overflow-y-auto">
            <FavoritesView
              favoriteCarparks={favoriteCarparks}
              onSelectCarpark={(cp) => {
                setSelectedCarpark(cp);
                setTargetLocation({ lat: cp.latitude, lng: cp.longitude });
                setTargetLocationName(cp.name);
                setActiveTab('map');
              }}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetails={handleOpenDetails}
              onExploreClick={() => setActiveTab('map')}
            />
          </div>
        )}

        {/* TAB 4: LIVE FEED & API HUB */}
        {activeTab === 'api-info' && (
          <div className="w-full h-full overflow-y-auto">
            <ApiConnectInfoView
              autoRefreshEnabled={autoRefresh}
              onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
              onManualRefresh={() => triggerLotFluctuation()}
              lastRefreshTime={lastRefreshTime}
              totalLotsInDatabase={carparks.length}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        favoritesCount={favoriteIds.length}
        totalNearbyCount={filteredCarparks.length}
      />

      {/* Carpark Detail Modal */}
      <CarparkDetailModal
        carpark={detailModalCarpark}
        onClose={() => setDetailModalCarpark(null)}
        isFavorite={detailModalCarpark ? favoriteIds.includes(detailModalCarpark.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onSimulateFluctuation={(id) => triggerLotFluctuation(id)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={() =>
          setFilters({
            vehicleType: 'ALL',
            agency: 'ALL',
            onlyAvailable: false,
            minLots: 0,
            sortBy: 'distance',
          })
        }
      />
    </div>
  );
}
