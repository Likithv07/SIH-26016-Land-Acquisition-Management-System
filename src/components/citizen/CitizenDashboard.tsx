import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  MapPin,
  Compass,
  CreditCard,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  Download,
  Fingerprint,
  FileText,
  MessageSquarePlus,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Bot,
  Building,
  HelpCircle,
  Landmark,
  RefreshCw,
  Award,
  FolderLock,
  Scale,
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    setCurrentView,
    submitConsent,
    showToast,
    refreshData,
    isRefreshing,
    lastSyncedAt,
    grievances,
    setIsChatbotOpen,
  } = useApp();

  // Fresh data refresh on component mount
  useEffect(() => {
    refreshData();
  }, []);

  // Find user's parcel (default to primary demo parcel)
  const citizenParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  const [showSignModal, setShowSignModal] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState('781923');

  // Filter grievances relevant to this parcel or citizen
  const citizenGrievances = grievances.filter(
    (g) =>
      g.parcelId === citizenParcel.id ||
      g.citizenName.toLowerCase().includes(citizenParcel.landownerName.toLowerCase())
  );

  const handleExecuteESign = () => {
    submitConsent(citizenParcel.id);
    setShowSignModal(false);
    showToast('Aadhaar eSign Consent verified and recorded on Blockchain', 'success');
  };

  const handleDownloadForm16C = () => {
    const totalComp = citizenParcel.totalCompensation || citizenParcel.compensation?.totalCompensation || 7225000;
    const baseLand = citizenParcel.compensation?.baseCompensation || Math.round(citizenParcel.areaAcres * (citizenParcel.marketValuePerAcre || 2500000) * (citizenParcel.multiplierFactor || 1.5));
    const solatium = citizenParcel.compensation?.solatium || Math.round(totalComp * 0.45);
    const assetVal = citizenParcel.compensation?.additionalBenefits || citizenParcel.assetValuation || 350000;

    const certText = `================================================================================
GOVERNMENT OF INDIA - MINISTRY OF ROAD TRANSPORT & HIGHWAYS
COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
FORM 16-C STATUTORY COMPENSATION AWARD CERTIFICATE
[Under Section 23, 26, 27, 28, 29 & 30 of RFCTLARR Act, 2013]
================================================================================
PARCEL REFERENCE ID    : ${citizenParcel.id}
SURVEY NUMBER          : ${citizenParcel.surveyNumber}
BENEFICIARY NAME       : ${citizenParcel.landownerName}
AADHAAR (MASKED)       : ${citizenParcel.landownerAadhaar || citizenParcel.maskedAadhaar}
REVENUE VILLAGE        : ${citizenParcel.village}, Mandal: Ghatkesar, Dist: ${citizenParcel.district}
ACQUIRED EXTENT        : ${citizenParcel.areaAcres} Acres (${citizenParcel.landType})
INFRASTRUCTURE PROJECT : ${citizenParcel.projectName}

================================================================================
STATUTORY COMPENSATION & VALUATION SUMMARY
================================================================================
1. Basic Land Value (Market Rate x Multiplier)    : ₹${baseLand.toLocaleString('en-IN')}
2. Immovable Assets (Trees, Well, Structures)     : ₹${assetVal.toLocaleString('en-IN')}
3. Statutory Solatium (100% Mandatory)            : ₹${solatium.toLocaleString('en-IN')}
4. Additional Interest under Section 30(3)        : ₹${Math.round(baseLand * 0.1).toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TOTAL STATUTORY AWARD (NET PAYABLE)               : ₹${totalComp.toLocaleString('en-IN')}
================================================================================
DISBURSAL DETAILS
Bank Mandate          : State Bank of India (•••4892)
PFMS Authorization    : PFMS-GOI-2026-88194
eSign Consent Status  : ${citizenParcel.consentReceived ? 'VERIFIED VIA AADHAAR OTP (' + citizenParcel.consentDate + ')' : 'ACTION REQUIRED'}
PFMS DBT Status       : ${citizenParcel.compensationStatus}
CALA Digital Seal     : SHA256:${citizenParcel.id.replace(/-/g, '')}7f8a912b4e89
================================================================================
This is a legally binding statutory compensation certificate issued under 
the Seal of the Collector & District Magistrate.
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form_16C_Award_${citizenParcel.surveyNumber.replace(/\//g, '_')}_${citizenParcel.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded Form 16-C Award Certificate for Survey No. ${citizenParcel.surveyNumber}`, 'success');
  };

  const handleDownloadLandApproval = () => {
    const certText = `================================================================================
GOVERNMENT OF INDIA - MINISTRY OF ROAD TRANSPORT & HIGHWAYS
COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
FORM 11-A STATUTORY LAND ACQUISITION APPROVAL & DEMARCATION ORDER
[Under Section 19(1) of RFCTLARR Act, 2013 & National Highways Act 1956]
================================================================================
APPROVAL ORDER REF     : CALA/REV/2026/F11A-${citizenParcel.surveyNumber.replace(/\//g, '')}
LAND PARCEL IDENTIFIER : ${citizenParcel.id}
SURVEY NUMBER          : ${citizenParcel.surveyNumber}
REGISTERED BENEFICIARY : ${citizenParcel.landownerName}
MASKED AADHAAR         : ${citizenParcel.landownerAadhaar || citizenParcel.maskedAadhaar}
REVENUE VILLAGE        : ${citizenParcel.village}, Mandal: Ghatkesar, Dist: ${citizenParcel.district}
LAND CLASSIFICATION    : ${citizenParcel.landType} (Title: Unencumbered Ancestral)
ACQUIRED EXTENT        : ${citizenParcel.areaAcres} Acres
INFRASTRUCTURE CORRIDOR: ${citizenParcel.projectName}

================================================================================
STATUTORY BOUNDARY DEMARCATION SCHEDULE
================================================================================
NORTH BOUNDARY : Survey No. 144 (Agricultural Land)
SOUTH BOUNDARY : Proposed Service Road & Highway Corridor
EAST BOUNDARY  : Survey No. 145/3
WEST BOUNDARY  : Survey No. 145/1 (Village Cart Track)

GROUND PEGS    : BP-01, BP-02, BP-03, BP-04 (DGPS RTK Fixed - 1.5cm precision)
ENCUMBRANCES   : NIL (Certified by Sub-Registrar & Dharani Land Registry)
ORDER CLEARANCE: Clear title sanctioned for transfer to NHAI upon compensation award.
================================================================================
SEAL OF THE COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
Digitally Signed by: Ravi Kumar, IAS (District Collector & LAO)
Date of Issue      : 08 Mar 2026
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form_11A_LandApproval_Sy_${citizenParcel.surveyNumber.replace(/\//g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded Form 11-A Land Approval Order for Survey No. ${citizenParcel.surveyNumber}`, 'success');
  };

  const handleDownloadProcessReport = () => {
    const certText = `================================================================================
GOVERNMENT OF INDIA - BHOOMISETU NATIONAL LAND PORTAL
CITIZEN LAND ACQUISITION APPLICATION & PROCESS PROGRESS REPORT
================================================================================
APPLICATION DOSSIER ID : BHM-APP-2026-${citizenParcel.surveyNumber.replace(/\//g, '-')}
BENEFICIARY NAME       : ${citizenParcel.landownerName}
SURVEY NUMBER          : ${citizenParcel.surveyNumber}
ACQUISITION CORRIDOR   : ${citizenParcel.projectName}
LIFECYCLE STATUS       : STAGE 5 / 7 (AWARD DETERMINED & APPROVED)
================================================================================
MILESTONE AUDIT TRAIL & STATUTORY DATES
--------------------------------------------------------------------------------
[✓] STAGE 1: DPR Alignment & Preliminary Survey           : 10 Jan 2026 (Completed)
[✓] STAGE 2: Section 3A Preliminary Gazette Issued        : 22 Jan 2026 (Completed)
[✓] STAGE 3: Drone LiDAR & Joint Field Demarcation (JMVR) : 18 Feb 2026 (Completed)
[✓] STAGE 4: Section 15(1) Objection Period Closure       : 28 Feb 2026 (No Disputed Claims)
[✓] STAGE 5: Form 16-C Statutory Award Declaration        : 08 Mar 2026 (Sanctioned)
[•] STAGE 6: PFMS Electronic DBT Disbursal to Bank        : IN PROGRESS (Treasury Queue)
[ ] STAGE 7: Final Physical Site Handover (Possession)    : Target 15 Apr 2026
================================================================================
REVENUE NODAL OFFICER REMARKS:
"Title deed, revenue 1-B extract, and joint spot measurement verified with landowner.
Consent recorded and statutory award passed with zero deductions."
Certified by: Competent Authority for Land Acquisition (CALA)
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Application_Process_Report_Sy_${citizenParcel.surveyNumber.replace(/\//g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded Application Process Report for Survey No. ${citizenParcel.surveyNumber}`, 'success');
  };

  const steps = [
    { name: 'DPR & Preliminary Section 3A', status: 'Completed', date: '10 Jan 2026' },
    { name: 'Drone LiDAR & Joint Measurement', status: 'Completed', date: '28 Jan 2026' },
    { name: 'Public Hearing & Objection Review', status: 'Completed', date: '14 Feb 2026' },
    { name: 'Section 3D Declaration Gazette', status: 'Completed', date: '02 Mar 2026' },
    { name: 'Statutory Award Calculation', status: 'Completed', date: '08 Mar 2026' },
    {
      name: 'Compensation Disbursal (PFMS DBT)',
      status: citizenParcel.compensationStatus === 'Approved' ? 'Completed' : 'In Progress',
      date: citizenParcel.compensationStatus === 'Approved' ? 'Ready for Transfer' : 'Under Officer Seal',
    },
    { name: 'Physical Handover of Possession', status: 'Pending', date: 'Est. 15 Apr 2026' },
  ];

  return (
    <div className="space-y-6 pb-20 relative animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              Citizen Direct Benefits &amp; Land Transparency Window
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            My Land Acquisition &amp; Compensation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Official records for <strong className="text-slate-900 font-semibold">Shri {citizenParcel.landownerName}</strong> • Aadhaar{' '}
            <span className="font-mono text-slate-700">{citizenParcel.landownerAadhaar || citizenParcel.maskedAadhaar}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Parcel Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-slate-500 font-medium">Parcel:</span>
            <select
              value={citizenParcel.id}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="bg-transparent font-bold text-blue-900 focus:outline-none cursor-pointer text-xs"
            >
              {landParcels.map((p) => (
                <option key={p.id} value={p.id}>
                  Sy {p.surveyNumber} ({p.village})
                </option>
              ))}
            </select>
          </div>

          {/* Live Sync / Refresh Button */}
          <button
            onClick={() => refreshData()}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs btn-hover cursor-pointer"
            title={`Last synced: ${lastSyncedAt}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          {/* AI Chatbot Trigger Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            id="citizen-ask-ai-btn"
            className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-200" />
            <span>Ask BhoomiMitra AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setCurrentView('grievance')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs btn-hover transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Raise a Grievance</span>
          </button>

          {/* Compensation & R&R Choices Entry Button */}
          <button
            onClick={() => setCurrentView('citizen_rr_choices')}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs btn-hover transition-colors cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-200" />
            <span>Compensation &amp; R&amp;R Choices</span>
          </button>
        </div>
      </div>

      {/* Action Quick Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setCurrentView('citizen_land')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 card-hover text-left flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <Compass className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-900 transition-colors">
              Land &amp; Demarcation
            </span>
            <span className="text-[11px] text-slate-500">
              FMB Pillars &amp; Geometry
            </span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('citizen_compensation')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-400 card-hover text-left flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-900 transition-colors">
              My Compensation
            </span>
            <span className="text-[11px] text-emerald-800 font-semibold font-mono">
              ₹{(((citizenParcel.totalCompensation || citizenParcel.compensation?.totalCompensation || 7225000)) / 100000).toFixed(2)}L Sanctioned
            </span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('consent')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 card-hover text-left flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-900 transition-colors">
              Form 7 eSign Consent
            </span>
            <span className="text-[11px] text-slate-500">
              {citizenParcel.consentReceived ? '✓ Signed & Verified' : 'Action Required'}
            </span>
          </div>
        </button>

        <button
          onClick={() => setCurrentView('grievance')}
          className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-amber-400 card-hover text-left flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageSquarePlus className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-900 transition-colors">
              Raise a Grievance
            </span>
            <span className="text-[11px] text-slate-500">
              {citizenGrievances.length > 0 ? `${citizenGrievances.length} Active Records` : 'Disputes & Corrections'}
            </span>
          </div>
        </button>
      </div>

      {/* Compensation & R&R Choices Feature Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-700 text-white shadow-2xs shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                RFCTLARR 2013 Choice Matrix
              </span>
              <span className="text-xs text-slate-500 font-medium">Section 31 &amp; Schedule II</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Compensation &amp; R&amp;R Choices
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Evaluate and choose between Full Monetary Compensation, Compensation + R&amp;R Package, or Alternative Rehabilitation Asset Package.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('citizen_rr_choices')}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-colors btn-hover self-start sm:self-auto shrink-0 cursor-pointer"
        >
          <span>Compensation &amp; R&amp;R Choices</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Land Card & Live Compensation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Land Particulars */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-mono text-blue-800 uppercase font-bold">
                Gazetted Revenue Record
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Survey No: {citizenParcel.surveyNumber}
              </h2>
            </div>
            <StatusBadge status={citizenParcel.status ?? citizenParcel.acquisitionStatus} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Acquired Extent</span>
              <span className="font-mono text-base font-bold text-slate-900">
                {citizenParcel.areaAcres} Acres
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Land Classification</span>
              <span className="font-semibold text-slate-900">
                {citizenParcel.landType}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Revenue Mandal</span>
              <span className="font-semibold text-slate-900">
                {citizenParcel.village}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Basic Unit Rate</span>
              <span className="font-mono font-semibold text-slate-800">
                ₹{(citizenParcel.compensation?.governmentRatePerAcre || citizenParcel.marketValuePerAcre || 2400000).toLocaleString('en-IN')}/Ac
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Multiplier Factor</span>
              <span className="font-mono text-emerald-700 font-bold">
                {citizenParcel.multiplierFactor || 1.5}x (Rural)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Solatium Guarantee</span>
              <span className="font-mono text-indigo-700 font-bold">
                100% Statutory
              </span>
            </div>
          </div>

          {/* eSign Consent Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Digital Consent eSign</h3>
              </div>
              {citizenParcel.consentReceived ? (
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                  eSIGN COMPLETED
                </span>
              ) : (
                <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold">
                  ACTION REQUIRED
                </span>
              )}
            </div>

            {citizenParcel.consentReceived ? (
              <p className="text-xs text-emerald-900">
                Consent form digitally eSigned on {citizenParcel.consentDate || 'Recently'} via Aadhaar eSign
                OTP verification. Award is queued for final PFMS treasury transfer.
              </p>
            ) : (
              <div>
                <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                  Under the RFCTLARR Act 2013, confirm your acceptance of the joint survey and statutory award
                  valuation through Aadhaar eSign to initiate treasury release.
                </p>
                <button
                  onClick={() => setShowSignModal(true)}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 transition-colors btn-hover cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Execute Aadhaar eSign Consent Now</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compensation & Bank Payment Particulars */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Compensation Award Summary
                </h2>
              </div>
              <StatusBadge status={citizenParcel.compensationStatus} />
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-4">
              <span className="text-emerald-900 text-xs block font-semibold mb-0.5">
                Total Statutory Award Sanctioned:
              </span>
              <span className="font-mono text-3xl font-extrabold text-emerald-700 tracking-tight">
                ₹{(citizenParcel.compensation?.totalCompensation || citizenParcel.totalCompensation || 0).toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-emerald-800 mt-1">
                Inclusive of 100% Solatium (₹{Math.round((citizenParcel.totalCompensation || 7225000) * 0.45).toLocaleString('en-IN')}) &amp; Asset Valuation
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                <span>Beneficiary Account:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {citizenParcel.maskedBankAccount || 'State Bank of India (•••4892)'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                <span>IFSC Code:</span>
                <span className="font-mono text-slate-800 font-medium">SBIN0004128</span>
              </div>
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                <span>PFMS Mandate ID:</span>
                <span className="font-mono text-blue-900 font-bold">PFMS-GOI-2026-88194</span>
              </div>
              <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
                <span>Disbursal Route:</span>
                <span className="text-emerald-700 font-semibold">
                  Direct Benefit Transfer (DBT)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100">
            <button
              onClick={handleDownloadForm16C}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors shadow-2xs btn-hover cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-700" />
              <span>Download Form 16-C Award Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Acquisition Lifecycle Milestone Tracker */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-700" />
          <span>Statutory Acquisition Milestones (RFCTLARR 2013)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const isCompleted = s.status === 'Completed';
            const isInProgress = s.status === 'In Progress';

            return (
              <div
                key={s.name}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : isInProgress
                    ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    STAGE 0{idx + 1}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4 text-blue-700 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <h3 className="font-semibold text-xs text-slate-900 mb-1 leading-snug">{s.name}</h3>
                <span className="text-[10px] font-mono text-slate-500 block">{s.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Personal Documents & Reports Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-slate-900">
                My Official Records &amp; Clearance Certificates
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified land approval, compensation award, and application process reports for Survey No.{' '}
              <strong className="text-slate-800 font-mono">{citizenParcel.surveyNumber}</strong>
            </p>
          </div>

          <button
            onClick={() => setCurrentView('documents')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Open My Document Vault</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Doc 1: Land Approval */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  LAND APPROVAL
                </span>
                <ShieldCheck className="w-4 h-4 text-blue-700" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 mb-1">
                Land Acquisition Approval &amp; Demarcation Order (Form 11-A)
              </h3>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                CALA issued statutory order verifying title clearance, boundary demarcation (BP-01 to BP-04), and acquisition clearance.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60">
              <button
                onClick={handleDownloadLandApproval}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" />
                <span>Download Order</span>
              </button>
            </div>
          </div>

          {/* Doc 2: Compensation Report */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  COMPENSATION AWARD
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 mb-1">
                Form 16-C Statutory Compensation Award Certificate
              </h3>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                Full legal determination of ₹{(citizenParcel.totalCompensation || 7225000).toLocaleString('en-IN')}, 100% solatium, tree valuation, and PFMS DBT mandate.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
              <button
                onClick={handleDownloadForm16C}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-700" />
                <span>Download Award</span>
              </button>
            </div>
          </div>

          {/* Doc 3: Application Process Report */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                  PROCESS REPORT
                </span>
                <Clock className="w-4 h-4 text-indigo-700" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 mb-1">
                Land Acquisition Application &amp; Process Report
              </h3>
              <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                Audit trail from Stage 1 DPR alignment, Section 3A, JMVR field inspection, to compensation disbursement.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-indigo-200/60">
              <button
                onClick={handleDownloadProcessReport}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-700" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen's Filed Grievances Section */}
      {citizenGrievances.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                My Filed Grievances &amp; Objections ({citizenGrievances.length})
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('grievance')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View All Grievances</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {citizenGrievances.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {g.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">{g.category}</span>
                    <span className="text-[11px] text-slate-500">• Filed on {g.submittedDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{g.subject}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{g.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      g.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : g.status === 'Under Review'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {g.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aadhaar eSign OTP Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  CDAC / NSDL Aadhaar eSign Service
                </h3>
                <p className="text-[11px] text-slate-500">
                  Legal digital acceptance under IT Act 2000
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <p className="text-slate-600 leading-relaxed">
                By eSigning, you record your formal consent for Survey No.{' '}
                <span className="font-mono text-blue-900 font-bold">{citizenParcel.surveyNumber}</span>{' '}
                and approve the direct payment of{' '}
                <span className="font-mono text-sm font-bold text-emerald-700">
                  ₹{(citizenParcel.compensation?.totalCompensation || citizenParcel.totalCompensation || 0).toLocaleString('en-IN')}
                </span>{' '}
                to your registered SBI bank account.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter Aadhaar OTP (Sent to registered mobile)
                </label>
                <input
                  type="text"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-center tracking-widest text-base focus:border-blue-700 focus:bg-white focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block text-center">
                  Mock OTP: 781923
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteESign}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors btn-hover cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify &amp; Sign Consent</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
