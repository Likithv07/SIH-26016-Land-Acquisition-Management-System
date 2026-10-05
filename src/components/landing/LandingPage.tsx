import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SECTORS_CONFIG } from '../../data/sectorData';
import { SectorType } from '../../types';
import {
  Compass,
  FileCheck2,
  Calculator,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  Lock,
  Building,
  Zap,
  Train,
  Truck,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Landmark,
  FileText,
  BadgeCheck,
  Camera,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveSector, loginAsSector, loginAsRole, setSelectedParcelId, showToast } = useApp();
  const [trackingId, setTrackingId] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      showToast('Please enter a Survey Number or Parcel ID', 'warning');
      return;
    }
    const sample = {
      id: trackingId.trim(),
      village: 'Village Shivampet, Nalgonda District, Telangana',
      area: '1.75 Acres (7,082 m²)',
      sector: 'National Highways Authority of India (NH-65)',
      status: 'Section 3D Gazetted (Title Vested in Govt)',
      baseRate: '₹12,00,000 / Acre',
      solatium: '₹33,75,000 (100% Solatium Awarded)',
      totalAward: '₹72,25,000',
      bankStatus: 'PFMS Pre-Validated (State Bank of India)',
    };
    setSearchResult(sample);
    showToast(`Survey Plot ${trackingId.trim()} located in registry`, 'success');
  };

  const handleEnterSector = (sectorKey: SectorType) => {
    loginAsSector(sectorKey);
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

  return (
    <div className="space-y-12 py-2 max-w-7xl mx-auto text-slate-800">
      {/* Hero Card: Clean, light, welcoming, authoritative */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
        {/* Top bar inside hero with brand and highlighted Login button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  BhoomiSetu
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  Government of India
                </span>
              </div>
              <span className="text-xs text-slate-500 block font-medium">
                National Land Acquisition & Transparency Portal
              </span>
            </div>
          </div>

          {/* Highlighted Login button in top right */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setCurrentView('login')}
              id="landing-header-login-btn"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-2 group"
            >
              <Lock className="w-3.5 h-3.5 text-blue-100" />
              <span>Sector Login</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Hero Headline & Purpose */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
            <BadgeCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Compliant with RFCTLARR Act, 2013</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transparent, Timely Land Acquisition for India’s Infrastructure
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            <strong className="text-slate-900 font-semibold">BhoomiSetu</strong> connects Project Authorities, District Administration, and Citizens on one unified digital system. It provides automated fair market valuations, tracks statutory 12-month gazette deadlines to prevent lapsing, and transfers compensation straight to landowner bank accounts.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('login')}
              id="landing-hero-login-btn"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
            >
              <span>Access Sector Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="#sectors-section"
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition-all"
            >
              Select Sector
            </a>
            <a
              href="#track-parcel-section"
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              Search Land Plot Status
            </a>
          </div>
        </div>

        {/* Key Statistics Cards in Clean Light Style */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl font-bold text-slate-900 block">7 Portals</span>
            <span className="text-xs text-slate-500 mt-1 block">Dedicated sector & field units</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl font-bold text-blue-900 block">8,420+ km</span>
            <span className="text-xs text-slate-500 mt-1 block">Corridor alignments mapped</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl font-bold text-blue-700 block">18,500+</span>
            <span className="text-xs text-slate-500 mt-1 block">Survey plots recorded</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-2xl font-bold text-emerald-700 block">₹4,820 Cr</span>
            <span className="text-xs text-slate-500 mt-1 block">Directly credited to farmers</span>
          </div>
        </div>
      </section>

      {/* How BhoomiSetu Works: 4 Simple Steps */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Standard Procedure
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            How Land Acquisition Works on BhoomiSetu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            A clear, transparent 4-stage process designed to ensure fair compensation and timely project clearances.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">1. Proposal & Notification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Infrastructure agencies submit alignment proposals. Preliminary gazette notifications are published with complete village Khasra listings.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">2. Joint Field Survey</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revenue inspectors and project engineers conduct DGPS field surveys to verify exact boundaries, crops, structures, and tree counts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">3. Fair Valuation & Solatium</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System calculates fair market value with rural distance multipliers (up to 2.0x), 100% Solatium addition, and statutory interest.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">4. Direct Bank Transfer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sanctioned compensation is deposited directly into landowners' bank accounts via Aadhaar-linked PFMS without intermediate delays.
            </p>
          </div>
        </div>
      </section>

      {/* Sector Portals Section */}
      <section id="sectors-section" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              Sector Specialization
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Sector Portals & Officer Dashboards
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select your sector to log in and access your specific data, maps, and administrative workflows:
            </p>
          </div>
          <button
            onClick={() => setCurrentView('login')}
            className="self-start sm:self-auto text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Go to Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(['highways', 'railways', 'power', 'urban', 'revenue', 'citizen'] as SectorType[]).map((secKey) => {
            const sec = SECTORS_CONFIG[secKey];
            const IconComponent = getSectorIcon(secKey);
            return (
              <div
                key={secKey}
                onClick={() => handleEnterSector(secKey)}
                className="p-5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 card-hover flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {sec.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">{sec.name}</h3>
                  <span className="text-[11px] font-semibold text-blue-700 block mt-0.5">
                    {sec.department}
                  </span>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {sec.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnterSector(secKey);
                    }}
                    id={`enter-sector-${secKey}`}
                    className="w-full py-2 px-3 rounded-lg bg-blue-50 group-hover:bg-blue-700 group-hover:text-white text-blue-900 border border-blue-200 text-xs font-semibold btn-hover flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Launch {sec.shortName} Portal</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Field Officer Portal Card */}
          <div
            onClick={() => loginAsRole('field_officer')}
            className="p-5 rounded-xl bg-gradient-to-br from-emerald-50/50 to-white border border-emerald-300 hover:border-emerald-500 card-hover flex flex-col justify-between cursor-pointer group shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  DGPS Rover FO-7842
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                Field Officer Portal
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                Department of Survey, Settlement & Land Records
              </span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Mobile Field Verification, DGPS RTK cadastral boundary pegging, geotagged photographic evidence, and spot landowner identity verification.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  loginAsRole('field_officer');
                }}
                id="enter-portal-field-officer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold btn-hover flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Launch Field Verification Suite</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public Land Parcel Tracking Bar */}
      <section id="track-parcel-section" className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs scroll-mt-20">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
            Citizen Public Search
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Search Land Plot & Compensation Status
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your Survey Number, Khasra Number, or Land Parcel ID to view gazette status and compensation award calculation.
          </p>
        </div>

        <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. TS-HYD-2026-001245 or Sy. No. 145/2"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            id="track-parcel-submit-btn"
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Search Plot</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Search Helpers */}
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="text-[11px] font-medium">Try example query:</span>
          <button
            type="button"
            onClick={() => {
              setTrackingId('TS-HYD-2026-001245');
              handleTrackSubmit({ preventDefault: () => {} } as any);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200 transition-colors font-medium"
          >
            TS-HYD-2026-001245 (Telangana Highway)
          </button>
          <button
            type="button"
            onClick={() => {
              setTrackingId('MH-PAL-2026-003810');
              handleTrackSubmit({ preventDefault: () => {} } as any);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] border border-slate-200 transition-colors font-medium"
          >
            MH-PAL-2026-003810 (Bullet Train Corridor)
          </button>
        </div>

        {/* Search Result Card */}
        {searchResult && (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase block">
                  Verified Official Record
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Plot ID: {searchResult.id} • {searchResult.village}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold self-start sm:self-auto">
                {searchResult.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Project Agency</span>
                <span className="text-slate-800 font-medium">{searchResult.sector}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Notified Area</span>
                <span className="text-slate-800 font-semibold">{searchResult.area}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">100% Solatium Award</span>
                <span className="text-emerald-700 font-bold">{searchResult.solatium}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Total Compensation</span>
                <span className="text-emerald-700 font-bold text-sm">{searchResult.totalAward}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-slate-600">
                Direct Bank Transfer: <strong className="text-slate-900">{searchResult.bankStatus}</strong>
              </span>
              <button
                onClick={() => {
                  setActiveSector('citizen');
                  setCurrentView('login');
                }}
                className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Login as Landowner to Consent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Clean Light Footer */}
      <footer className="pt-6 pb-4 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-slate-800 font-bold">BhoomiSetu Portal</span>
          <span className="block text-[11px] text-slate-500 mt-0.5">
            Ministry of Rural Development • Government of India
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('login')}
            className="text-blue-700 hover:underline font-semibold"
          >
            Sector Login
          </button>
          <button
            onClick={() => setCurrentView('scope')}
            className="hover:text-slate-800"
          >
            RFCTLARR Act Rules
          </button>
          <button
            onClick={() => setCurrentView('gis_map')}
            className="hover:text-slate-800"
          >
            Cadastral Map
          </button>
        </div>
      </footer>
    </div>
  );
};
