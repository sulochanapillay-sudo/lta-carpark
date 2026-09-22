import React, { useState, useEffect } from 'react';
import { Carpark, Coordinates } from '../types';
import { getAvailabilityStatus, formatDistance } from '../data/singaporeCarparks';
import {
  X,
  MapPin,
  Clock,
  Car,
  DollarSign,
  AlertTriangle,
  Navigation,
  Heart,
  RefreshCw,
  CreditCard,
  Building2,
  Share2,
  Compass,
  ExternalLink,
  Milestone,
} from 'lucide-react';

interface CarparkDetailModalProps {
  carpark: Carpark | null;
  userLocation?: Coordinates;
  userLocationName?: string;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSimulateFluctuation: (id: string) => void;
}

export const CarparkDetailModal: React.FC<CarparkDetailModalProps> = ({
  carpark,
  userLocation,
  userLocationName = 'Selected Location',
  onClose,
  isFavorite,
  onToggleFavorite,
  onSimulateFluctuation,
}) => {
  if (!carpark) return null;

  const [routeData, setRouteData] = useState<{
    drivingTimeMin?: number;
    distanceMeters?: number;
    hasToken?: boolean;
    routeType?: string;
  } | null>(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState<boolean>(false);

  const status = getAvailabilityStatus(carpark.availableLots, carpark.totalLots);

  // Fetch OneMap driving route if user location is available
  useEffect(() => {
    if (!userLocation || !carpark) {
      setRouteData(null);
      return;
    }

    let isMounted = true;
    setIsRoutingLoading(true);

    const fetchRoute = async () => {
      try {
        const start = `${userLocation.lat},${userLocation.lng}`;
        const end = `${carpark.latitude},${carpark.longitude}`;
        const res = await fetch(`/api/onemap/route?start=${start}&end=${end}&routeType=drive`);
        const json = await res.json();

        if (isMounted) {
          if (json.success && json.data?.route_summary) {
            const summary = json.data.route_summary;
            setRouteData({
              drivingTimeMin: Math.max(1, Math.round((summary.total_time || 0) / 60)),
              distanceMeters: summary.total_distance,
              hasToken: true,
              routeType: 'drive',
            });
          } else {
            // Unauthenticated or route not found
            setRouteData({
              hasToken: false,
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setRouteData({ hasToken: false });
        }
      } finally {
        if (isMounted) {
          setIsRoutingLoading(false);
        }
      }
    };

    fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [userLocation?.lat, userLocation?.lng, carpark?.id]);

  const handleOpenGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${carpark.latitude},${carpark.longitude}&destination_place_id=${encodeURIComponent(carpark.name)}`;
    window.open(url, '_blank');
  };

  const handleOpenOneMap = () => {
    const url = `https://www.onemap.gov.sg/main/v2/?lat=${carpark.latitude}&lng=${carpark.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                {carpark.agency}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {carpark.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{carpark.area} Zone</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {carpark.name}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              {carpark.address}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(carpark.id)}
              className={`p-2 rounded-xl border transition ${
                isFavorite
                  ? 'border-rose-200 bg-rose-50 text-rose-500'
                  : 'border-slate-200 text-slate-400 hover:text-rose-500 bg-white'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-white border border-slate-200 transition"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Live Lots Availability Hero Box */}
          <div className={`p-4 rounded-2xl border ${status.bgClass} ${status.borderClass}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                  Live Lot Availability
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${status.textClass}`}>
                    {carpark.availableLots}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    available lots
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs ${status.badgeBg}`}>
                  {status.label}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium mt-1">
                  Updated {carpark.lastUpdated}
                </span>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="w-full bg-white/80 h-2.5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${status.badgeBg}`}
                style={{ width: `${Math.min(100, Math.max(4, status.percent))}%` }}
              />
            </div>

            {/* Vehicle Type Breakdown */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
              {carpark.lotsBreakdown.map((b) => (
                <div key={b.type} className="bg-white/80 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    {b.label}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {b.availableLots} available
                  </span>
                </div>
              ))}
            </div>

            {/* Simulator action pill */}
            <div className="mt-3 pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/50">
              <span>Frontend simulation mode</span>
              <button
                type="button"
                onClick={() => onSimulateFluctuation(carpark.id)}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Simulate Lot Fluctuation
              </button>
            </div>
          </div>

          {/* Parking Rates Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Singapore Parking Rates
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600 font-medium">Monday - Friday</span>
                <span className="font-bold text-slate-900">{carpark.rates.weekdayMinRate}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600 font-medium">Saturday</span>
                <span className="font-bold text-slate-900">{carpark.rates.saturdayRate}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-200/60">
                <span className="text-slate-600 font-medium">Sunday / Public Holiday</span>
                <span className={`font-bold ${carpark.rates.sundayRate.toLowerCase().includes('free') ? 'text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded' : 'text-slate-900'}`}>
                  {carpark.rates.sundayRate}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-600 font-medium">Grace Period</span>
                <span className="font-bold text-slate-900">{carpark.rates.gracePeriodMinutes} mins free</span>
              </div>
            </div>
          </div>

          {/* OneMap SG Real-time Route & Distance */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Route & Travel from {userLocationName}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                OneMap SG
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Direct Distance</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">
                  {routeData?.distanceMeters
                    ? formatDistance(routeData.distanceMeters)
                    : carpark.distance !== undefined
                    ? formatDistance(carpark.distance)
                    : 'Nearby'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {routeData?.distanceMeters ? 'Road distance' : 'Straight-line proximity'}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Drive Time</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {isRoutingLoading ? (
                    <span className="text-xs text-slate-400 font-normal">Calculating...</span>
                  ) : routeData?.drivingTimeMin ? (
                    `~${routeData.drivingTimeMin} mins`
                  ) : carpark.distance !== undefined ? (
                    `~${Math.max(2, Math.round((carpark.distance / 1000) * 2.5))} mins`
                  ) : (
                    'Quick drive'
                  )}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Estimated driving duration</div>
              </div>
            </div>
          </div>

          {/* Carpark Specs & Access */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Structure</div>
                <div className="font-semibold text-slate-800">{carpark.carparkType}</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Payment</div>
                <div className="font-semibold text-slate-800">{carpark.paymentSystem} (EPS)</div>
              </div>
            </div>

            {carpark.heightLimit && (
              <div className="col-span-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 flex items-center gap-2.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs">Height Clearance Limit: </span>
                  <span className="font-extrabold">{carpark.heightLimit}m</span>. Large SUVs and vans please check roof clearance.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenOneMap}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 transition active:scale-[0.98] cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            Open in OneMap SG
          </button>

          <button
            type="button"
            onClick={handleOpenGoogleMaps}
            className="w-full flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            Directions in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};
