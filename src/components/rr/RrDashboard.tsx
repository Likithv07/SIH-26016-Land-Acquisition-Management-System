import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { INITIAL_AFFECTED_FAMILIES } from '../../data/mockData';
import { AffectedFamily } from '../../types';
import {
  Users,
  Home,
  Briefcase,
  GraduationCap,
  Building,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  TrendingUp,
  Search,
  Award,
  DollarSign,
  ShieldCheck,
  Download,
  Filter,
} from 'lucide-react';

export const RrDashboard: React.FC = () => {
  const { showToast, addAuditLog } = useApp();
  const [families, setFamilies] = useState<AffectedFamily[]>(INITIAL_AFFECTED_FAMILIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const colonies = [
    {
      name: 'Bhoomi Awas Enclave, Suryapet',
      location: 'Telangana (NH-65 Project)',
      allottedUnits: 450,
      completedUnits: 420,
      schoolHospitalStatus: 'Operational',
      waterElectricity: '100% Commissioned',
      livelihoodGrantsDisbursedCr: 24.5,
    },
    {
      name: 'Sahyadri Shanti Vihar, Raigad',
      location: 'Maharashtra (WDFC Corridor)',
      allottedUnits: 720,
      completedUnits: 680,
      schoolHospitalStatus: 'PHC & Primary School Ready',
      waterElectricity: '100% Commissioned',
      livelihoodGrantsDisbursedCr: 58.2,
    },
    {
      name: 'Pragati Nagar Township, Varanasi',
      location: 'Uttar Pradesh (Ganga Expressway)',
      allottedUnits: 600,
      completedUnits: 510,
      schoolHospitalStatus: 'Under Construction (85%)',
      waterElectricity: '90% Commissioned',
      livelihoodGrantsDisbursedCr: 38.0,
    },
  ];

  const handleDisburseBatch = () => {
    showToast('Disbursed Q1 R&R subsistence allowance batch to 842 families via PFMS DBT', 'success');
    addAuditLog('Disbursed R&R Subsistence Grants', 'Rehabilitation & Resettlement', 'Transferred Q1 statutory livelihood allowance');
  };

  const handleDisburseSingle = (family: AffectedFamily) => {
    setFamilies((prev) =>
      prev.map((f) =>
        f.familyId === family.familyId
          ? {
              ...f,
              subsistenceAllowancePaid: f.subsistenceAllowancePaid + 60000,
              rehabilitationStatus: f.rehabilitationStatus === 'Identified' ? 'Subsistence Disbursed' : f.rehabilitationStatus,
            }
          : f
      )
    );
    showToast(`Disbursed ₹60,000 monthly subsistence grant to ${family.headOfFamily}`, 'success');
    addAuditLog('Disbursed Family Subsistence Grant', 'Rehabilitation & Resettlement', `Disbursed ₹60,000 to ${family.familyId}`);
  };

  const filteredFamilies = families.filter((f) => {
    const matchesSearch =
      f.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.familyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.homesteadAllottedUnit && f.homesteadAllottedUnit.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || f.rehabilitationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              Second Schedule RFCTLARR Act 2013
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Rehabilitation &amp; Resettlement (R&amp;R) Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Monitoring housing allotments, livelihood grants, and skill training for project-affected families.
          </p>
        </div>

        <button
          onClick={handleDisburseBatch}
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs btn-hover transition-colors cursor-pointer"
        >
          Disburse R&amp;R Subsistence Grant
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Affected Families Identified"
          value="1,24,500"
          subtitle="SIA baseline survey"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Displaced Requiring Housing"
          value="34,200"
          subtitle="Pucca houses in R&R zones"
          icon={Home}
          color="cyan"
        />
        <StatCard
          title="Livelihood Grants Disbursed"
          value="₹842 Crore"
          subtitle="One-time statutory grant"
          icon={Briefcase}
          color="emerald"
        />
        <StatCard
          title="Skill Training Enrolled"
          value="18,450"
          subtitle="PMKVY certified trades"
          icon={GraduationCap}
          color="purple"
        />
      </div>

      {/* Resettlement Colonies Live Status */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-700" />
              <span>Model Resettlement Colonies &amp; Social Infrastructure</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Infrastructure standards compliant with Third Schedule of RFCTLARR 2013
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            92.4% Average Handover
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colonies.map((col) => (
            <div
              key={col.name}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:border-blue-300 card-hover transition-all group"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-700 transition-colors">
                  {col.name}
                </h3>
                <p className="text-[11px] text-slate-500 mb-4">{col.location}</p>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Constructed Units:</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {col.completedUnits} / {col.allottedUnits}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Civic Amenities:</span>
                    <span className="text-blue-900 font-semibold">{col.schoolHospitalStatus}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Power &amp; Water Grid:</span>
                    <span className="text-slate-800 font-medium">{col.waterElectricity}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Livelihood Grant Paid:</span>
                    <span className="font-mono text-purple-700 font-bold">
                      ₹{col.livelihoodGrantsDisbursedCr} Cr
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Handover status:</span>
                <span className="text-emerald-700 font-bold font-mono">
                  {((col.completedUnits / col.allottedUnits) * 100).toFixed(0)}% Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Affected Families (PAF) Statutory Register */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <span>Project-Affected Families (PAF) Entitlement Register</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Individual rehabilitation records under Section 16 &amp; 31 RFCTLARR Act 2013
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search family head or ID..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto">
              {['ALL', 'Fully Resettled', 'Homestead Allotted', 'Subsistence Disbursed', 'Identified'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">PAF ID &amp; Head of Family</th>
                <th className="py-3 px-4">Category &amp; Size</th>
                <th className="py-3 px-4">Village / Mandal</th>
                <th className="py-3 px-4">Allotted Homestead</th>
                <th className="py-3 px-4">PMKVY Skill Training</th>
                <th className="py-3 px-4">Subsistence Disbursed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredFamilies.map((fam) => (
                <tr key={fam.familyId} className="interactive-row">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-blue-900 text-xs block">{fam.familyId}</span>
                    <span className="font-semibold text-slate-900">{fam.headOfFamily}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-[11px] text-slate-700 mr-1.5">
                      {fam.category}
                    </span>
                    <span className="text-slate-500">{fam.familyMembersCount} Members</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {fam.village}, {fam.district}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {fam.homesteadAllottedUnit || 'Under Allocation'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {fam.skillTrainingEnrolledTrade || 'Eligible for Enrolment'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                    ₹{fam.subsistenceAllowancePaid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        fam.rehabilitationStatus === 'Fully Resettled'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : fam.rehabilitationStatus === 'Homestead Allotted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : fam.rehabilitationStatus === 'Subsistence Disbursed'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {fam.rehabilitationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDisburseSingle(fam)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-semibold btn-hover cursor-pointer"
                    >
                      Disburse Grant
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
