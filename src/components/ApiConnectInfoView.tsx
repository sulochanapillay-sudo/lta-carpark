import React, { useState } from 'react';
import {
  Radio,
  RefreshCw,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Zap,
  Info,
  Car,
  Bus,
  Server,
  Compass,
  Download,
} from 'lucide-react';

interface ApiConnectInfoViewProps {
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  onManualRefresh: () => void;
  onExportCSV?: () => void;
  lastRefreshTime: string;
  totalLotsInDatabase: number;
}

export const ApiConnectInfoView: React.FC<ApiConnectInfoViewProps> = ({
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onManualRefresh,
  onExportCSV,
  lastRefreshTime,
  totalLotsInDatabase,
}) => {
  const [testEndpoint, setTestEndpoint] = useState<string>('/api/health');
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);

  const runApiTest = async (endpoint: string) => {
    setTestEndpoint(endpoint);
    setTestLoading(true);
    setTestResult(null);
    setTestStatus(null);
    try {
      const res = await fetch(endpoint);
      setTestStatus(res.status);
      const json = await res.json();
      setTestResult(JSON.stringify(json, null, 2));
    } catch (err) {
      setTestStatus(500);
      setTestResult(JSON.stringify({ error: (err as Error).message }, null, 2));
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" />
          Serverless LTA DataMall Endpoints
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Backend serverless functions located in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700">/api</code> connected to Singapore LTA DataMall
        </p>
      </div>

      {/* Endpoints Inventory */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            Configured Serverless Routes
          </h3>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">
            Port 3000 /api
          </span>
        </div>

        <div className="space-y-2">
          {/* Health */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/health</code>
              </div>
              <p className="text-[11px] text-slate-500">Service health & LTA API key readiness check</p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/health')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* Carpark Availability */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/carparkavalibility</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Pulls real-time lots from LTA <code className="text-[10px]">CarParkAvailabilityv2</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/carparkavalibility')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* Bus Arrival */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/busarrival?BusStopCode=83139</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Next buses at stop (v3 API) for Singapore bus stops
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/busarrival?BusStopCode=83139')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>
        </div>
      </div>

      {/* OneMap Singapore API Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              OneMap Singapore (SLA) Endpoints
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-semibold">
            OneMap 2.0 API
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Official Singapore Land Authority (SLA) geospatial search, routing, and reverse geocoding.
        </p>

        <div className="space-y-2 pt-1">
          {/* Token / Auth */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded">POST/GET</span>
                <code className="text-xs font-bold text-slate-800">/api/onemap/token</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Token minting & 3-day caching using <code className="text-[10px]">ONEMAP_EMAIL</code> & <code className="text-[10px]">ONEMAP_PASSWORD</code>
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/onemap/token')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* OneMap Search */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/onemap/search?searchVal=raffles</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Elastic address & building search (e.g. Raffles, Orchard, postal codes)
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/onemap/search?searchVal=raffles')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* Reverse Geocode */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/onemap/revgeocode?location=1.3048,103.8318</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Reverse geocodes coordinates to street & building names
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/onemap/revgeocode?location=1.3048,103.8318')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>

          {/* Routing */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">GET</span>
                <code className="text-xs font-bold text-slate-800">/api/onemap/route?start=1.3048,103.8318&end=1.2834,103.8607&routeType=drive</code>
              </div>
              <p className="text-[11px] text-slate-500">
                Calculates driving duration and road distance between coordinates
              </p>
            </div>
            <button
              type="button"
              onClick={() => runApiTest('/api/onemap/route?start=1.3048,103.8318&end=1.2834,103.8607&routeType=drive')}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Test
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Response Viewer */}
      {testResult && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">{testEndpoint}</span>
            </div>
            {testStatus && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  testStatus >= 200 && testStatus < 300
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                HTTP {testStatus}
              </span>
            )}
          </div>
          <pre className="bg-slate-950/80 p-3 rounded-2xl font-mono text-[11px] text-slate-300 max-h-56 overflow-auto leading-relaxed">
            {testResult}
          </pre>
        </div>
      )}

      {/* Live Simulation Engine Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-sm font-bold text-slate-900">
                Frontend Live Availability Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Currently running in simulated live mode. Vehicle lot counts fluctuate realistically every 15 seconds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onExportCSV && (
              <button
                type="button"
                onClick={onExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition border border-slate-200 shrink-0 cursor-pointer shadow-2xs"
                title="Export entire dataset to CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Export CSV
              </button>
            )}
            <button
              type="button"
              onClick={onManualRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition border border-emerald-200 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-2 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Carparks Tracked</span>
            <span className="text-base font-black text-slate-800">{totalLotsInDatabase} carparks</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Last Ping</span>
            <span className="text-xs font-bold text-slate-800">{lastRefreshTime}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[10px] font-bold uppercase block">Auto-Sync</span>
            <button
              type="button"
              onClick={onToggleAutoRefresh}
              className={`text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 transition cursor-pointer ${
                autoRefreshEnabled
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {autoRefreshEnabled ? 'Active (15s)' : 'Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* OneMap SLA Credentials Info Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          Configuring OneMap Singapore (SLA) Credentials
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          The server automatically requests and caches 3-day tokens from the Singapore Land Authority OneMap authentication service (<code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold">/api/auth/post/getToken</code>).
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>
            Register a free developer account at{' '}
            <a
              href="https://www.onemap.gov.sg/apidocs/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5"
            >
              OneMap API Docs <ExternalLink className="w-3 h-3" />
            </a>.
          </li>
          <li>
            Add <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">ONEMAP_EMAIL</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">ONEMAP_PASSWORD</code> in your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">.env</code> or environment variables. The server will auto-mint and refresh tokens every 3 days.
          </li>
          <li>
            Alternatively, set <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">ONEMAP_TOKEN=&lt;your-token&gt;</code> directly.
          </li>
        </ul>
      </div>

      {/* LTA DataMall Key Info Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-600" />
          Configuring your LTA DataMall AccountKey
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          The serverless backend reads the key securely from the <code className="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded font-mono font-bold">LTA_ACCOUNT_KEY</code> environment variable or request headers. No API keys are hardcoded in source files.
        </p>
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          <li>
            Sign up for free at <a href="https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline inline-flex items-center gap-0.5">LTA DataMall <ExternalLink className="w-3 h-3" /></a>.
          </li>
          <li>
            Add <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">LTA_ACCOUNT_KEY=&lt;your-key&gt;</code> to your deployment environment or send the <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">AccountKey</code> header with requests.
          </li>
        </ul>
      </div>
    </div>
  );
};

