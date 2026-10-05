import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  FolderKanban,
  MapPin,
  Clock,
  CheckCircle2,
  Calculator,
  Camera,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const {
    projects,
    landParcels,
    setSelectedParcelId,
    setCurrentView,
    showToast,
  } = useApp();

  const districtProjects = projects.filter((p) => p.district === 'Medchal' || p.state === 'Telangana');
  const verifiedParcels = landParcels.filter((p) => p.status === 'Acquired');
  const pendingCompensation = landParcels.filter((p) => p.compensationStatus === 'Pending' || p.compensationStatus === 'Under Review');
  const possessionCompleted = landParcels.filter((p) => p.status === 'Acquired');

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              District Revenue Administration • Medchal-Malkajgiri
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            District Land Acquisition Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Office of the Special Land Acquisition Officer (Competent Authority under NH Act & RFCTLARR)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('compensation')}
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs active:scale-98 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>Open Award Calculator</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Prompt requested) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Projects in District"
          value={districtProjects.length}
          subtitle="NH-65 & Outer Ring Road"
          icon={FolderKanban}
          color="blue"
        />
        <StatCard
          title="Land Parcels Verified"
          value="482 Plots"
          subtitle="92% Joint Survey Done"
          icon={CheckCircle2}
          color="cyan"
        />
        <StatCard
          title="Compensation Pending"
          value={`${pendingCompensation.length} Awards`}
          subtitle="Awaiting Collector DSC"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Possession Completed"
          value="340 Acres"
          subtitle="Handover to NHAI Done"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Table of Land Parcels awaiting review */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-700" />
              <span>Survey Parcels Awaiting Valuation Hearing & Award</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Joint measurement confirmed parcels pending statutory award determination
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            {pendingCompensation.length} Pending Actions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-semibold text-[11px] uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Parcel ID</th>
                <th className="py-3 px-4">Landowner Legal Entity</th>
                <th className="py-3 px-4">Survey No.</th>
                <th className="py-3 px-4">Extent</th>
                <th className="py-3 px-4">Base Market Rate</th>
                <th className="py-3 px-4">Calculated Award</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pendingCompensation.map((parcel) => (
                <tr
                  key={parcel.id}
                  onClick={() => {
                    setSelectedParcelId(parcel.id);
                    setCurrentView('compensation');
                  }}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                    {parcel.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {parcel.landownerName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    Sy {parcel.surveyNumber}
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    {parcel.areaAcres} Acres
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    ₹{(parcel.compensation?.governmentRatePerAcre || parcel.marketValuePerAcre || 0).toLocaleString('en-IN')}/Ac
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    ₹{(parcel.compensation?.totalCompensation || parcel.totalCompensation || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={parcel.compensationStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedParcelId(parcel.id);
                        setCurrentView('compensation');
                      }}
                      className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Review & Approve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
