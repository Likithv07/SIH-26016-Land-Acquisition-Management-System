import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  MapPin,
  Compass,
  Layers,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ArrowRight,
  ShieldCheck,
  Building,
  Maximize2,
  TreeDeciduous,
  Droplets,
  HelpCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { LandParcel } from '../../types';

export const CitizenLandDemarcation: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    setCurrentView,
    showToast,
    addGrievance,
    refreshData,
    isRefreshing,
    lastSyncedAt,
  } = useApp();

  useEffect(() => {
    refreshData();
  }, []);

  const [activeLayer, setActiveLayer] = useState<'cadastral' | 'satellite'>('cadastral');
  const [showSurveyPillars, setShowSurveyPillars] = useState(true);
  const [showReSurveyModal, setShowReSurveyModal] = useState(false);
  const [reSurveyReason, setReSurveyReason] = useState('');

  // Fallback parcel
  const parcel: LandParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  // Boundary coordinates
  const boundaryPillars = [
    { id: 'BP-01', name: 'Pillar A (North-West)', lat: '17.44751° N', lng: '78.67892° E', type: 'Stone Marker', error: '±0.02 m' },
    { id: 'BP-02', name: 'Pillar B (North-East)', lat: '17.44812° N', lng: '78.67954° E', type: 'DGPS Peg', error: '±0.01 m' },
    { id: 'BP-03', name: 'Pillar C (South-East)', lat: '17.44784° N', lng: '78.68021° E', type: 'DGPS Peg', error: '±0.02 m' },
    { id: 'BP-04', name: 'Pillar D (South-West)', lat: '17.44720° N', lng: '78.67910° E', type: 'Stone Marker', error: '±0.03 m' },
  ];

  // Immovable assets attached to land
  const attachedAssets = [
    { name: 'Agricultural Borewell (380 ft)', count: '1 No.', valuation: '₹1,80,000', status: 'Certified by PWD Geo-Engineer' },
    { name: 'Mature Teak & Mango Trees (Certified)', count: '14 Trees', valuation: '₹1,95,000', status: 'Enumerated by Horticulture Dept' },
    { name: 'Pump House & Brick Masonry Room', count: '120 sq.ft', valuation: '₹75,000', status: 'Assessed by Roads & Buildings (R&B)' },
  ];

  const handleRequestReSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reSurveyReason.trim()) {
      showToast('Please specify the reason for boundary re-verification', 'warning');
      return;
    }
    addGrievance({
      parcelId: parcel.id,
      citizenName: parcel.landownerName,
      mobile: parcel.landownerMobile || '9876543210',
      category: 'Demarcation Issue',
      subject: `Boundary Re-Verification: Sy ${parcel.surveyNumber}`,
      description: reSurveyReason,
    });
    showToast(`Re-survey request submitted for Survey No. ${parcel.surveyNumber}`, 'success');
    setShowReSurveyModal(false);
    setReSurveyReason('');
  };

  const handleDownloadFMB = () => {
    const sketchText = `================================================================================
OFFICIAL FIELD MEASUREMENT BOOK (FMB) CADASTRAL MAP SPECIFICATION
DEPARTMENT OF SURVEY, SETTLEMENT & LAND RECORDS
================================================================================
PARCEL ID          : ${parcel.id}
SURVEY NUMBER      : ${parcel.surveyNumber}
VILLAGE / MANDAL   : ${parcel.village}, Mandal: Ghatkesar
DISTRICT / STATE   : ${parcel.district}, Telangana
ACQUISITION EXTENT : ${parcel.areaAcres} Acres
LAND CLASSIFICATION: ${parcel.landType}
BENEFICIARY        : ${parcel.landownerName}

BOUNDARY CO-ORDINATES (WGS-84 / DGPS REFERENCED)
--------------------------------------------------------------------------------
1. Northwest Pillar (BP-01) : 17.44751° N, 78.67892° E | Error: ±0.02 m
2. Northeast Pillar (BP-02) : 17.44812° N, 78.67954° E | Error: ±0.01 m
3. Southeast Pillar (BP-03) : 17.44784° N, 78.68021° E | Error: ±0.02 m
4. Southwest Pillar (BP-04) : 17.44720° N, 78.67910° E | Error: ±0.03 m

ATTACHED IMMOVABLE ASSETS
--------------------------------------------------------------------------------
1. Agricultural Borewell (380 ft) : 1 No. - Valuation ₹1,80,000 (PWD Certified)
2. Mature Teak & Mango Trees      : 14 Trees - Valuation ₹1,95,000 (Horticulture)
3. Pump House & Brick Room        : 120 sq.ft - Valuation ₹75,000 (R&B Assessed)
Total Immovable Asset Valuation   : ₹${(parcel.assetValuation || 350000).toLocaleString('en-IN')}

SURVEY CERTIFICATION:
Certified by Senior Inspector of Survey, District Land Records.
================================================================================`;

    const blob = new Blob([sketchText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FMB_Record_${parcel.surveyNumber.replace(/\//g, '_')}_${parcel.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded official FMB Boundary & Asset Record', 'success');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs uppercase font-mono text-emerald-800 font-bold tracking-wider">
              DGPS Cadastral Demarcation &amp; Field Measurement (FMB)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            My Land Parcel &amp; Demarcation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Verified survey boundary records, pegging coordinates, and attached asset inventory under Form 16-B.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs btn-hover cursor-pointer"
            title={`Last synced: ${lastSyncedAt}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={handleDownloadFMB}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Download FMB Record</span>
          </button>

          <button
            onClick={() => {
              showToast('Generating official FMB cadastral sketch PDF...', 'info');
              window.print();
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print FMB</span>
          </button>

          <button
            onClick={() => setShowReSurveyModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Request Boundary Check</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Boundary Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Cadastral Map Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Cadastral Plot Geometry (Survey #{parcel.surveyNumber})
                </h2>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveLayer('cadastral')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeLayer === 'cadastral'
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cadastral
                </button>
                <button
                  onClick={() => setActiveLayer('satellite')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    activeLayer === 'satellite'
                      ? 'bg-blue-100 text-blue-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Interactive SVG Plot Demo */}
            <div className="relative w-full h-80 rounded-xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Satellite or GIS Grid background */}
              <div
                className={`absolute inset-0 opacity-25 ${
                  activeLayer === 'satellite'
                    ? 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]'
                    : 'gis-grid-pattern'
                }`}
              />

              {/* Highway corridor alignment overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="0"
                  y1="90"
                  x2="100%"
                  y2="90"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <line
                  x1="0"
                  y1="230"
                  x2="100%"
                  y2="230"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
                <text x="16" y="80" fill="#f87171" fontSize="10" fontFamily="monospace">
                  ROW ALIGNMENT NORTH LIMIT
                </text>
                <text x="16" y="248" fill="#f87171" fontSize="10" fontFamily="monospace">
                  ROW ALIGNMENT SOUTH LIMIT
                </text>
              </svg>

              {/* Polygon Representation */}
              <svg className="w-full h-full" viewBox="0 0 500 300">
                {/* Neighboring parcel outlines */}
                <polygon
                  points="60,110 180,95 195,210 70,225"
                  fill="rgba(100, 116, 139, 0.15)"
                  stroke="rgba(148, 163, 184, 0.4)"
                  strokeWidth="1.5"
                />
                <text x="100" y="165" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  Sy 144
                </text>

                {/* Target Acquired Parcel Polygon */}
                <polygon
                  points="200,90 380,75 395,230 215,245"
                  fill="rgba(37, 99, 235, 0.35)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />

                {/* Acquired strip inside ROW */}
                <polygon
                  points="200,90 380,75 395,230 215,245"
                  fill="rgba(239, 68, 68, 0.25)"
                />

                {/* Center Label */}
                <text x="260" y="160" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="sans-serif">
                  Survey #{parcel.surveyNumber}
                </text>
                <text x="260" y="178" fill="#93c5fd" fontSize="11" fontFamily="monospace">
                  {parcel.areaAcres} Acres (Acquired)
                </text>

                {/* Pillars */}
                {showSurveyPillars && (
                  <>
                    <circle cx="200" cy="90" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="180" y="80" fill="#34d399" fontSize="10" fontWeight="bold">P1</text>

                    <circle cx="380" cy="75" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="390" y="70" fill="#34d399" fontSize="10" fontWeight="bold">P2</text>

                    <circle cx="395" cy="230" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="405" y="240" fill="#34d399" fontSize="10" fontWeight="bold">P3</text>

                    <circle cx="215" cy="245" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="195" y="260" fill="#34d399" fontSize="10" fontWeight="bold">P4</text>
                  </>
                )}
              </svg>

              {/* Map Floating Legend */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg text-[10px] text-slate-300 font-mono flex items-center gap-3 border border-slate-700">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Your Boundary
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  NHAI Right of Way
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  DGPS Pillar
                </span>
              </div>
            </div>

            {/* Boundary Pillars Coordinates Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900">
                Demarcated Boundary Pegs &amp; Geodetic Coordinates
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2 px-3">Marker ID</th>
                      <th className="py-2 px-3">Position</th>
                      <th className="py-2 px-3">Latitude / Longitude</th>
                      <th className="py-2 px-3">Marker Spec</th>
                      <th className="py-2 px-3">Tolerance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {boundaryPillars.map((bp) => (
                      <tr key={bp.id} className="interactive-row">
                        <td className="py-2 px-3 font-mono font-bold text-blue-700">{bp.id}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{bp.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{bp.lat}, {bp.lng}</td>
                        <td className="py-2 px-3 text-slate-700">{bp.type}</td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-semibold">{bp.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Four Boundaries, Holding Breakdown & Attached Assets */}
        <div className="lg:col-span-5 space-y-6">
          {/* Four Boundaries Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Statutory Four Boundaries (Chauhad)
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">North Boundary</span>
                <p className="font-semibold text-slate-800 mt-1">Village Panchayat Link Road &amp; NH-65 Buffer</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">South Boundary</span>
                <p className="font-semibold text-slate-800 mt-1">Survey #145/3 (Patlolla Narsimha Rao)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">East Boundary</span>
                <p className="font-semibold text-slate-800 mt-1">Minor Irrigation Canal (Kaleshwaram Distributary)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-500 uppercase text-[10px] block">West Boundary</span>
                <p className="font-semibold text-slate-800 mt-1">Survey #144 (G. Venkatesh &amp; Brothers)</p>
              </div>
            </div>
          </div>

          {/* Attached Assets & Trees */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Form 16-B Immovable Assets
                </h2>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700">₹4,50,000 Total</span>
            </div>

            <div className="space-y-2.5">
              {attachedAssets.map((asset, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{asset.name}</span>
                    <span className="font-bold font-mono text-emerald-700">{asset.valuation}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Quantity: {asset.count}</span>
                    <span className="text-slate-600">{asset.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('citizen_compensation')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs btn-hover flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Review Full Compensation Calculation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Re-survey Modal */}
      {showReSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Request Boundary Re-Survey</h3>
              <button
                onClick={() => setShowReSurveyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestReSurvey} className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-800">Grounds for Boundary Dispute / Check:</label>
                <textarea
                  value={reSurveyReason}
                  onChange={(e) => setReSurveyReason(e.target.value)}
                  placeholder="e.g., The canal buffer overlap shifted Pillar 2 inwards by approximately 3 meters..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:bg-white resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                A Mandal Surveyor with DGPS rovers will be assigned within 7 working days to conduct a joint re-measurement in your presence.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs btn-hover cursor-pointer"
                >
                  Submit Re-Survey Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowReSurveyModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs btn-hover cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
