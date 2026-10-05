import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SectorType } from '../../types';
import { SECTORS_CONFIG } from '../../data/sectorData';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  Check,
  Compass,
  Calculator,
  UserCheck,
  Building,
  Zap,
  Train,
  Truck,
  Eye,
  LogOut,
  RefreshCw,
  Landmark,
  BadgeCheck,
  Camera,
} from 'lucide-react';

export const SectorDashboard: React.FC = () => {
  const {
    activeSector,
    setActiveSector,
    userRole,
    setUserRole,
    loggedInUser,
    logout,
    setCurrentView,
    setSelectedProjectId,
    setSelectedParcelId,
    projects,
    landParcels,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'corridors' | 'actions' | 'statutory'>('overview');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedActionItem, setSelectedActionItem] = useState<string | null>(null);

  const sector = SECTORS_CONFIG[activeSector] || SECTORS_CONFIG.highways;

  const corridorQuery = filterQuery.trim().toLowerCase();
  const corridorProjects = projects.filter(
    (p) =>
      !corridorQuery ||
      p.name.toLowerCase().includes(corridorQuery) ||
      p.state.toLowerCase().includes(corridorQuery) ||
      p.district.toLowerCase().includes(corridorQuery) ||
      p.id.toLowerCase().includes(corridorQuery)
  );

  const handleSwitchSector = (s: SectorType) => {
    setActiveSector(s);
    const roleMapping: Record<SectorType, any> = {
      highways: 'central',
      railways: 'central',
      power: 'officer',
      urban: 'state',
      revenue: 'officer',
      citizen: 'citizen',
      field_officer: 'field_officer',
    };
    setUserRole(roleMapping[s]);
    if (s === 'field_officer') {
      setCurrentView('field_upload');
    }
    showToast(`Switched view to ${SECTORS_CONFIG[s].name}`, 'info');
  };

  const handleActionExecute = (actionTitle: string) => {
    showToast(`Executed: ${actionTitle}`, 'success');
  };

  const getSectorIcon = (sec: SectorType) => {
    switch (sec) {
      case 'highways':
        return Truck;
      case 'railways':
        return Train;
      case 'power':
        return Zap;
      case 'urban':
        return Building;
      case 'revenue':
        return ShieldCheck;
      case 'citizen':
        return UserCheck;
      case 'field_officer':
        return Camera;
      default:
        return Layers;
    }
  };

  const SectorIcon = getSectorIcon(activeSector);

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Top Header Card in Clean Light Colors */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 shadow-2xs shrink-0">
              <SectorIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {sector.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {sector.department}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                {sector.name} Dashboard
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Logged in as: <strong className="text-slate-900 font-semibold">{loggedInUser || 'Authorised Officer'}</strong> • {sector.officerDesignation}
              </p>
            </div>
          </div>

          {/* Quick Sector Switcher & Log Out Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
              <span className="px-2 text-slate-500 font-medium hidden sm:inline">Switch:</span>
              {(['highways', 'railways', 'power', 'urban', 'revenue', 'citizen', 'field_officer'] as SectorType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSwitchSector(s)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeSector === s
                      ? 'bg-blue-700 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={SECTORS_CONFIG[s].name}
                >
                  {SECTORS_CONFIG[s].shortName}
                </button>
              ))}
            </div>

            <button
              onClick={logout}
              id="sector-dashboard-logout-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-colors shrink-0"
              title="Return to BhoomiSetu Homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Hero Tagline for active sector */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-600 font-medium">
            Operational Priority: <strong className="text-slate-900">{sector.heroTagline}</strong>
          </span>
          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>NIC Cadastral Sync Active</span>
            </span>
            <span>•</span>
            <button
              onClick={() => showToast('Refreshed official gazette data', 'info')}
              className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sync Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards tailored to this sector in Light Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sector.primaryMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
              {metric.trend && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  {metric.trend}
                </span>
              )}
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight block">
                {metric.value}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">{metric.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs in Light Style */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'border-blue-700 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sector Overview & Alignment</span>
        </button>
        <button
          onClick={() => setActiveTab('corridors')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'corridors'
              ? 'border-blue-700 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Corridors & Survey Plots</span>
        </button>
        <button
          onClick={() => setActiveTab('statutory')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'statutory'
              ? 'border-blue-700 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Statutory 12-Month SLA (RFCTLARR)</span>
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === 'actions'
              ? 'border-blue-700 text-blue-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Pending Official Actions</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Sector Specific Spotlight Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Sector Specific Deep Dive Card */}
            <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-blue-800 uppercase">
                    Sector Core Mandate
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Critical Workflows for {sector.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCurrentView('gis_map')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open GIS Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Content by Sector */}
              {activeSector === 'highways' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    NHAI guidelines mandate achieving a continuous, unencumbered <strong>60-meter Right-of-Way (RoW)</strong> before civil works award. The dashboard highlights fragmented bottleneck parcels requiring urgent CALA (Competent Authority Land Acquisition) resolution.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-900">National Corridor 60m RoW Clearance:</span>
                      <span className="text-blue-800 font-bold text-sm">84.2% Handed Over</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-blue-700 h-2.5 rounded-full" style={{ width: '84.2%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Package-1: 96% Clear</span>
                      <span>Package-2: 88% Clear</span>
                      <span className="text-amber-700 font-semibold">Package-3: 68% (Bottleneck)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSector === 'railways' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Indian Railways & DFCCIL require rigorous <strong>Joint Measurement Surveys (JMS)</strong> signed jointly with State Revenue Tehsildars, enforcing mandatory <strong>30-meter track safety buffers</strong> along high-speed corridors.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-xl font-bold text-slate-900 block">412 km</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Total Corridor Alignment</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-xl font-bold text-emerald-700 block">368 km</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">JMS Sign-off Completed</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-xl font-bold text-amber-700 block">44 km</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Revenue Boundary Recheck</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSector === 'power' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Transmission acquisition distinguishes between <strong>Tower Base Footings</strong> (permanently acquired land for 4-legged transmission towers) and <strong>Right-of-Way Stringing Easements</strong> with Ministry of Power diminution compensation.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>Tower Footing Plots: 420 Base Locations</span>
                      <span className="text-emerald-700">388 Sanctioned (92%)</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>Corridor Wire Stringing Easement: 140 km</span>
                      <span className="text-emerald-700">126 km Cleared (90%)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSector === 'urban' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Urban development operates on <strong>Land Pooling Schemes (50:50 reconstitution)</strong> where landowners surrender agricultural holdings and receive 50% reconstituted commercial/residential developed plots in high-density smart corridors.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-lg font-bold text-slate-900 block">1,850 Hectares</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Pooled Land Surrendered</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-lg font-bold text-emerald-700 block">925 Hectares</span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Reconstituted Plots Handed Back</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSector === 'revenue' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    State District Revenue Authorities and Land Acquisition Officers (LAO) enforce <strong>Section 19 strict 12-month lapsing limits</strong>, verify Khasra inheritance disputes, and issue legally binding digital compensation awards.
                  </p>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-900 text-sm block">12 Projects Within Statutory Safe Zone</span>
                      <span className="text-[11px] text-emerald-700 mt-0.5 block">Zero Section 19 lapsing cases recorded this quarter</span>
                    </div>
                    <BadgeCheck className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>
              )}

              {activeSector === 'citizen' && (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Citizen Self-Service Portal gives transparent access to notice publication details, full mathematical calculation of Solatium awards, and direct PFMS bank account confirmation.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Survey Plot: Sy. No. 145/2 (Shivampet)</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">Award: ₹72,25,000 (PFMS SBI Account Pre-Validated)</span>
                    </div>
                    <button
                      onClick={() => showToast('eSign session initialized', 'success')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      Aadhaar eSign
                    </button>
                  </div>
                </div>
              )}

              {/* Key Highlights list */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 uppercase block mb-2">
                  Key Sector Capabilities
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sector.keyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs text-slate-700 font-medium">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Items */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    High Priority Action Items
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                    {sector.actionItems.length} Pending
                  </span>
                </div>

                <div className="space-y-3">
                  {sector.actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                            item.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : item.urgency === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {item.detail}
                      </p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Category: {item.category}
                        </span>
                        <button
                          onClick={() => handleActionExecute(item.title)}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                        >
                          <span>Execute</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setCurrentView('projects')}
                  className="w-full py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>View Full National Project Registry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORRIDORS & SURVEY PLOTS */}
      {activeTab === 'corridors' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Active Project Corridors ({sector.name})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time alignment packages and surveyed cadastral plots
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter corridor or village..."
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3">Corridor Name</th>
                  <th className="px-4 py-3">State / District</th>
                  <th className="px-4 py-3">Length / Area</th>
                  <th className="px-4 py-3">Acquisition Stage</th>
                  <th className="px-4 py-3">RoW Clearance</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {corridorProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No corridors match "{filterQuery}".
                    </td>
                  </tr>
                )}
                {corridorProjects.map((p) => {
                  const currentStage =
                    p.lifecycle.find((s) => s.status === 'In Progress' || s.status === 'Delayed') ||
                    p.lifecycle[p.lifecycle.length - 1];
                  const clearance = p.landRequired
                    ? Math.min(100, Math.round((p.landAcquired / p.landRequired) * 100))
                    : 0;
                  return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{p.id}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {p.state} • {p.district}
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-semibold">
                      {p.landRequired.toLocaleString('en-IN')} Ac
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-bold">
                        {(currentStage?.name || p.status).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                        <div
                          className="bg-blue-700 h-2 rounded-full"
                          style={{ width: `${clearance}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {clearance}% Complete
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setCurrentView('project_details');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STATUTORY 12-MONTH SLA */}
      {activeTab === 'statutory' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-blue-800 uppercase">
              RFCTLARR Statutory Watchdog
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Section 19 (12-Month Lapsing Deadline) Monitoring
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Under Indian law, Section 19 final declaration must be declared within 12 months of Section 11 preliminary notification, or proceedings lapse entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-xs font-bold text-emerald-900 block">Safe Zone (&gt; 90 Days)</span>
              <span className="text-2xl font-bold text-emerald-700 block">8 Projects</span>
              <p className="text-[11px] text-emerald-800">
                All statutory hearings and joint surveys on schedule.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-xs font-bold text-amber-900 block">Warning Zone (30–90 Days)</span>
              <span className="text-2xl font-bold text-amber-700 block">3 Projects</span>
              <p className="text-[11px] text-amber-800">
                District LAO notified to expedite Section 19 gazette declaration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-xs font-bold text-rose-900 block">Critical Zone (&lt; 30 Days)</span>
              <span className="text-2xl font-bold text-rose-700 block">0 Projects</span>
              <p className="text-[11px] text-rose-800">
                Zero lapsing emergencies recorded across national projects.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PENDING ACTIONS */}
      {activeTab === 'actions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Administrative Clearances & Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Pending sign-offs assigned to {sector.officerDesignation}
            </p>
          </div>

          <div className="space-y-3">
            {sector.actionItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-900 border border-blue-200">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.detail}</p>
                </div>
                <button
                  onClick={() => handleActionExecute(item.title)}
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-2xs transition-colors self-start sm:self-auto shrink-0"
                >
                  Approve Order
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
