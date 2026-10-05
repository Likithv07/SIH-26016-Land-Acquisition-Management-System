import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  ArrowLeft,
  Building,
  Calendar,
  MapPin,
  Compass,
  Calculator,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  FolderKanban,
} from 'lucide-react';

// Statutory authority responsible for each lifecycle stage (used when a stage has no named officer)
const STAGE_AUTHORITY: Record<number, string> = {
  1: 'Project Proponent (Implementing Agency)',
  2: 'Tahsildar & Revenue Inspector',
  3: 'District Survey & Land Records (DSLR)',
  4: 'Competent Authority for Land Acquisition (CALA)',
  5: 'Special Land Acquisition Officer',
  6: 'District Valuation Committee',
  7: 'District Collector & LAO',
  8: 'PFMS Treasury & DBT Cell',
  9: 'Revenue Divisional Officer (RDO)',
  10: 'Implementing Agency & State Gazette',
};

export const ProjectDetails: React.FC = () => {
  const {
    selectedProjectId,
    projects,
    landParcels,
    setSelectedParcelId,
    setCurrentView,
    userRole,
    setUserRole,
    showToast,
  } = useApp();

  const project =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const stages = project.lifecycle.map((s) => ({
    stageNumber: s.id,
    name: s.name,
    status: s.status,
    notes: s.description,
    date: s.completedDate
      ? `Completed ${s.completedDate}`
      : s.targetDate
      ? `Target ${s.targetDate}`
      : '',
    officerName: s.officerInCharge || STAGE_AUTHORITY[s.id] || 'District Revenue Authority',
    delayDays: s.delayDays,
  }));

  const projectParcels = landParcels.filter((p) => p.projectId === project.id);
  const landPendingAcres = Math.max(0, project.landRequired - project.landAcquired);

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'border-emerald-200 bg-emerald-50/50 text-slate-800';
      case 'In Progress':
        return 'border-blue-300 bg-blue-50/60 text-slate-900 ring-1 ring-blue-200';
      case 'Delayed':
        return 'border-rose-200 bg-rose-50/50 text-slate-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Master</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentView('gis_map');
              showToast(`Navigated to GIS view for ${project.id}`, 'info');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Compass className="w-4 h-4" />
            <span>Open in GIS Map</span>
          </button>
          <button
            onClick={() => {
              setUserRole('officer');
              setCurrentView('compensation');
              showToast('Opened Compensation & Award Hearing Console', 'info');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Calculator className="w-4 h-4" />
            <span>Review Awards</span>
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-blue-950 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {project.id}
              </span>
              <StatusBadge status={project.status} />
              <span className="px-2.5 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200">
                {project.projectType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{project.ministry}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block font-medium">Overall Milestone Progress</span>
              <span className="font-mono text-2xl font-bold text-blue-900">{project.progress}%</span>
              <div className="w-36 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-700 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Implementing Agency</span>
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-700" />
              {project.implementingAgency}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">State & District</span>
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {project.state}, {project.district}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Project Start Date</span>
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              {project.startDate}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-1">Expected Completion</span>
            <span className="text-slate-900 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-700" />
              {project.expectedCompletionDate}
            </span>
          </div>
        </div>

        {/* Land & Financial Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Land Required</span>
            <span className="text-lg font-bold font-mono text-slate-900">{(project?.landRequired ?? 0).toLocaleString()} Acres</span>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-900 font-medium block">Land Acquired</span>
            <span className="text-lg font-bold font-mono text-emerald-700">{(project?.landAcquired ?? 0).toLocaleString()} Acres</span>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-blue-900 font-medium block">Sanctioned Budget</span>
            <span className="text-lg font-bold font-mono text-blue-900">₹{(project?.budgetCr ?? 0).toLocaleString('en-IN')} Cr</span>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <span className="text-purple-900 font-medium block">Disbursed Award</span>
            <span className="text-lg font-bold font-mono text-purple-700">₹{(project?.compensationDisbursedCr ?? 0).toLocaleString()} Cr</span>
          </div>
        </div>
      </div>

      {/* Vertical Lifecycle Timeline (10 Acquisition Stages) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-700" />
              <span>Statutory 10-Stage Land Acquisition Timeline</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Compliant with RFCTLARR Act 2013 and Section 3A to 3D gazette processes
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Current: Stage {stages.find((s) => s.status === 'In Progress' || s.status === 'Delayed')?.stageNumber ?? stages.filter((s) => s.status === 'Completed').length}
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'Completed';
            const isInProgress = stage.status === 'In Progress';
            const isDelayed = stage.status === 'Delayed';

            return (
              <div key={stage.stageNumber} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center bg-white z-10 transition-all ${
                    isCompleted
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : isInProgress
                      ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-200'
                      : isDelayed
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="text-[11px] font-mono font-bold">
                    {stage.stageNumber}
                  </span>
                </div>

                {/* Stage Content Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${getStatusBorder(
                    stage.status
                  )}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                        {stage.name}
                      </h3>
                      <StatusBadge status={stage.status} />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                      <span>{stage.date}</span>
                      {stage.delayDays ? (
                        <span className="text-rose-700 font-semibold">+{stage.delayDays}d over SLA</span>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {stage.notes}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                      <span>Authorized Officer: </span>
                      <span className="text-slate-900 font-semibold">{stage.officerName}</span>
                    </div>

                    {/* Quick Action Button for In-Progress Stages */}
                    {isInProgress && stage.stageNumber === 7 && (
                      <button
                        onClick={() => {
                          setUserRole('officer');
                          setCurrentView('compensation');
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-700 text-white text-xs font-bold shadow-2xs hover:bg-blue-800 transition-colors"
                      >
                        Action Award Approval →
                      </button>
                    )}
                    {isInProgress && stage.stageNumber === 3 && userRole === 'field_officer' && (
                      <button
                        onClick={() => {
                          setCurrentView('field_upload');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-2xs hover:bg-emerald-700 transition-colors"
                      >
                        Upload Field Verification →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parcel Register for this Project */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-700" />
              <span>Land Parcel Register</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Survey-number level acquisition, award and possession status for {project.id}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              {(project.landAcquired ?? 0).toLocaleString('en-IN')} Ac Acquired
            </span>
            <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              {landPendingAcres.toLocaleString('en-IN')} Ac Pending
            </span>
          </div>
        </div>

        {projectParcels.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 mx-auto flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Parcel records held in State Bhu-Naksha registry</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                Survey-level records for {project.state} are synchronised nightly from the State land records
                portal. Open the GIS map to inspect the notified alignment and cadastral boundaries.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('gis_map')}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Compass className="w-4 h-4" />
              <span>View Alignment on GIS Map</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-semibold text-[11px] uppercase border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Parcel ID</th>
                  <th className="py-3 px-4">Landowner</th>
                  <th className="py-3 px-4">Survey No. / Village</th>
                  <th className="py-3 px-4">Extent</th>
                  <th className="py-3 px-4">Acquisition</th>
                  <th className="py-3 px-4">Award</th>
                  <th className="py-3 px-4">Possession</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {projectParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">{parcel.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{parcel.landownerName}</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span className="font-mono">Sy {parcel.surveyNumber}</span> • {parcel.village}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold whitespace-nowrap">{parcel.areaAcres} Acres</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={parcel.acquisitionStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 whitespace-nowrap">
                      ₹{(parcel.compensation?.totalCompensation || parcel.totalCompensation || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{parcel.possessionStatus}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedParcelId(parcel.id);
                          setCurrentView('compensation');
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Award</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
