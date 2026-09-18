import React from 'react';
import { Map, ListFilter, Heart, Radio, Activity } from 'lucide-react';

export type ActiveTab = 'map' | 'list' | 'favorites' | 'api-info';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  favoritesCount: number;
  totalNearbyCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  favoritesCount,
  totalNearbyCount,
}) => {
  const tabs = [
    {
      id: 'map' as ActiveTab,
      label: 'Map View',
      icon: Map,
      badge: null,
    },
    {
      id: 'list' as ActiveTab,
      label: 'Nearby Lots',
      icon: ListFilter,
      badge: totalNearbyCount > 0 ? totalNearbyCount : null,
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'Saved',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      id: 'api-info' as ActiveTab,
      label: 'Live / API',
      icon: Radio,
      badge: 'Live',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 safe-bottom">
      <div className="max-w-md md:max-w-xl mx-auto px-3 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-600' : ''
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1 -right-2.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ring-1 ring-white ${
                      tab.id === 'api-info'
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>

              {/* Active pill dot */}
              {isActive && (
                <span className="absolute bottom-0 w-1 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
