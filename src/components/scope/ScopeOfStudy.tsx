import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Landmark,
  Building2,
  Briefcase,
  Camera,
  UserCheck,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const ScopeOfStudy: React.FC = () => {
  const { setCurrentView, setUserRole } = useApp();

  const stakeholders = [
    {
      title: 'Central Government Authorities',
      icon: Landmark,
      color: 'text-blue-700 border-blue-200 bg-blue-50',
      role: 'central',
      summary:
        'National apex oversight across 28 States and 8 UTs. Live pipeline aggregation with PRAGATI and Gati Shakti platforms, statutory 12-month lapsing alerts, and automated inter-ministerial coordination.',
      deliverables: [
        'National Land Acquisition Command Dashboard with multi-state KPI aggregation',
        'State-wise comparative performance matrix and interactive SVG GIS maps',
        'PFMS Direct Benefit Transfer treasury monitoring and statutory Solatium audit',
        'Predictive AI timeline and risk analysis for national corridors',
      ],
    },
    {
      title: 'State Government Authorities',
      icon: Building2,
      color: 'text-purple-700 border-purple-200 bg-purple-50',
      role: 'state',
      summary:
        'Revenue department command overseeing District Collectors, Divisional Commissioners, and state-level land consolidation policies under State Land Acquisition Rules.',
      deliverables: [
        'District-wise progress tables with real-time acquisition and award rates',
        'State project portfolio tracking across State Highways, SEZs, and irrigation dams',
        'Revenue Record-of-Rights (ROR-1B) and Pahani synchronization with NIC land registries',
        'Collector-level milestone escalation and objection review oversight',
      ],
    },
    {
      title: 'District Authorities & Land Acquisition Officers (LAO)',
      icon: Briefcase,
      color: 'text-cyan-800 border-cyan-200 bg-cyan-50',
      role: 'officer',
      summary:
        'Statutory execution authority responsible for RFCTLARR valuation formulas, Section 15 objection hearings, award determinations, Solatium approvals, and physical possession certificates.',
      deliverables: [
        'Automated RFCTLARR Section 26-30 statutory compensation calculator',
        'NIC Class-3 Digital Signature Certificate (DSC) digital award sealing',
        'Objection management and revision notes tracking with Revenue committees',
        'Physical land possession checklist and Section 3D gazette publication workflows',
      ],
    },
    {
      title: 'Field Verification Officers',
      icon: Camera,
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
      role: 'field_officer',
      summary:
        'Mobile survey units executing on-ground joint measurements, high-precision NavIC/GPS coordinate captures, crop/structure asset counts, and geo-tagged photographic evidence.',
      deliverables: [
        'Geo-tagged photo upload with sub-meter RTK GPS coordinates and timestamp hashing',
        'Cadastral boundary inspection and digital joint measurement report signing',
        'On-site landowner identification and biometric/Aadhaar verification logs',
        'Automated discrepancy alerts against satellite GIS alignments',
      ],
    },
    {
      title: 'Citizens & Landowners',
      icon: UserCheck,
      color: 'text-amber-700 border-amber-200 bg-amber-50',
      role: 'citizen',
      summary:
        'Direct citizen self-service window eliminating middlemen and corruption. Enables landowners to track gazette notices, view itemized compensation calculations, eSign consent, and register CPGRAMS grievances.',
      deliverables: [
        'Public search by Survey Number or Acquisition ID without mandatory login',
        'Transparent itemized compensation breakdown (Base Value, Multiplier, Assets, Solatium)',
        'Legal digital consent eSign via Aadhaar OTP integration',
        'Multi-category grievance redressal portal with live Collector action tracking',
      ],
    },
    {
      title: 'System Administrators',
      icon: Shield,
      color: 'text-rose-700 border-rose-200 bg-rose-50',
      role: 'admin',
      summary:
        'Master system administration managing role-based access control (RBAC), immutable SHA-256 audit trails, geodatabase integrity, and API interoperability with BharatMaps and PFMS.',
      deliverables: [
        'Granular Role-Based Access Control (RBAC) across central, state, and district tiers',
        'Cryptographically signed, append-only regulatory audit ledger',
        'Statutory document repository with SHA-256 integrity verification',
        'High-availability GIS geodatabase health and sync latency monitoring',
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-blue-700" />
          Smart India Hackathon • Architectural Blueprints
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          System Scope & Stakeholder Architecture
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive mapping of how BhoomiSetu unifies India's land acquisition lifecycle under
          a transparent, accountable, and legally enforceable digital ecosystem.
        </p>
      </div>

      {/* Stakeholder Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stakeholders.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className={`p-3 rounded-2xl border ${s.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">{s.title}</h2>
                    <span className="text-[11px] font-mono text-slate-500 font-medium">
                      Operational Tier: <strong className="text-blue-900">{s.role.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {s.summary}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Core Functional Capabilities:
                  </span>
                  {s.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setUserRole(s.role as any);
                    setCurrentView('dashboard');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Launch {s.title} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
