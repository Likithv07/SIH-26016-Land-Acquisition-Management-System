import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Fingerprint,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Calendar,
  CreditCard,
  ChevronRight,
  Landmark,
  Scale,
  RefreshCw,
} from 'lucide-react';

export const CitizenCompensation: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    setCurrentView,
    showToast,
    addAuditLog,
    submitConsent,
    addGrievance,
    refreshData,
    isRefreshing,
    lastSyncedAt,
  } = useApp();

  useEffect(() => {
    refreshData();
  }, []);

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [localConsentGiven, setLocalConsentGiven] = useState(false);

  // Fallback parcel
  const parcel =
    (landParcels && landParcels.find((p) => p.id === selectedParcelId)) ||
    (landParcels && landParcels[0]) || {
      id: 'TS-HYD-2026-001245',
      surveyNumber: '145/2',
      projectId: 'NLA-TS-2026-001',
      projectName: 'Hyderabad–Vijayawada Expressway',
      landownerName: 'Rajesh Kumar',
      landownerMobile: '+91 98765 43210',
      maskedAadhaar: 'XXXX-XXXX-8921',
      maskedBankAccount: 'HDFC Bank - •••• •••• 4192',
      state: 'Telangana',
      district: 'Hyderabad',
      village: 'Ghatkesar',
      areaAcres: 2.5,
      landType: 'Agricultural',
      acquisitionStatus: 'Compensation Pending',
      compensationStatus: 'Pending',
      possessionStatus: 'Demarcated',
      lastUpdated: '2026-09-08 14:32 IST',
      marketValuePerAcre: 2500000,
      multiplierFactor: 1.5,
      assetValuation: 350000,
      totalCompensation: 7225000,
      consentReceived: false,
      compensation: {
        governmentRatePerAcre: 2500000,
        baseCompensation: 6250000,
        solatium: 625000,
        additionalBenefits: 200000,
        rrAssistance: 150000,
        totalCompensation: 7225000,
        officerRemarks: 'Clear ancestral title verified.',
      },
    };

  const area = parcel.areaAcres || 2.5;
  const ratePerAcre = parcel.marketValuePerAcre || parcel.compensation?.governmentRatePerAcre || 2500000;
  const multiplier = parcel.multiplierFactor || 1.5;
  const baseLandValue = area * ratePerAcre;
  const multipliedLandValue = baseLandValue * multiplier;
  const assetsVal = parcel.assetValuation || parcel.compensation?.additionalBenefits || 350000;
  const solatium = (multipliedLandValue + assetsVal) * 1.0;
  const interestMonths = 10;
  const interestAmount = multipliedLandValue * 0.12 * (interestMonths / 12);
  const totalAward =
    parcel.totalCompensation ||
    parcel.compensation?.totalCompensation ||
    multipliedLandValue + assetsVal + solatium + interestAmount;

  const consentGiven = Boolean(parcel.consentReceived || localConsentGiven);

  const handleEsignConsent = () => {
    setLocalConsentGiven(true);
    submitConsent(parcel.id);
    setShowConsentModal(false);
    showToast('Aadhaar OTP verified. Award acceptance registered with Treasury CALA.', 'success');
    addAuditLog(
      'Citizen Consent Recorded',
      'Citizen Compensation Portal',
      `Aadhaar eSign consent recorded for parcel ${parcel.id}`,
      parcel.id
    );
  };

  const handleFileDispute = () => {
    if (!disputeReason.trim()) {
      showToast('Please specify grievance grounds', 'warning');
      return;
    }
    addGrievance({
      parcelId: parcel.id,
      citizenName: parcel.landownerName,
      mobile: parcel.landownerMobile || '9876543210',
      category: 'Compensation Dispute',
      subject: `Section 64 Objection: Sy ${parcel.surveyNumber}`,
      description: disputeReason,
    });
    setShowDisputeModal(false);
    showToast('Objection logged under RFCTLARR Section 64. Ref ID generated.', 'success');
    addAuditLog(
      'Section 64 Objection Filed',
      'Citizen Compensation Portal',
      `Objection: ${disputeReason}`,
      parcel.id
    );
    setDisputeReason('');
  };

  const handleDownloadAwardCertificate = () => {
    const certText = `================================================================================
GOVERNMENT OF INDIA - MINISTRY OF ROAD TRANSPORT & HIGHWAYS
COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
FORM 16-C STATUTORY COMPENSATION AWARD PASSBOOK
================================================================================
PARCEL ID             : ${parcel.id}
SURVEY NUMBER         : ${parcel.surveyNumber}
LANDOWNER NAME        : ${parcel.landownerName}
PROJECT               : ${parcel.projectName}
ACQUIRED AREA         : ${parcel.areaAcres} Acres (${parcel.landType})
MANDAL / VILLAGE      : ${parcel.village}, ${parcel.district}

================================================================================
DETAILED STATUTORY BREAKDOWN (RFCTLARR ACT 2013)
================================================================================
Basic Market Value    : ₹${baseLandValue.toLocaleString('en-IN')}
Multiplier Factor     : ${multiplier}x
Multiplied Base Value : ₹${multipliedLandValue.toLocaleString('en-IN')}
Immovable Assets      : ₹${assetsVal.toLocaleString('en-IN')}
100% Solatium         : ₹${solatium.toLocaleString('en-IN')}
12% Statutory Interest: ₹${Math.round(interestAmount).toLocaleString('en-IN')}
--------------------------------------------------------------------------------
TOTAL STATUTORY AWARD : ₹${Math.round(totalAward).toLocaleString('en-IN')}
================================================================================
eSign Status          : ${parcel.consentReceived ? 'COMPLETED & VERIFIED' : 'PENDING ACTION'}
PFMS DBT Route        : Direct Benefit Transfer (State Bank of India)
CALA Seal             : DIGITAL-SEAL-VERIFIED-${parcel.id}
================================================================================`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Compensation_Award_${parcel.surveyNumber.replace(/\//g, '_')}_${parcel.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded official Form 16-C Award Certificate', 'success');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-xs uppercase font-mono text-emerald-800 font-bold tracking-wider">
              Citizen Landowner Entitlement Portal
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold">
              Form 16-C Award Certificate
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Statutory Compensation &amp; DBT Passbook
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Official breakdown of your land acquisition award under Right to Fair Compensation and Transparency in Land Acquisition (RFCTLARR) Act, 2013.
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
            onClick={handleDownloadAwardCertificate}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors shadow-2xs btn-hover cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Award Certificate</span>
          </button>
        </div>
      </div>

      {/* Parcel Selector Strip (if multiple parcels exist) */}
      {landParcels && landParcels.length > 1 && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Select Land Parcel:</span>
            <select
              value={parcel.id}
              onChange={(e) => setSelectedParcelId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-700"
            >
              {landParcels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — Sy No. {p.surveyNumber} ({p.areaAcres} Ac, {p.village})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Status:</span>
            <StatusBadge status={parcel.compensationStatus} />
          </div>
        </div>
      )}

      {/* Hero Card: Total Award Payable */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-blue-200 font-semibold block mb-1">
              Final Statutory Award Amount (Section 31 Gazette)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400">
                ₹{Math.round(totalAward).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-blue-200">(Net Disbursable)</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
              Awarded for Survey No. <strong>{parcel.surveyNumber}</strong> ({parcel.areaAcres} Acres),{' '}
              {parcel.village} Village. Free of income tax and stamp duty pursuant to Section 96 of RFCTLARR Act.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            {parcel.consentReceived ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>eSign Consent Verified</span>
              </div>
            ) : (
              <button
                onClick={() => setShowConsentModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer btn-hover"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Aadhaar eSign Consent</span>
              </button>
            )}

            <button
              onClick={() => setShowDisputeModal(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <AlertCircle className="w-4 h-4 text-amber-300" />
              <span>File Valuation Grievance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Statutory Calculation Breakdown & DBT Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detailed Statutory Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold text-slate-900">
                Statutory Valuation Breakdown
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">RFCTLARR 2013</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">1. Base Market Rate (Section 26)</span>
                  <span className="text-[11px] text-slate-500">
                    {parcel.areaAcres} Acres @ ₹{ratePerAcre.toLocaleString('en-IN')} / Acre (MeeSeva circle rate)
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  ₹{Math.round(baseLandValue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">2. Rural Distance Multiplier (First Schedule)</span>
                  <span className="text-[11px] text-slate-500">
                    Factor of <strong>{multiplier}x</strong> applied for rural land zone (&gt;10km from city boundary)
                  </span>
                </div>
                <span className="font-mono font-bold text-blue-900">
                  ₹{Math.round(multipliedLandValue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-800 block">3. Attached Assets & Trees (Section 29)</span>
                  <span className="text-[11px] text-slate-500">
                    Fruit-bearing trees, farm shed structure, borewell certified by Joint Inspection
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  ₹{Math.round(assetsVal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-950 block">4. 100% Mandatory Solatium (Section 30(1))</span>
                  <span className="text-[11px] text-emerald-800">
                    100% statutory solatium added over total land value and attached assets
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-700">
                  ₹{Math.round(solatium).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-indigo-950 block">5. 12% Additional Market Value (Section 30(3))</span>
                  <span className="text-[11px] text-indigo-800">
                    Calculated from Preliminary Notification (3A) date to award date ({interestMonths} months)
                  </span>
                </div>
                <span className="font-mono font-bold text-indigo-700">
                  ₹{Math.round(interestAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
              <div>
                <span className="font-bold text-sm block">Total Statutory Entitlement</span>
                <span className="text-[11px] text-slate-400">Payable via PFMS Treasury DBT Direct Bank Credit</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ₹{Math.round(totalAward).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Bank Account & Disbursal Tracker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bank Account Verification */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  DBT Treasury Credit Account
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Aadhaar NPCI Linked
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Beneficiary Name</span>
                <span className="font-bold text-slate-900">{parcel.landownerName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Masked Bank Account</span>
                  <span className="font-mono font-bold text-slate-900">{parcel.maskedBankAccount || 'HDFC Bank •••• 4192'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Aadhaar Reference</span>
                  <span className="font-mono font-bold text-slate-900">{parcel.maskedAadhaar || 'XXXX-XXXX-8921'}</span>
                </div>
              </div>
            </div>

            {/* PFMS Disbursement Tracker */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider font-mono">
                PFMS Treasury Pipeline
              </h4>

              <div className="space-y-3 text-xs">
                {[
                  {
                    title: 'Form 16-B Gazette Determination',
                    status: 'Completed',
                    date: '08 Mar 2026',
                    done: true,
                  },
                  {
                    title: 'CALA Officer Digital Signature (DSC)',
                    status: 'Approved',
                    date: '08 Mar 2026',
                    done: true,
                  },
                  {
                    title: 'Aadhaar eSign & Bank Consent',
                    status: consentGiven ? 'Verified' : 'Pending Consent',
                    date: consentGiven ? 'Today' : 'Awaiting Citizen',
                    done: consentGiven,
                  },
                  {
                    title: 'RBI NEFT / RTGS Treasury Disbursal',
                    status: consentGiven ? 'Scheduled (48h)' : 'Pending',
                    date: consentGiven ? 'In Queue' : '—',
                    done: false,
                  },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        step.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 flex justify-between items-baseline">
                      <div>
                        <span className={`font-semibold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className="block text-[11px] text-slate-400">{step.status}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{step.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citizen Help Card */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <HelpCircle className="w-4 h-4 text-blue-700" />
              <span>Need Assistance with your Compensation?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Have questions regarding market rates, solatium calculation, or bank accounts? You can chat with the
              AI Land Assistant or file an objection under Section 64 with the District Collector.
            </p>
            <button
              onClick={() => setCurrentView('citizen_support')}
              className="text-blue-800 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Open Citizen Grievance Portal <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Aadhaar eSign Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Aadhaar eSign Compensation Consent
                </h3>
                <p className="text-[11px] text-slate-500">
                  Direct electronic award acceptance for PFMS bank transfer
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <p className="text-slate-600 leading-relaxed">
                An OTP will be sent to the mobile number registered with Aadhaar{' '}
                <strong className="font-mono text-slate-900">{parcel.maskedAadhaar || 'XXXX-XXXX-8921'}</strong>.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 block text-[11px]">Approved Compensation Order:</span>
                <span className="font-mono text-xl font-bold text-emerald-700">
                  ₹{Math.round(totalAward).toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 block text-[11px]">
                  Direct Credit Account: {parcel.maskedBankAccount || 'HDFC Bank •••• 4192'}
                </span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Enter 6-digit Aadhaar OTP:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 748291"
                  defaultValue="819204"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-center font-mono text-lg tracking-widest text-slate-900 focus:border-blue-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEsignConsent}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Authorize DBT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Section 64 Reference Objection
                </h3>
                <p className="text-[11px] text-slate-500">
                  Application to Land Acquisition, Rehabilitation and Resettlement Authority
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-slate-700">
                Objection Grounds / Reason for Review:
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                rows={4}
                placeholder="e.g. The market value rate adopted does not reflect adjacent commercial highway sale deeds; fruit-bearing mango trees undervalued..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFileDispute}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Submit Formal Objection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
