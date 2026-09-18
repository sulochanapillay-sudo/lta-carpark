import React from 'react';
import { Carpark } from '../types';
import { getAvailabilityStatus, formatDistance } from '../data/singaporeCarparks';
import {
  MapPin,
  Car,
  Clock,
  Heart,
  Navigation2,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface CarparkCardProps {
  carpark: Carpark;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (carpark: Carpark) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetails: (carpark: Carpark, e: React.MouseEvent) => void;
}

export const CarparkCard: React.FC<CarparkCardProps> = ({
  carpark,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  onOpenDetails,
}) => {
  const status = getAvailabilityStatus(carpark.availableLots, carpark.totalLots);

  const agencyColors: Record<string, string> = {
    HDB: 'bg-blue-50 text-blue-700 border-blue-200',
    URA: 'bg-purple-50 text-purple-700 border-purple-200',
    Commercial: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LTA: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const agencyBadgeClass = agencyColors[carpark.agency] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div
      id={`carpark-card-${carpark.id}`}
      onClick={() => onSelect(carpark)}
      className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top row: Name & Favorite */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${agencyBadgeClass}`}
            >
              {carpark.agency}
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {carpark.code}
            </span>
            {carpark.rates.sundayRate.toLowerCase().includes('free') && (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Sunday Free Parking
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition truncate">
            {carpark.name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{carpark.address}</span>
          </p>
        </div>

        {/* Favorite toggle button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(carpark.id, e)}
          className={`p-2 rounded-xl transition shrink-0 ${
            isFavorite
              ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Middle row: Live Lot Availability Box */}
      <div className={`rounded-xl p-3 mb-3 border ${status.bgClass} ${status.borderClass}`}>
        <div className="flex items-baseline justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black tracking-tight ${status.textClass}`}>
              {carpark.availableLots}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {carpark.totalLots} total lots
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${status.badgeBg}`}
          >
            {status.label}
          </span>
        </div>

        {/* Occupancy bar */}
        <div className="w-full bg-white/70 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${status.badgeBg}`}
            style={{ width: `${Math.min(100, Math.max(3, status.percent))}%` }}
          />
        </div>

        {/* Breakdown by vehicle */}
        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
          {carpark.lotsBreakdown.map((b) => (
            <span key={b.type} className="flex items-center gap-1">
              <Car className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-800">{b.availableLots}</span> {b.label}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-slate-400 font-medium">
            Updated {carpark.lastUpdated}
          </span>
        </div>
      </div>

      {/* Bottom row: Distance, Rates & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3 text-slate-600">
          {carpark.distance !== undefined && (
            <span className="flex items-center gap-1 font-semibold text-slate-800">
              <Navigation2 className="w-3.5 h-3.5 text-emerald-600" />
              {formatDistance(carpark.distance)} away
            </span>
          )}
          <span className="truncate max-w-[150px] text-slate-500 font-medium" title={carpark.rates.weekdayMinRate}>
            {carpark.rates.weekdayMinRate}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => onOpenDetails(carpark, e)}
            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg flex items-center gap-0.5 transition"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
