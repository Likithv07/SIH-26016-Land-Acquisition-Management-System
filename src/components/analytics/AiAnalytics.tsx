import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Clock,
  Compass,
  FileSearch,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Filter,
  BarChart3,
  RefreshCw,
  Info,
  Scale,
  Building,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const AiAnalytics: React.FC = () => {
  const { setCurrentView, setSelectedParcelId, showToast } = useApp();

  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          showToast('AI Risk scan complete: 42,850 cadastral parcels analyzed', 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const predictions = [
    {
      id: 'RISK-001',
      title: 'Statutory Gazette Expiration & Delay Risk',
      riskLevel: 'HIGH',
      category: 'Statutory Timeline',
      badgeColor: 'border-rose-200 text-rose-800 bg-rose-50',
      riskScore: 84,
      affectedProject: 'NLA-KA-2026-004 (Bengaluru Peripheral Ring Road)',
      description:
        'Bengaluru Peripheral Ring Road exhibits 84% probability of statutory delay breaching the mandatory 12-month limit under Section 25 of RFCTLARR Act 2013 due to pending hearings in Sarjapur and Varthur taluks.',
      rootCause: '14 pending landowner objections under Section 15(2) awaiting joint collector review.',
      recommendation:
        'Convene Joint Special Collector statutory conciliation hearing before April 30 to prevent notification lapse.',
      actionText: 'Open Project Dossier',
      targetProject: 'NLA-KA-2026-004',
      targetView: 'projects' as const,
    },
    {
      id: 'RISK-002',
      title: 'Circle Rate & Market Valuation Anomaly',
      riskLevel: 'MEDIUM',
      category: 'Financial Valuation',
      badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
      riskScore: 62,
      affectedProject: 'NH-65 Expressway Corridor (Bibinagar Section)',
      description:
        'Survey Parcel TS-HYD-2026-001247 exhibits a 24% valuation discrepancy compared with adjacent Sub-Registrar Office (SRO) recorded transaction rates along the national highway frontage.',
      rootCause: 'Discrepancy in agricultural vs commercial conversion classification in 2025 revenue records.',
      recommendation:
        'Trigger automated cross-verification with Telangana Registration & Stamps (IGRS) sales deeds to calibrate commercial rate multiplier.',
      actionText: 'Review Valuation Dossier',
      targetParcel: 'TS-HYD-2026-001247',
      targetView: 'compensation' as const,
    },
    {
      id: 'RISK-003',
      title: 'Public Grievance Clustering & Litigation Probability',
      riskLevel: 'MEDIUM',
      category: 'Legal Dispute',
      badgeColor: 'border-amber-200 text-amber-800 bg-amber-50',
      riskScore: 58,
      affectedProject: 'Dedicated Freight Corridor (Western Sector)',
      description:
        'NLP analysis of 18 CPGRAMS grievances in Palghar district flags a high semantic cluster around standing crop valuation and tree compensation (fruit-bearing mango groves).',
      rootCause: 'Horticulture department valuation matrix not applied in preliminary award estimates.',
      recommendation:
        'Dispatch Joint Horticulture Verification team to update standing tree awards prior to Section 23 declaration.',
      actionText: 'View Grievance Cluster',
      targetView: 'grievance' as const,
    },
    {
      id: 'RISK-004',
      title: 'Cadastral Boundary Overlap & Titling Agreement',
      riskLevel: 'LOW',
      category: 'Cadastral Boundary',
      badgeColor: 'border-emerald-200 text-emerald-800 bg-emerald-50',
      riskScore: 12,
      affectedProject: 'NH-65 Expressway (Medchal Section)',
      description:
        'AI satellite polygon cross-check detected 99.4% agreement with revenue cadastral boundary stones and drone LiDAR point cloud surveys.',
      rootCause: 'Minimal boundary variance (<0.2%) well within the statutory tolerance limit.',
      recommendation:
        'Direct award clearance authorized. Proceed to Section 3D gazette publication without resurvey requirement.',
      actionText: 'Inspect GIS Cadastral Alignment',
      targetView: 'gis_map' as const,
    },
  ];

  const filteredPredictions = predictions.filter((p) => {
    const matchesRisk = riskFilter === 'ALL' || p.riskLevel === riskFilter;
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesRisk && matchesCat;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              National Predictive Intelligence • AI Risk Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            AI Land Acquisition Risk & Anomaly Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Predictive machine learning models identifying statutory timeline breaches, valuation discrepancies, and litigation bottlenecks.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
        >
          {isScanning ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          <span>{isScanning ? `Scanning (${scanProgress}%)` : 'Re-run Predictive Scan'}</span>
        </button>
      </div>

      {/* Scanning Progress Bar when Active */}
      {isScanning && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
          <div className="flex justify-between font-semibold">
            <span>Analyzing national spatial cadastres and gazette statutory dates...</span>
            <span className="font-mono">{scanProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-700 h-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Model Reliability</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">96.8%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Trained on RFCTLARR gazettes</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Timeline Bottlenecks Averted</span>
            <Clock className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">142 Days</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Average savings per major corridor</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Active Valuation Flags</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">7 Cases</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Under Joint Collector review</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Litigation Risk Reduction</span>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">-64%</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Via automated consent eSign</p>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-700">Filter by Severity:</span>
          <div className="flex items-center gap-1">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  riskFilter === lvl
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl === 'ALL' ? 'All Risks' : `${lvl}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Statutory Timeline">Statutory Timeline</option>
            <option value="Financial Valuation">Financial Valuation</option>
            <option value="Legal Dispute">Legal Dispute</option>
            <option value="Cadastral Boundary">Cadastral Boundary</option>
          </select>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPredictions.map((p) => (
          <div
            key={p.id}
            className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[11px] text-slate-500 font-bold">{p.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-600 font-medium">{p.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${p.badgeColor}`}
                  >
                    {p.riskLevel} RISK
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                    Score: {p.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Project reference */}
              <div className="mb-3 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium">
                <span className="text-slate-500">Subject: </span>
                <span className="font-semibold text-slate-900">{p.affectedProject}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{p.description}</p>

              {/* Root Cause pill */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 mb-3 space-y-1">
                <span className="text-[10.5px] uppercase font-bold text-slate-500 tracking-wider block">
                  Root Cause Indicator:
                </span>
                <p className="text-slate-700 text-[11.5px] leading-snug">{p.rootCause}</p>
              </div>

              {/* AI Smart Recommendation Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>Statutory Officer Guidance:</span>
                </div>
                <p className="text-slate-700 text-[11.5px] leading-relaxed">{p.recommendation}</p>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Statutory compliance window open</span>
              </span>

              <button
                onClick={() => {
                  if (p.targetParcel) {
                    setSelectedParcelId(p.targetParcel);
                    setCurrentView('compensation');
                  } else if (p.targetView) {
                    setCurrentView(p.targetView);
                  } else {
                    setCurrentView('projects');
                  }
                  showToast(`Opened resolution module for ${p.title}`, 'info');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>{p.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
