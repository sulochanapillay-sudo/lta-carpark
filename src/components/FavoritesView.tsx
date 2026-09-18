import React from 'react';
import { Carpark } from '../types';
import { CarparkCard } from './CarparkCard';
import { Heart, Bookmark, Compass } from 'lucide-react';

interface FavoritesViewProps {
  favoriteCarparks: Carpark[];
  onSelectCarpark: (carpark: Carpark) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenDetails: (carpark: Carpark, e: React.MouseEvent) => void;
  onExploreClick: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteCarparks,
  onSelectCarpark,
  onToggleFavorite,
  onOpenDetails,
  onExploreClick,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            Saved Parking Spots
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly monitor real-time lot availability for your regular Singapore spots
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {favoriteCarparks.length} saved
        </span>
      </div>

      {favoriteCarparks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {favoriteCarparks.map((cp) => (
            <CarparkCard
              key={cp.id}
              carpark={cp}
              isFavorite={true}
              onSelect={onSelectCarpark}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xs my-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No saved carparks yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
            Tap the heart icon on any parking lot in the map or list to bookmark it here for quick lot availability checks!
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Explore Singapore Carparks
          </button>
        </div>
      )}
    </div>
  );
};
