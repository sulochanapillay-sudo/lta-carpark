import React from 'react';
import { FilterOptions, AgencyType, VehicleType } from '../types';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}) => {
  const [localFilters, setLocalFilters] = React.useState<FilterOptions>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const agencies: (AgencyType | 'ALL')[] = ['ALL', 'HDB', 'URA', 'Commercial'];
  const vehicleTypes: { type: VehicleType | 'ALL'; label: string }[] = [
    { type: 'ALL', label: 'All Vehicles' },
    { type: 'C', label: 'Cars' },
    { type: 'Y', label: 'Motorcycles' },
    { type: 'H', label: 'Heavy Vehicles' },
  ];

  const sortOptions: { id: FilterOptions['sortBy']; label: string }[] = [
    { id: 'distance', label: 'Nearest First' },
    { id: 'availability', label: 'Most Lots Available' },
    { id: 'cheapest', label: 'Standard / Cheapest' },
  ];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Filter & Sort Carparks</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter options body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Agency */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Carpark Operator / Agency
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {agencies.map((agency) => (
                <button
                  key={agency}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, agency })}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                    localFilters.agency === agency
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {agency}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {vehicleTypes.map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, vehicleType: v.type })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-between transition ${
                    localFilters.vehicleType === v.type
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{v.label}</span>
                  {localFilters.vehicleType === v.type && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Sort Results By
            </label>
            <div className="space-y-1.5">
              {sortOptions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: s.id })}
                  className={`w-full py-2.5 px-3 text-xs font-semibold rounded-xl border flex items-center justify-between transition ${
                    localFilters.sortBy === s.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{s.label}</span>
                  {localFilters.sortBy === s.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Vacancy Checkbox */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={localFilters.onlyAvailable}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, onlyAvailable: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">
                Hide full carparks (Available lots &gt; 5 only)
              </span>
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
