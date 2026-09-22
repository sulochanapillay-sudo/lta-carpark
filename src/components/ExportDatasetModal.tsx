import React, { useState } from 'react';
import {
  X,
  Download,
  Check,
  Calendar,
  Clock,
  FileSpreadsheet,
  Database,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { Carpark } from '../types';
import {
  exportCarparksHistoricalCSV,
  exportCarparksDailySummaryCSV,
  exportCarparksToCSV,
} from '../utils/csvExport';

interface ExportDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  carparks: Carpark[];
}

export const ExportDatasetModal: React.FC<ExportDatasetModalProps> = ({
  isOpen,
  onClose,
  carparks,
}) => {
  const [selectedMonths, setSelectedMonths] = useState<number>(6);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalDays = Math.round(selectedMonths * 30.5);
  const estimatedDetailedRows = totalDays * 4 * carparks.length;
  const estimatedDailyRows = totalDays * carparks.length;

  const handleDownloadHistoricalDetailed = () => {
    setDownloadingType('detailed');
    setTimeout(() => {
      try {
        exportCarparksHistoricalCSV(carparks, { months: selectedMonths });
        setSuccessType('detailed');
        setTimeout(() => setSuccessType(null), 3000);
      } catch (err) {
        console.error('Failed to export historical detailed CSV:', err);
      } finally {
        setDownloadingType(null);
      }
    }, 150);
  };

  const handleDownloadDailySummary = () => {
    setDownloadingType('daily');
    setTimeout(() => {
      try {
        exportCarparksDailySummaryCSV(carparks, { months: selectedMonths });
        setSuccessType('daily');
        setTimeout(() => setSuccessType(null), 3000);
      } catch (err) {
        console.error('Failed to export daily summary CSV:', err);
      } finally {
        setDownloadingType(null);
      }
    }, 150);
  };

  const handleDownloadSnapshot = () => {
    setDownloadingType('snapshot');
    setTimeout(() => {
      try {
        exportCarparksToCSV(carparks);
        setSuccessType('snapshot');
        setTimeout(() => setSuccessType(null), 3000);
      } catch (err) {
        console.error('Failed to export snapshot CSV:', err);
      } finally {
        setDownloadingType(null);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Export Carpark Dataset
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  Minimum 6 Months
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Download structured historical time-series datasets for {carparks.length} Singapore carparks in CSV
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Timeframe Scope Selector */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Select Historical Duration:
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                Minimum requirement: 6 months (185 days)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { months: 6, label: '6 Months', subtitle: '185 Days (Minimum)', badge: 'Recommended' },
                { months: 9, label: '9 Months', subtitle: '275 Days' },
                { months: 12, label: '12 Months', subtitle: '365 Full Year' },
              ].map((opt) => (
                <button
                  key={opt.months}
                  type="button"
                  onClick={() => setSelectedMonths(opt.months)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer relative ${
                    selectedMonths === opt.months
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                  }`}
                >
                  {opt.badge && (
                    <span className="absolute top-1 right-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                      {opt.badge}
                    </span>
                  )}
                  <div className="text-xs font-extrabold text-slate-900">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dataset Option 1: 6-Month Time-Series Detailed (PRIMARY) */}
          <div className="p-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 hover:border-emerald-500 transition relative">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">
                    Option 1: Complete Time-Series Dataset
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                    ~{estimatedDetailedRows.toLocaleString()} rows
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedMonths}-Month Multi-Slot Historical Dataset (CSV)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Four daily time-slots per carpark (Morning Peak 08:30, Lunch 13:00, Evening Peak 18:30, Night 22:00) across all {totalDays} days. Includes vehicle breakdowns (Cars, Motorcycles, Heavy vehicles), Occupancy %, Singapore Public Holiday tags, and parking rates.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-emerald-600" />
                    All {carparks.length} Carparks
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    4 Records / Day / Carpark
                  </span>
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    UTF-8 BOM (.csv)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadHistoricalDetailed}
                disabled={downloadingType !== null}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'detailed' ? (
                  <span>Generating CSV...</span>
                ) : successType === 'detailed' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dataset Option 2: 6-Month Daily Summary Aggregates */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Option 2: Daily Aggregated Dataset
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    ~{estimatedDailyRows.toLocaleString()} rows
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedMonths}-Month Daily Aggregated Summary (CSV)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  One row per carpark per day. Tracks daily average available lots, peak-rush minimum lots, off-peak maximum capacity, peak rush period, and day-level occupancy percentages.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-slate-400" />
                    All {carparks.length} Carparks
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    1 Daily Record / Carpark
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadDailySummary}
                disabled={downloadingType !== null}
                className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'daily' ? (
                  <span>Generating...</span>
                ) : successType === 'daily' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dataset Option 3: Current Live Snapshot */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">
                  Option 3: Current Live Snapshot (CSV)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Real-time live availability snapshot for all {carparks.length} carparks as of right now ({carparks.length} rows)
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSnapshot}
                disabled={downloadingType !== null}
                className="shrink-0 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {downloadingType === 'snapshot' ? (
                  <span>Generating...</span>
                ) : successType === 'snapshot' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Download Snapshot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Excel & Compatibility Note */}
          <div className="flex items-start gap-2 bg-blue-50/80 border border-blue-200/70 rounded-2xl p-3 text-xs text-blue-800">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">Full Spreadsheet & Analytics Compatibility:</span> Files are encoded with UTF-8 BOM, ensuring correct column alignment and special character display in Microsoft Excel, Google Sheets, Apple Numbers, and Python / Pandas / R.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Singapore Land Transport Authority (LTA) & Housing & Development Board (HDB) Carpark Data
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
