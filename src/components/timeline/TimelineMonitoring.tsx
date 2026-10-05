import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Hourglass,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const TimelineMonitoring: React.FC = () => {
  const { setSelectedProjectId, setCurrentView, showToast } = useApp();

  const timelineItems = [
    {
      id: 'NLA-TS-2026-001',
      name: 'Hyderabad-Vijayawada Expressway Expansion (NH-65)',
      notifDate: '15 Jan 2025',
      deadlineDate: '14 Jan 2026',
      daysRemaining: 124,
      risk: 'Safe',
      riskColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      currentStage: 'Stage 7: Award Hearing',
      slaPercent: 66,
    },
    {
      id: 'NLA-MH-2026-004',
      name: 'Delhi–Mumbai Industrial Corridor (Shendra-Bidkin Node)',
      notifDate: '01 Apr 2025',
      deadlineDate: '31 Mar 2026',
      daysRemaining: 198,
      risk: 'Safe',
      riskColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      currentStage: 'Stage 9: Possession Handover',
      slaPercent: 91,
    },
    {
      id: 'NLA-KA-2026-008',
      name: 'Bengaluru–Chennai Expressway (Karnataka Section)',
      notifDate: '10 Feb 2025',
      deadlineDate: '09 Feb 2026',
      daysRemaining: 38,
      risk: 'High Risk (SLA Breach Threat)',
      riskColor: 'text-rose-800 bg-rose-50 border-rose-200 font-bold',
      currentStage: 'Stage 4: Section 3D Pending',
      slaPercent: 44,
    },
    {
      id: 'NLA-UP-2026-012',
      name: 'Varanasi–Ranchi–Kolkata Green Expressway (Package 2)',
      notifDate: '20 May 2025',
      deadlineDate: '19 May 2026',
      daysRemaining: 245,
      risk: 'Safe',
      riskColor: 'text-blue-800 bg-blue-50 border-blue-200',
      currentStage: 'Stage 6: Valuation Committee',
      slaPercent: 55,
    },
    {
      id: 'NLA-GJ-2026-003',
      name: 'Dholera Smart Industrial City & Special Investment Region',
      notifDate: '12 Mar 2025',
      deadlineDate: '11 Mar 2026',
      daysRemaining: 74,
      risk: 'Moderate Risk',
      riskColor: 'text-amber-800 bg-amber-50 border-amber-200',
      currentStage: 'Stage 7: Solatium Approval',
      slaPercent: 72,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              Statutory 12-Month Lapsing Prevention Monitor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Timeline Monitoring & SLA Countdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Automated statutory countdown under Section 19(7) of RFCTLARR Act to ensure proceedings never lapse.
          </p>
        </div>

        <button
          onClick={() => showToast('Dispatched automated SLA escalation notices to District Collectors', 'success')}
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          Dispatch Collector Escalations
        </button>
      </div>

      {/* Grid of SLA Countdown Cards */}
      <div className="space-y-4">
        {timelineItems.map((item) => (
          <div key={item.id} className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.id}
                  </span>
                  <span className={`text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full border ${item.riskColor}`}>
                    {item.risk}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600">
                  Current Milestone: <span className="text-slate-900 font-semibold">{item.currentStage}</span>
                </p>
              </div>

              {/* Countdown badge & Dates */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Section 3A Gazette Date</span>
                  <span className="text-xs font-mono text-slate-900 font-semibold">{item.notifDate}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">12-Month Lapsing Limit</span>
                  <span className="text-xs font-mono text-rose-700 font-semibold">{item.deadlineDate}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 min-w-[120px] text-center">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block font-medium">Days Remaining</span>
                  <span className="font-mono text-2xl font-bold text-slate-900">
                    {item.daysRemaining}d
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedProjectId(item.id);
                    setCurrentView('project_details');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                <span>Milestone Turnover Rate</span>
                <span className="font-mono text-blue-900 font-semibold">{item.slaPercent}% completed</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-700 rounded-full"
                  style={{ width: `${item.slaPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
