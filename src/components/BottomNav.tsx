import React from 'react';
import { ListFilter, Heart, Radio, MessageSquare } from 'lucide-react';

export type ActiveTab = 'list' | 'favorites' | 'api-info' | 'feedback';

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
    {
      id: 'feedback' as ActiveTab,
      label: 'Comments :)',
      icon: MessageSquare,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 safe-bottom shadow-lg">
      <div className="max-w-md md:max-w-2xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`bottom-nav-${tab.id}`}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-2.5 sm:px-4 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-emerald-600' : ''
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1 -right-3 text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full ring-1 ring-white ${
                      tab.id === 'api-info'
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-xs sm:text-sm md:text-base mt-1 tracking-normal font-bold">
                {tab.label}
              </span>

              {/* Active pill dot */}
              {isActive && (
                <span className="absolute bottom-0 w-2 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
