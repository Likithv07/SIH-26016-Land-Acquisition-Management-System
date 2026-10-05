import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Printer,
  ChevronLeft,
  FileCheck,
  Building2,
  CreditCard,
  HeartHandshake,
  ShieldCheck,
  Home,
  GraduationCap,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  FileText,
  BadgePercent,
  TrendingUp,
} from 'lucide-react';

interface ChoiceOption {
  id: 'option_1' | 'option_2' | 'option_3';
  code: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  monetaryBenefit: number;
  monetaryBreakdown: string;
  rrBenefits: string[];
  rrValue: number;
  totalPackageValue: number;
  timeline: string;
  dbtPayment: string;
  eligibility: string;
  importantConditions: string[];
  recommendedFor: string;
  benefitsList: { title: string; desc: string }[];
}

interface SubmittedChoiceRecord {
  choiceId: 'option_1' | 'option_2' | 'option_3';
  referenceId: string;
  submittedAt: string;
  parcelId: string;
  surveyNumber: string;
  status: 'Choice Submitted';
}

export const CitizenChoiceMatrix: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    setCurrentView,
    showToast,
    addAuditLog,
  } = useApp();

  // Find citizen parcel
  const citizenParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0] || {
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
      status: 'Compensation Pending',
      compensationStatus: 'Pending',
      totalCompensation: 7225000,
      marketValuePerAcre: 2500000,
      multiplierFactor: 1.5,
      assetValuation: 350000,
      compensation: {
        governmentRatePerAcre: 2500000,
        baseCompensation: 6250000,
        solatium: 625000,
        additionalBenefits: 200000,
        rrAssistance: 150000,
        totalCompensation: 7225000,
      },
    };

  const totalComp =
    citizenParcel.totalCompensation ||
    citizenParcel.compensation?.totalCompensation ||
    7225000;

  // Key for local persistence
  const storageKey = `nlams_rr_choice_${citizenParcel.id}`;

  const [selectedOptionId, setSelectedOptionId] = useState<'option_1' | 'option_2' | 'option_3'>('option_1');
  const [currentStep, setCurrentStep] = useState<'select' | 'review' | 'confirm' | 'submitted'>('select');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [submittedChoice, setSubmittedChoice] = useState<SubmittedChoiceRecord | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load existing submitted choice if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: SubmittedChoiceRecord = JSON.parse(saved);
        setSubmittedChoice(parsed);
        setSelectedOptionId(parsed.choiceId);
        setCurrentStep('submitted');
      } else {
        setSubmittedChoice(null);
        setCurrentStep('select');
      }
    } catch (e) {
      // ignore
    }
  }, [citizenParcel.id, storageKey]);

  // Options structured strictly to specifications
  const options: ChoiceOption[] = [
    {
      id: 'option_1',
      code: 'OPT-101',
      title: 'Option 1 — Full Monetary Compensation',
      badge: 'Maximum Cash Payout',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      summary:
        'Immediate 100% monetary award payout with statutory one-time financial rehabilitation grant directly to bank account.',
      monetaryBenefit: totalComp,
      monetaryBreakdown: `Basic land valuation + 100% Solatium (₹${Math.round(totalComp * 0.45).toLocaleString('en-IN')}) + Asset valuation & interest`,
      rrBenefits: [
        'One-time financial grant of ₹5,00,000 in lieu of physical housing/homestead allotment',
        'One-time Cattle-shed & agricultural implements shifting allowance of ₹50,000',
        'Statutory RFCTLARR Stamp Duty exemption on purchase of alternative land within 3 years',
      ],
      rrValue: 550000,
      totalPackageValue: totalComp + 550000,
      timeline: 'Disbursal within 30–45 days via PFMS Direct Benefit Transfer',
      dbtPayment: '100% upfront electronic transfer in 1 or 2 tranches directly to verified Aadhaar-linked bank account',
      eligibility:
        'All title-holding landowners with valid land records; ideal for families with existing secondary housing.',
      importantConditions: [
        'Full and final settlement of all rehabilitation claims under Section 31.',
        'Waives entitlement to state-constructed model colony residential units.',
        'No preferential reservation in government infrastructure employment.',
      ],
      recommendedFor: 'Landowners seeking immediate liquidity, independent resettlement, or reinvestment in private agricultural land.',
      benefitsList: [
        {
          title: 'Direct Bank Transfer (DBT)',
          desc: 'Direct credit through Public Financial Management System (PFMS) with zero intermediary deductions.',
        },
        {
          title: 'Statutory Tax Exemption',
          desc: '100% Capital Gains Tax exemption under Section 96 of RFCTLARR Act 2013.',
        },
        {
          title: 'Swift Clearance',
          desc: 'Fastest pipeline to disbursal with no secondary land allotment queues.',
        },
      ],
    },
    {
      id: 'option_2',
      code: 'OPT-202',
      title: 'Option 2 — Compensation + R&R Package',
      badge: 'Balanced Livelihood Security',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      summary:
        'Full statutory compensation award combined with monthly subsistence allowance, cattle grant, and guaranteed family skill/livelihood training.',
      monetaryBenefit: totalComp,
      monetaryBreakdown: `Full statutory cash award of ₹${totalComp.toLocaleString('en-IN')} via PFMS`,
      rrBenefits: [
        'Subsistence Allowance: ₹3,000 per month for 12 months (₹36,000 total)',
        'One-time Resettlement & Cattle-shed Transportation Grant: ₹75,000',
        'Mandatory Annuity / Lump-sum R&R Assistance: ₹5,00,000',
        'Livelihood & Skill Support: Free certified training for 2 family members under PMKVY / NSDC with job-placement facilitation or ₹50,000 tool-kit grant',
      ],
      rrValue: 661000,
      totalPackageValue: totalComp + 661000,
      timeline:
        'Core award in 30–45 days; monthly subsistence begins immediately after award; skill training enrollment within 60 days',
      dbtPayment:
        'Core award credited upfront; subsistence disbursed monthly on the 1st of every month through PFMS schedule',
      eligibility:
        'Affected farming families whose primary agricultural livelihood is displaced or impacted by corridor alignment.',
      importantConditions: [
        'Subsistence allowance is non-transferable and requires active living verification.',
        'Nominee for vocational training must be between 18–45 years of age and listed in Family Card.',
        'Requires submission of family livelihood profile certificate to CALA cell.',
      ],
      recommendedFor: 'Farming households wanting full monetary recovery while safeguarding family livelihood transition and skill enhancement.',
      benefitsList: [
        {
          title: 'Guaranteed 12-Month Subsistence',
          desc: 'Direct monthly support buffer ensuring smooth household transition during acquisition.',
        },
        {
          title: 'Certified Skill Development',
          desc: 'Accredited vocational credentials across engineering, agro-tech, or logistics trades.',
        },
        {
          title: 'Full Award Intact',
          desc: 'No reduction in base monetary compensation award.',
        },
      ],
    },
    {
      id: 'option_3',
      code: 'OPT-303',
      title: 'Option 3 — Alternative Rehabilitation / Asset Package',
      badge: 'Physical Asset & Housing Allocation',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary:
        'Allotment of a developed residential homestead plot or constructed PMAY-G pucca house in Model R&R Colony plus balance cash compensation.',
      monetaryBenefit: Math.max(0, totalComp - 1500000),
      monetaryBreakdown: `Adjusted cash component of ₹${Math.max(0, totalComp - 1500000).toLocaleString('en-IN')} (balance after asset allotment deduction)`,
      rrBenefits: [
        'Allotment of 1 Developed Residential Plot (150 sq. yards) in Government Model R&R Township (Asset Value: ~₹18,00,000)',
        'Full waiver of stamp duty, transfer fees, and title registration costs',
        'Piped potable drinking water, 3-phase electricity, approach concrete road, and community center access',
        'One-time physical shifting allowance & dislocation grant: ₹1,50,000',
      ],
      rrValue: 1950000,
      totalPackageValue: Math.max(0, totalComp - 1500000) + 1950000,
      timeline:
        'Provisional allotment letter issued within 45 days; physical possession of developed site in 6–9 months; cash component in 45 days',
      dbtPayment: 'Net adjusted monetary award credited via PFMS in 45 days; asset title deed registered within 90 days',
      eligibility:
        'Rural families losing primary dwelling homestead or residing within 200m corridor demarcated for physical acquisition.',
      importantConditions: [
        'Allotted plot/house is subject to a statutory lock-in period of 10 years before resale is permissible.',
        'Title deed is mandatorily registered jointly in the name of head of family and spouse.',
        'Requires physical handover of existing structures prior to township allotment possession.',
      ],
      recommendedFor: 'Families losing their primary homestead who require permanent, structured shelter with modern civic infrastructure.',
      benefitsList: [
        {
          title: 'Permanent Real Estate Asset',
          desc: 'High-value clear-title residential property in planned government rehabilitation enclave.',
        },
        {
          title: 'Civic Infrastructure Included',
          desc: 'Roads, power, sewage, schools, and health sub-centers integrated into layout.',
        },
        {
          title: '100% Government Regulated',
          desc: 'Zero legal disputes; freehold registration under CALA supervision.',
        },
      ],
    },
  ];

  const selectedOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleSelectOption = (optId: 'option_1' | 'option_2' | 'option_3') => {
    setSelectedOptionId(optId);
  };

  const handleProceedToReview = () => {
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConfirmModal = () => {
    setAgreementChecked(false);
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = () => {
    const refId = `RR-OPT-2026-${citizenParcel.surveyNumber.replace(/\//g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const submissionDate = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';

    const newRecord: SubmittedChoiceRecord = {
      choiceId: selectedOptionId,
      referenceId: refId,
      submittedAt: submissionDate,
      parcelId: citizenParcel.id,
      surveyNumber: citizenParcel.surveyNumber,
      status: 'Choice Submitted',
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(newRecord));
    } catch (e) {
      // ignore
    }

    setSubmittedChoice(newRecord);
    setShowConfirmModal(false);
    setCurrentStep('submitted');

    // Add to activity / audit log
    addAuditLog(
      'Submitted Compensation & R&R Choice',
      'Citizen Portal - Choice Matrix',
      `Selected ${selectedOption.title} (Ref: ${refId}, Val: ₹${selectedOption.totalPackageValue.toLocaleString('en-IN')})`,
      citizenParcel.id
    );

    showToast(`Compensation & R&R choice submitted! Ref ID: ${refId}`, 'success');
  };

  const handleResetChoice = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      // ignore
    }
    setSubmittedChoice(null);
    setCurrentStep('select');
    showToast('Choice selection unlocked for reassessment.', 'info');
  };

  const handleDownloadAcknowledgement = () => {
    const choice = submittedChoice
      ? options.find((o) => o.id === submittedChoice.choiceId) || selectedOption
      : selectedOption;
    const refId = submittedChoice?.referenceId || `RR-OPT-2026-${citizenParcel.surveyNumber.replace(/\//g, '')}-7192`;
    const subDate = submittedChoice?.submittedAt || new Date().toLocaleString('en-IN');

    const textContent = `================================================================================
GOVERNMENT OF INDIA - MINISTRY OF ROAD TRANSPORT & HIGHWAYS
COMPETENT AUTHORITY FOR LAND ACQUISITION (CALA)
FORM 18-R: STATUTORY COMPENSATION & R&R CHOICE ACKNOWLEDGEMENT
[Under Section 31 & Second Schedule of RFCTLARR Act, 2013]
================================================================================
CHOICE REFERENCE ID     : ${refId}
SUBMISSION STATUS       : CHOICE SUBMITTED (LOCKED & RECORDED)
SUBMISSION TIMESTAMP    : ${subDate}
PARCEL IDENTIFIER       : ${citizenParcel.id}
SURVEY NUMBER           : ${citizenParcel.surveyNumber}
BENEFICIARY / LANDOWNER : ${citizenParcel.landownerName}
AADHAAR (MASKED)        : ${citizenParcel.maskedAadhaar}
REGISTERED MOBILE       : ${citizenParcel.landownerMobile}
VILLAGE / MANDAL        : ${citizenParcel.village}, Mandal: Ghatkesar, Dist: ${citizenParcel.district}
INFRASTRUCTURE PROJECT  : ${citizenParcel.projectName} (${citizenParcel.projectId})
ACQUIRED LAND AREA      : ${citizenParcel.areaAcres} Acres (${citizenParcel.landType})
================================================================================
SELECTED OPTION DETAILS
================================================================================
SELECTED PACKAGE        : ${choice.title}
PACKAGE CODE            : ${choice.code}
PACKAGE CATEGORY        : ${choice.badge}
CORE MONETARY COMPONENT : ₹${choice.monetaryBenefit.toLocaleString('en-IN')}
R&R BENEFIT VALUE       : ₹${choice.rrValue.toLocaleString('en-IN')}
TOTAL ESTIMATED VALUE   : ₹${choice.totalPackageValue.toLocaleString('en-IN')}
DISBURSAL TIMELINE      : ${choice.timeline}
DBT ROUTE               : ${choice.dbtPayment}
--------------------------------------------------------------------------------
SPECIFIED R&R ENTITLEMENTS:
${choice.rrBenefits.map((b, idx) => `  ${idx + 1}. ${b}`).join('\n')}

MANDATORY CONDITIONS & UNDERTAKINGS:
${choice.importantConditions.map((c, idx) => `  [•] ${c}`).join('\n')}
================================================================================
DISBURSAL BANK MANDATE
Bank Account            : ${citizenParcel.maskedBankAccount || 'HDFC Bank - •••• •••• 4192'}
PFMS DBT Route          : Authorized under Cal/PFMS/2026/RR-DIRECT
Digital Verification    : Validated against National Land Cadastre (NLAMS)
Digital Hash            : SHA256:${refId.replace(/-/g, '')}aa482910fd394
================================================================================
OFFICIAL NOTICE:
This acknowledgement confirms that the beneficiary's choice of Rehabilitation &
Resettlement has been recorded in the central database of CALA and forwarded
to the District Collectorate for final statutory award execution.
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Choice_Acknowledgement_${citizenParcel.surveyNumber.replace(/\//g, '_')}_${refId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded Official Choice Acknowledgement: ${refId}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-slate-800">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Citizen Portal</span>
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-mono text-emerald-800 uppercase font-bold tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              RFCTLARR 2013 Section 31
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale className="w-7 h-7 text-emerald-700" />
            <span>Compensation &amp; R&amp;R Choice Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Select your statutory Rehabilitation &amp; Resettlement entitlement package for Survey No.{' '}
            <strong className="text-slate-900 font-mono font-semibold">{citizenParcel.surveyNumber}</strong>
          </p>
        </div>

        {/* Parcel Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-2xs">
            <span className="text-slate-500 font-medium">Selected Parcel:</span>
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
        </div>
      </div>

      {/* Step Progress Stepper */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1: Select */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep === 'select'
                  ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentStep === 'select' ? '1' : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <span className="text-xs font-semibold text-slate-900 mt-1.5">Select Option</span>
            <span className="text-[10px] text-slate-500">Compare 3 Packages</span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
              currentStep !== 'select' ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          />

          {/* Step 2: Review */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep === 'review'
                  ? 'bg-blue-700 text-white shadow-md ring-4 ring-blue-100'
                  : currentStep === 'confirm' || currentStep === 'submitted'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {currentStep === 'submitted' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <span className="text-xs font-semibold text-slate-900 mt-1.5">Review Choice</span>
            <span className="text-[10px] text-slate-500">Legal Verification</span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
              currentStep === 'submitted' ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          />

          {/* Step 3: Submitted */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                currentStep === 'submitted'
                  ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              {currentStep === 'submitted' ? <CheckCircle2 className="w-5 h-5" /> : '3'}
            </div>
            <span className="text-xs font-semibold text-slate-900 mt-1.5">Confirmation</span>
            <span className="text-[10px] text-slate-500">Order &amp; Receipt</span>
          </div>
        </div>
      </div>

      {/* Citizen & Parcel Baseline Information Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono text-blue-900 uppercase font-bold tracking-wider">
              Statutory Beneficiary Profile
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Land Parcel Baseline &amp; Entitlement Credentials
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>R&amp;R Eligible (Schedule II)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-0.5">Parcel ID</span>
            <span className="font-mono font-bold text-blue-950 truncate block" title={citizenParcel.id}>
              {citizenParcel.id}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-0.5">Survey Number</span>
            <span className="font-mono font-bold text-slate-900">
              {citizenParcel.surveyNumber}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-0.5">Project</span>
            <span className="font-semibold text-slate-900 truncate block" title={citizenParcel.projectName}>
              {citizenParcel.projectName}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-0.5">Acquired Area</span>
            <span className="font-mono font-bold text-slate-900">
              {citizenParcel.areaAcres} Acres
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block mb-0.5">Land Type</span>
            <span className="font-semibold text-slate-900">
              {citizenParcel.landType}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-900 block mb-0.5 font-medium">Eligible Compensation</span>
            <span className="font-mono font-extrabold text-emerald-800 text-sm">
              ₹{(totalComp).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-indigo-900 block mb-0.5 font-medium">R&amp;R Eligibility</span>
            <span className="font-bold text-indigo-950">
              Direct Land Loser
            </span>
          </div>
        </div>
      </div>

      {/* SUBMITTED STATE VIEW (When choice is already confirmed/submitted) */}
      {currentStep === 'submitted' && submittedChoice && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-emerald-500/70 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white uppercase tracking-wider">
                    Status: {submittedChoice.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Recorded on Central CALA Ledger
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Rehabilitation &amp; Resettlement Choice Locked
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadAcknowledgement}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-2xs btn-hover transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Download Acknowledgement</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Submission Particulars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Choice Reference ID</span>
              <span className="font-mono text-sm font-extrabold text-blue-900">
                {submittedChoice.referenceId}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Selected Option</span>
              <span className="font-bold text-slate-900 block truncate" title={selectedOption.title}>
                {selectedOption.title}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">{selectedOption.badge}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Parcel &amp; Survey Number</span>
              <span className="font-mono font-bold text-slate-900">
                {citizenParcel.id} (Sy: {citizenParcel.surveyNumber})
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-1">Submission Date / Time</span>
              <span className="font-mono font-semibold text-slate-800">
                {submittedChoice.submittedAt}
              </span>
            </div>
          </div>

          {/* Option Summary Card */}
          <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/70 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                  Option Particulars
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedOption.title}</h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-slate-500 block">Total Package Value</span>
                <span className="font-mono text-xl font-extrabold text-emerald-800">
                  ₹{selectedOption.totalPackageValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Monetary &amp; DBT Component</span>
                </h4>
                <p className="text-slate-700 mb-1">
                  <strong>Cash Award:</strong> ₹{selectedOption.monetaryBenefit.toLocaleString('en-IN')}
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {selectedOption.dbtPayment}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 font-mono">
                  Bank: {citizenParcel.maskedBankAccount || 'HDFC Bank - •••• •••• 4192'}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-blue-700" />
                  <span>R&amp;R Benefits &amp; Timeline</span>
                </h4>
                <ul className="space-y-1 text-slate-700">
                  {selectedOption.rrBenefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-blue-900 font-semibold mt-2">
                  Timeline: {selectedOption.timeline}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleResetChoice}
              className="text-xs text-slate-600 hover:text-red-700 font-semibold underline transition-colors cursor-pointer"
            >
              Modify or Change Selected Option
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs btn-hover transition-colors cursor-pointer"
            >
              Return to Citizen Dashboard
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT OPTION (Comparison Cards or Table) */}
      {currentStep === 'select' && (
        <div className="space-y-6">
          {/* Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Compare &amp; Select Your Preferred Entitlement
              </h2>
              <p className="text-xs text-slate-500">
                Carefully evaluate the three legally sanctioned options under RFCTLARR 2013. Only one option can be chosen.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs text-xs self-start sm:self-auto">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-blue-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cards View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-blue-700 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Comparison Table
              </button>
            </div>
          </div>

          {/* CARDS VIEW */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`rounded-2xl p-5 sm:p-6 border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-blue-700 shadow-md ring-2 ring-blue-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Top Radio & Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${opt.badgeColor}`}
                        >
                          {opt.badge}
                        </span>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-blue-700 bg-blue-700 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug mb-1">
                        {opt.title}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                        {opt.summary}
                      </p>

                      {/* Package Value Highlight */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">
                          Total Package Value
                        </span>
                        <div className="font-mono text-2xl font-extrabold text-emerald-800 tracking-tight">
                          ₹{opt.totalPackageValue.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 flex justify-between">
                          <span>Monetary: ₹{(opt.monetaryBenefit / 100000).toFixed(2)}L</span>
                          <span>R&amp;R: ₹{(opt.rrValue / 100000).toFixed(2)}L</span>
                        </div>
                      </div>

                      {/* Key Specifics */}
                      <div className="space-y-3 text-xs mb-4">
                        <div>
                          <span className="font-bold text-slate-900 block mb-1">
                            Applicable R&amp;R Benefits:
                          </span>
                          <ul className="space-y-1 text-slate-600">
                            {opt.rrBenefits.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-700 font-bold shrink-0">•</span>
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Disbursal Timeline:
                          </span>
                          <span className="text-slate-600">{opt.timeline}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Eligibility:
                          </span>
                          <span className="text-slate-600">{opt.eligibility}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 block mb-0.5">
                            Key Condition:
                          </span>
                          <span className="text-slate-600 text-[11px] leading-snug">
                            {opt.importantConditions[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Selection Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOption(opt.id);
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                            <span>Option Selected</span>
                          </>
                        ) : (
                          <span>Select This Option</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-700 bg-slate-50 w-1/4">
                      Entitlement Criteria
                    </th>
                    {options.map((opt) => (
                      <th
                        key={opt.id}
                        className={`py-3 px-4 font-bold w-1/4 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/70 text-blue-900 border-x border-blue-200'
                            : 'text-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{opt.code}</span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold ${opt.badgeColor}`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <div className="text-sm font-extrabold">{opt.title.split('—')[1]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Total Package Value
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 font-mono font-bold text-sm ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 text-emerald-800 border-x border-blue-200'
                            : 'text-slate-900'
                        }`}
                      >
                        ₹{opt.totalPackageValue.toLocaleString('en-IN')}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Monetary Cash Award
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        <span className="font-mono font-bold text-slate-900">
                          ₹{opt.monetaryBenefit.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {opt.monetaryBreakdown}
                        </p>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Applicable R&amp;R Benefits
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        <ul className="space-y-1 text-slate-700">
                          {opt.rrBenefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-700 font-bold">•</span>
                              <span className="text-[11px] leading-snug">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      DBT Payment Mode
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 text-slate-700 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        {opt.dbtPayment}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Disbursal Timeline
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 font-medium text-slate-800 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        {opt.timeline}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Eligibility &amp; Conditions
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 text-slate-600 text-[11px] leading-relaxed ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        <strong className="text-slate-800 block mb-0.5">Eligibility:</strong>
                        {opt.eligibility}
                        <strong className="text-slate-800 block mt-1.5 mb-0.5">Condition:</strong>
                        {opt.importantConditions[0]}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 bg-slate-50">
                      Selection Action
                    </td>
                    {options.map((opt) => (
                      <td
                        key={opt.id}
                        className={`py-3 px-4 ${
                          selectedOptionId === opt.id
                            ? 'bg-blue-50/40 border-x border-blue-200'
                            : ''
                        }`}
                      >
                        <button
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            selectedOptionId === opt.id
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          }`}
                        >
                          {selectedOptionId === opt.id ? '✓ Selected' : 'Select'}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Sticky or Bottom Action Bar to Proceed */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  Currently Chosen:
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {selectedOption.title} — ₹{selectedOption.totalPackageValue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleProceedToReview}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 btn-hover transition-colors cursor-pointer"
              >
                <span>Proceed to Review Choice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW CHOICE */}
      {currentStep === 'review' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-blue-900 uppercase font-bold tracking-wider">
                  Step 2 of 3 • Review &amp; Statutory Declaration
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                  Review Your Selected Choice
                </h2>
                <p className="text-xs text-slate-600">
                  Review all benefits, schedules, and conditions before final submission to CALA.
                </p>
              </div>

              <button
                onClick={() => setCurrentStep('select')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Change Selected Option</span>
              </button>
            </div>

            {/* Selected Option Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/70 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
                    {selectedOption.code} • {selectedOption.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedOption.title}</h3>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">
                    Total Estimated Package Value
                  </span>
                  <span className="font-mono text-2xl font-extrabold text-emerald-800">
                    ₹{selectedOption.totalPackageValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left Column: Financials */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Monetary &amp; Payment Particulars</span>
                  </h4>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Core Monetary Award:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{selectedOption.monetaryBenefit.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">R&amp;R Financial Component:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        ₹{selectedOption.rrValue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Disbursal Route:</span>
                      <span className="font-semibold text-blue-900">Direct Benefit Transfer (PFMS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Timeline:</span>
                      <span className="font-semibold text-slate-800">{selectedOption.timeline}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800 block mb-1">Target Beneficiary Bank Mandate:</strong>
                    <div>Bank: {citizenParcel.maskedBankAccount || 'HDFC Bank - •••• •••• 4192'}</div>
                    <div>IFSC: HDFC0001892 (PFMS Electronic Mandate Verified)</div>
                  </div>
                </div>

                {/* Right Column: R&R Benefits & Conditions */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-blue-700" />
                    <span>Applicable R&amp;R Entitlements</span>
                  </h4>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <ul className="space-y-1.5 text-slate-700">
                      {selectedOption.rrBenefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Statutory Conditions &amp; Undertakings</span>
                  </h4>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-950">
                    <ul className="space-y-1">
                      {selectedOption.importantConditions.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-800 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep('select')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                ← Back to Selection
              </button>

              <button
                onClick={handleOpenConfirmModal}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs flex items-center gap-2 btn-hover transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm &amp; Submit Choice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-lg w-full p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Confirm Statutory R&amp;R Choice
                </h3>
                <p className="text-[11px] text-slate-500">
                  Legal submission to Competent Authority for Land Acquisition (CALA)
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Option:</span>
                  <span className="font-bold text-slate-900">{selectedOption.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parcel ID:</span>
                  <span className="font-mono font-bold text-blue-900">{citizenParcel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Survey Number:</span>
                  <span className="font-mono font-bold text-slate-900">
                    Sy {citizenParcel.surveyNumber} ({citizenParcel.village})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Package Value:</span>
                  <span className="font-mono font-extrabold text-emerald-800 text-sm">
                    ₹{selectedOption.totalPackageValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                By confirming, you submit your formal option preference under Section 31 and the Second
                Schedule of the Right to Fair Compensation and Transparency in Land Acquisition,
                Rehabilitation and Resettlement Act, 2013.
              </p>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                />
                <span className="text-[11px] text-blue-950 font-medium leading-relaxed">
                  I hereby declare that I have evaluated the eligible options and willingly select{' '}
                  <strong className="font-bold">{selectedOption.title}</strong> as full and final
                  determination for Survey No. {citizenParcel.surveyNumber}.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!agreementChecked}
                onClick={handleFinalSubmit}
                className={`px-5 py-2 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  agreementChecked
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white btn-hover'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit &amp; Generate Ref ID</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
