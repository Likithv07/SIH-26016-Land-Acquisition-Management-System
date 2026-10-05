import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { LandParcel } from '../../types';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Download,
  FileText,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Fingerprint,
  Building2,
  TreePine,
  Home,
  Droplets,
  Printer,
  ChevronRight,
  Info,
  Scale,
  Calendar,
  Layers,
  Search,
} from 'lucide-react';

export const CompensationApproval: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    updateCompensation,
    approveCompensation,
    rejectCompensation,
    showToast,
    userRole,
  } = useApp();

  // Active view tab inside compensation portal
  const [activeTab, setActiveTab] = useState<'calculator' | 'review' | 'assets' | 'register'>('calculator');

  // Fallback safe parcel to prevent any undefined crashes
  const fallbackParcel: LandParcel = {
    id: 'TS-HYD-2026-001245',
    surveyNumber: '145/2',
    projectId: 'NLA-TS-2026-001',
    projectName: 'Hyderabad–Vijayawada Expressway',
    landownerName: 'Rajesh Kumar',
    landownerMobile: '+91 98765 43210',
    landownerAddress: 'Plot 42, Gram Panchayat Road, Ghatkesar, Hyderabad',
    maskedAadhaar: 'XXXX-XXXX-8921',
    landownerAadhaar: 'XXXX-XXXX-8921',
    maskedBankAccount: 'HDFC Bank - •••• •••• 4192',
    state: 'Telangana',
    district: 'Hyderabad',
    village: 'Ghatkesar',
    areaAcres: 2.5,
    landType: 'Agricultural',
    acquisitionStatus: 'Compensation Pending',
    status: 'Compensation Pending',
    compensationStatus: 'Pending',
    possessionStatus: 'Demarcated',
    lastUpdated: '2026-09-08 14:32 IST',
    marketValuePerAcre: 2500000,
    multiplierFactor: 1.5,
    assetValuation: 350000,
    totalCompensation: 7225000,
    polygonCoords: [
      [380, 240],
      [440, 230],
      [470, 280],
      [410, 310],
      [360, 270],
    ],
    center: [412, 266],
    compensation: {
      governmentRatePerAcre: 2500000,
      baseCompensation: 6250000,
      solatium: 625000,
      additionalBenefits: 200000,
      rrAssistance: 150000,
      totalCompensation: 7225000,
      officerRemarks: 'Clear ancestral title verified. No encumbrances found in MeeSeva registry.',
      internalNotes: 'Recommended for priority electronic disbursement under Special SIH corridor incentive.',
    },
  };

  const selectedParcel: LandParcel =
    (landParcels && landParcels.find((p) => p.id === selectedParcelId)) ||
    (landParcels && landParcels[0]) ||
    fallbackParcel;

  // Helpers for safe defaults
  const getSafeMarketRate = (p: LandParcel) =>
    p.marketValuePerAcre || p.compensation?.governmentRatePerAcre || 2500000;
  const getSafeMultiplier = (p: LandParcel) =>
    p.multiplierFactor || (p.landType === 'Commercial' ? 1.25 : p.landType === 'Residential' ? 1.25 : 1.5);
  const getSafeAssetVal = (p: LandParcel) =>
    p.assetValuation || p.compensation?.additionalBenefits || 350000;
  const getSafeArea = (p: LandParcel) => p.areaAcres || 2.5;

  // Local state for interactive calculation inputs
  const [landArea, setLandArea] = useState<number>(getSafeArea(selectedParcel));
  const [marketValuePerUnit, setMarketValuePerUnit] = useState<number>(getSafeMarketRate(selectedParcel));
  const [multiplierFactor, setMultiplierFactor] = useState<number>(getSafeMultiplier(selectedParcel));
  const [assetValuation, setAssetValuation] = useState<number>(getSafeAssetVal(selectedParcel));
  const [solatiumPct, setSolatiumPct] = useState<number>(100);
  const [interestPct, setInterestPct] = useState<number>(12);
  const [interestMonths, setInterestMonths] = useState<number>(10); // months elapsed since Section 3A

  // Detailed Asset breakdown
  const [treesValuation, setTreesValuation] = useState<number>(120000);
  const [structuresValuation, setStructuresValuation] = useState<number>(150000);
  const [wellsValuation, setWellsValuation] = useState<number>(80000);

  // Sync state whenever parcel changes
  useEffect(() => {
    if (selectedParcel) {
      setLandArea(getSafeArea(selectedParcel));
      setMarketValuePerUnit(getSafeMarketRate(selectedParcel));
      setMultiplierFactor(getSafeMultiplier(selectedParcel));
      const totalAssets = getSafeAssetVal(selectedParcel);
      setAssetValuation(totalAssets);
      setTreesValuation(Math.round(totalAssets * 0.35));
      setStructuresValuation(Math.round(totalAssets * 0.45));
      setWellsValuation(Math.round(totalAssets * 0.20));
      setSolatiumPct(100);
      setInterestPct(12);
    }
  }, [selectedParcel?.id]);

  // Update total assets when sub-items change
  const handleUpdateAssetSubItem = (type: 'trees' | 'struct' | 'wells', val: number) => {
    const num = Math.max(0, val);
    let newTrees = treesValuation;
    let newStruct = structuresValuation;
    let newWells = wellsValuation;

    if (type === 'trees') newTrees = num;
    if (type === 'struct') newStruct = num;
    if (type === 'wells') newWells = num;

    setTreesValuation(newTrees);
    setStructuresValuation(newStruct);
    setWellsValuation(newWells);
    const sum = newTrees + newStruct + newWells;
    setAssetValuation(sum);
  };

  // Preset Handler
  const applyPreset = (zone: 'rural' | 'semi' | 'urban' | 'remote') => {
    if (zone === 'urban') {
      setMultiplierFactor(1.0);
      showToast('Applied Urban Zone Preset (Multiplier: 1.00x)', 'info');
    } else if (zone === 'semi') {
      setMultiplierFactor(1.25);
      showToast('Applied Semi-Urban Peri-Metropolitan Preset (Multiplier: 1.25x)', 'info');
    } else if (zone === 'rural') {
      setMultiplierFactor(1.5);
      showToast('Applied Standard Rural Zone Preset (Multiplier: 1.50x)', 'info');
    } else if (zone === 'remote') {
      setMultiplierFactor(2.0);
      showToast('Applied Remote Rural Zone (>25km) Preset (Multiplier: 2.00x)', 'info');
    }
  };

  // RFCTLARR 2013 Statutory Calculations (Section 26 - 30)
  const basicLandValue = (landArea || 0) * (marketValuePerUnit || 0);
  const multipliedLandValue = basicLandValue * (multiplierFactor || 1.0);
  const marketValuePlusAssets = multipliedLandValue + (assetValuation || 0);
  const solatiumAmount = marketValuePlusAssets * ((solatiumPct || 100) / 100);
  // Section 30(3): 12% per annum on base multiplied market value for duration from Section 3A to award date
  const interestAmount = multipliedLandValue * ((interestPct || 12) / 100) * ((interestMonths || 10) / 12);
  const totalCalculated = marketValuePlusAssets + solatiumAmount + interestAmount;

  // Modals for approval and revision
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showGazettePreview, setShowGazettePreview] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [digitalSignConsent, setDigitalSignConsent] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleApplyCalculationToParcel = () => {
    updateCompensation(selectedParcel.id, {
      governmentRatePerAcre: marketValuePerUnit,
      baseCompensation: multipliedLandValue,
      solatium: solatiumAmount,
      additionalBenefits: assetValuation,
      rrAssistance: 150000,
      totalCompensation: totalCalculated,
      areaAcres: landArea,
      marketValuePerAcre: marketValuePerUnit,
      multiplierFactor: multiplierFactor,
      assetValuation: assetValuation,
    });
    showToast(`Formulation saved for Parcel ${selectedParcel.id} (Total: ₹${Math.round(totalCalculated).toLocaleString('en-IN')})`, 'success');
  };

  const handleConfirmApproval = () => {
    if (!digitalSignConsent) {
      showToast('Please check the digital signature compliance box', 'warning');
      return;
    }
    approveCompensation(selectedParcel.id, 'NIC-DSC-GOV-2026-9812');
    setShowApprovalModal(false);
    setDigitalSignConsent(false);
  };

  const handleConfirmRevision = () => {
    if (!revisionNotes.trim()) {
      showToast('Please state statutory reasons for revision request', 'warning');
      return;
    }
    rejectCompensation(selectedParcel.id, revisionNotes);
    setShowRevisionModal(false);
    setRevisionNotes('');
  };

  // Filtered parcels for table/switcher
  const filteredParcels = (landParcels || []).filter(
    (p) =>
      p.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.landownerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.surveyNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.village.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              RFCTLARR Statutory Valuation & Award Section
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Section 26–31 Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Statutory Land Acquisition Award Calculation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Formulation of legally binding compensation awards under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowGazettePreview(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Form 16-B Gazette Award</span>
          </button>
          <button
            onClick={handleApplyCalculationToParcel}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply Formulation</span>
          </button>
        </div>
      </div>

      {/* Parcel Selection Bar & Status Strip */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold text-slate-700">Target Parcel:</span>
          </div>
          <select
            value={selectedParcel.id}
            onChange={(e) => {
              setSelectedParcelId(e.target.value);
              const p = landParcels.find((lp) => lp.id === e.target.value);
              if (p) {
                setLandArea(getSafeArea(p));
                setMarketValuePerUnit(getSafeMarketRate(p));
                setMultiplierFactor(getSafeMultiplier(p));
                const totalAssets = getSafeAssetVal(p);
                setAssetValuation(totalAssets);
                setTreesValuation(Math.round(totalAssets * 0.35));
                setStructuresValuation(Math.round(totalAssets * 0.45));
                setWellsValuation(Math.round(totalAssets * 0.20));
              }
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-semibold focus:outline-none focus:border-blue-700 focus:bg-white min-w-[260px]"
          >
            {(landParcels || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.landownerName} (Sy: {p.surveyNumber}, {p.areaAcres} Ac)
              </option>
            ))}
          </select>
          <StatusBadge status={selectedParcel.compensationStatus} />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Landowner:</span>
          <span className="font-semibold text-slate-900">{selectedParcel.landownerName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Village:</span>
          <span className="font-semibold text-slate-900">{selectedParcel.village}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Acreage:</span>
          <span className="font-mono font-bold text-blue-900">{selectedParcel.areaAcres} Ac</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'calculator'
                ? 'border-blue-700 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-700" />
            <span>Statutory Award Calculator (Sec 26–30)</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'review'
                ? 'border-blue-700 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Officer Statutory Review & Seal</span>
          </button>

          <button
            onClick={() => setActiveTab('assets')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'assets'
                ? 'border-blue-700 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TreePine className="w-4 h-4 text-amber-600" />
            <span>Attached Assets & Trees Valuation</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'register'
                ? 'border-blue-700 text-blue-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Consolidated Award Gazette (Sec 31)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STATUTORY AWARD CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Formula Engine */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-700" />
                <h2 className="text-base font-bold text-slate-900">
                  Form 16-B Interactive Valuation Engine
                </h2>
              </div>
              <button
                onClick={() => {
                  setLandArea(getSafeArea(selectedParcel));
                  setMarketValuePerUnit(getSafeMarketRate(selectedParcel));
                  setMultiplierFactor(getSafeMultiplier(selectedParcel));
                  const totalAssets = getSafeAssetVal(selectedParcel);
                  setAssetValuation(totalAssets);
                  setTreesValuation(Math.round(totalAssets * 0.35));
                  setStructuresValuation(Math.round(totalAssets * 0.45));
                  setWellsValuation(Math.round(totalAssets * 0.20));
                  setSolatiumPct(100);
                  setInterestPct(12);
                  setInterestMonths(10);
                  showToast('Reset to statutory base values', 'info');
                }}
                className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Gazette Base</span>
              </button>
            </div>

            {/* Quick Regional Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Distance Multiplier Factor Presets (First Schedule RFCTLARR):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('urban')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    multiplierFactor === 1.0
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Factor 1.00x</span>
                  Urban Municipal
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('semi')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    multiplierFactor === 1.25
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Factor 1.25x</span>
                  Peri-Urban (0-10km)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('rural')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    multiplierFactor === 1.5
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Factor 1.50x</span>
                  Rural (10-25km)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('remote')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                    multiplierFactor === 2.0
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="block text-[10px] text-slate-500">Factor 2.00x</span>
                  Remote (&gt;25km)
                </button>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Acquired Land Area (Acres)</span>
                  <span className="text-[11px] text-blue-800 font-mono">Sec. 26(1)</span>
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  value={landArea}
                  onChange={(e) => setLandArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Market Value Rate (₹ / Acre)</span>
                  <span className="text-[11px] text-blue-800 font-mono">Higher of Ready Reckoner</span>
                </label>
                <input
                  type="number"
                  step="50000"
                  min="10000"
                  value={marketValuePerUnit}
                  onChange={(e) => setMarketValuePerUnit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statutory Multiplier Factor
                </label>
                <select
                  value={multiplierFactor}
                  onChange={(e) => setMultiplierFactor(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-medium focus:border-blue-700 focus:bg-white focus:outline-none"
                >
                  <option value={1.0}>1.00 - Urban Municipal Authority Zone</option>
                  <option value={1.25}>1.25 - Peri-Urban Corridor (0 - 10 km)</option>
                  <option value={1.5}>1.50 - Standard Rural Zone (10 - 25 km)</option>
                  <option value={2.0}>2.00 - Deep Rural Interior Zone (&gt; 25 km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Attached Assets Valuation (₹)</span>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className="text-[11px] text-blue-700 hover:underline font-medium"
                  >
                    Itemize Assets →
                  </button>
                </label>
                <input
                  type="number"
                  step="25000"
                  value={assetValuation}
                  onChange={(e) => setAssetValuation(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mandatory Solatium (Section 30(1))
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={solatiumPct}
                    onChange={(e) => setSolatiumPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-medium">
                    % (Statutory 100%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Section 30(3) 12% Interest</span>
                  <span className="text-[11px] text-slate-500">{interestMonths} Months elapsed</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={interestMonths}
                    min="1"
                    max="60"
                    onChange={(e) => setInterestMonths(parseFloat(e.target.value) || 1)}
                    placeholder="Months"
                    className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-sm text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                  />
                  <span className="self-center text-xs text-slate-500">months @ 12% p.a.</span>
                </div>
              </div>
            </div>

            {/* Output Calculated Compensation Breakdown */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs border-b border-blue-200/80 pb-2">
                <span className="font-bold text-blue-950 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-blue-700" />
                  <span>Calculated Statutory Award Breakdown</span>
                </span>
                <span className="text-blue-800 font-semibold text-[11px]">First Schedule RFCTLARR 2013</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Basic Land Value ({landArea} Ac × ₹{marketValuePerUnit.toLocaleString('en-IN')}):</span>
                <span className="font-mono text-slate-900 font-medium">
                  ₹{Math.round(basicLandValue).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-600">
                  Multiplied Land Value (Factor × {multiplierFactor}):
                </span>
                <span className="font-mono text-blue-900 font-bold">
                  ₹{Math.round(multipliedLandValue).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-600">Valuation of Assets Attached to Land (Sec 29):</span>
                <span className="font-mono text-slate-900 font-medium">
                  ₹{Math.round(assetValuation).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-600">
                  100% Solatium (Sec 30(1) on Multiplied Land + Assets):
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  ₹{Math.round(solatiumAmount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-600">
                  12% p.a. Additional Interest (Sec 30(3) for {interestMonths} mos):
                </span>
                <span className="font-mono text-indigo-700 font-bold">
                  ₹{Math.round(interestAmount).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 border-t border-blue-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Gross Statutory Award (Section 31):</span>
                <span className="text-xl font-bold font-mono text-emerald-700 tracking-tight">
                  ₹{Math.round(totalCalculated).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleApplyCalculationToParcel}
              className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply & Save Statutory Formulation into Land Record</span>
            </button>
          </div>

          {/* Right Column: Statutory Summary & Quick Action Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Award Dossier Summary
                  </h2>
                </div>
                <StatusBadge status={selectedParcel.compensationStatus} />
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Primary Landowner Entity</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedParcel.landownerName}</span>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>Aadhaar: <strong className="font-mono text-slate-700">{selectedParcel.maskedAadhaar || selectedParcel.landownerAadhaar || 'XXXX-XXXX-8921'}</strong></span>
                    <span>Bank: <strong className="text-slate-700">{selectedParcel.maskedBankAccount || 'SBI •••• 9811'}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Survey Number</span>
                    <span className="text-slate-900 font-mono font-bold">{selectedParcel.surveyNumber}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Village / Mandal</span>
                    <span className="text-slate-900 font-semibold">{selectedParcel.village}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-900 font-semibold block text-[11px]">Active Registered Total Award</span>
                  <span className="font-mono text-2xl font-bold text-emerald-700">
                    ₹{Math.round(selectedParcel.compensation?.totalCompensation || selectedParcel.totalCompensation || totalCalculated).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-800 block mt-0.5">
                    Ready for PFMS Direct Benefit Transfer treasury disbursal
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-700 font-semibold block mb-2">
                    Verified Statutory Enclosures:
                  </span>
                  <div className="space-y-1.5">
                    {[
                      'Form 16-B Field Valuation Report (Certified)',
                      'Title Deed Extract (Pahani / ROR-1B)',
                      'Joint Inspection Committee Signature Register',
                      'Geo-tagged Boundary Cadastral Polygon',
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2.5">
                {selectedParcel.compensationStatus === 'Approved' ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-900">Compensation Award Digitally Sealed</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Approved by {selectedParcel.compensation?.approvedBy || 'Special Land Acquisition Officer (CALA)'} on{' '}
                      {selectedParcel.compensation?.approvalDate || '2026-09-02'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => setShowApprovalModal(true)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Award</span>
                    </button>

                    <button
                      onClick={() => setShowRevisionModal(true)}
                      className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Request Rev.</span>
                    </button>

                    <button
                      onClick={() => {
                        rejectCompensation(selectedParcel.id, 'Title discrepancy found in survey records');
                      }}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Statutory Reference Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Info className="w-4 h-4 text-blue-700" />
                <span>RFCTLARR Act 2013 Legal Anchors:</span>
              </div>
              <p className="leading-relaxed">
                <strong>Section 26:</strong> Determination of market value by Competent Authority. Higher of circle rate vs 3-year registered sale deed average.
              </p>
              <p className="leading-relaxed">
                <strong>Section 30(1):</strong> Mandatory statutory solatium of 100% added to total market value of land and attached assets.
              </p>
              <p className="leading-relaxed">
                <strong>Section 31:</strong> Gazette publication and personal notice of certified final compensation awards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFICER STATUTORY REVIEW & DIGITAL SEAL */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <span>Competent Authority (CALA) Digital Award Determination</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Statutory gazette issuance pursuant to Section 31 of RFCTLARR Act 2013
                </p>
              </div>
              <StatusBadge status={selectedParcel.compensationStatus} />
            </div>

            {/* Official Inspection Checkpoints */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider font-mono text-[11px]">
                Pre-Award Statutory Compliance Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: 'Revenue Pahani / ROR-1B Verification',
                    status: 'Certified',
                    date: '04 Aug 2026',
                    officer: 'Tahsildar Ghatkesar',
                  },
                  {
                    title: 'Drone LiDAR Joint Boundary Demarcation',
                    status: 'Completed',
                    date: '18 Aug 2026',
                    officer: 'Survey of India Team',
                  },
                  {
                    title: 'Section 15 Hearing & Objection Disposal',
                    status: 'Disposed',
                    date: '28 Aug 2026',
                    officer: 'District Revenue Officer',
                  },
                  {
                    title: 'Horticulture & Structure Valuations',
                    status: 'Approved',
                    date: '01 Sep 2026',
                    officer: 'PWD Executive Engineer',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-slate-900">{item.title}</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>Authority: {item.officer}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formal Certificate Signoff Box */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-900">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    NIC Digital Signature Certificate (Class 3 DSC)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Token Serial: NIC-GOV-TEL-2026-CALA-9812 • eSign v2.1 Provider
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                By affixing the digital seal, the Competent Authority approves the statutory compensation order of{' '}
                <strong className="text-emerald-700 font-mono">
                  ₹{Math.round(totalCalculated).toLocaleString('en-IN')}
                </strong>{' '}
                for Survey No. {selectedParcel.surveyNumber} ({selectedParcel.areaAcres} Acres), in favor of{' '}
                <strong>{selectedParcel.landownerName}</strong>, directing the treasury to disburse through PFMS DBT.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowApprovalModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Digital Signature & Approve Award</span>
                </button>

                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Return with Queries</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Award Timeline Mandate</span>
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Preliminary Notification:</span>
                  <span className="font-mono font-semibold text-slate-800">10 Jan 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Joint Survey Completed:</span>
                  <span className="font-mono font-semibold text-slate-800">28 Jan 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Section 19 Declaration:</span>
                  <span className="font-mono font-semibold text-slate-800">02 Mar 2026</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Section 31 Statutory Award:</span>
                  <span className="font-mono font-semibold text-emerald-700">08 Mar 2026</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Statutory Lapsing Deadline:</span>
                  <span className="font-mono font-semibold text-slate-500">10 Jan 2027 (12 mos)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTACHED ASSETS VALUATION */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-amber-600" />
                  <span>Attached Assets, Crops & Structures Valuation (Section 29)</span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Joint inspection inventory of immovable assets, standing trees, and irrigation wells
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Total Asset Valuation</span>
                <span className="text-lg font-bold font-mono text-emerald-700">
                  ₹{assetValuation.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Trees & Horticulture */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <TreePine className="w-5 h-5" />
                  <h3 className="text-xs font-bold">Horticulture & Trees</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Fruit-bearing mango (14), teak (8), neem (6) certified by Forest & Horticulture Dept.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                    Certified Value (₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={treesValuation}
                    onChange={(e) => handleUpdateAssetSubItem('trees', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Civil Structures */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <Home className="w-5 h-5" />
                  <h3 className="text-xs font-bold">Farm Structures</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Cattle shed, stone compound wall (120m), grain storage shed verified by PWD.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                    Certified Value (₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={structuresValuation}
                    onChange={(e) => handleUpdateAssetSubItem('struct', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Irrigation & Wells */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-cyan-800">
                  <Droplets className="w-5 h-5" />
                  <h3 className="text-xs font-bold">Wells & Borewells</h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  1 Functional agricultural borewell with 5HP submersible pump & PVC pipeline.
                </p>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 mb-1">
                    Certified Value (₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={wellsValuation}
                    onChange={(e) => handleUpdateAssetSubItem('wells', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-emerald-950 block">Section 30(1) Solatium Multiplier Notice</span>
                <span className="text-emerald-800">
                  Note that 100% Solatium will be automatically applied over this asset valuation in the final award.
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTab('calculator');
                  showToast('Updated attached assets into formula engine', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Return to Formula Engine
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Joint Valuation Team
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">District Horticulture Officer</span>
                <span className="text-[11px] text-slate-500">Tree count & age estimation certified</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Executive Engineer, PWD</span>
                <span className="text-[11px] text-slate-500">Plinth area structural depreciation certified</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block">Groundwater Department</span>
                <span className="text-[11px] text-slate-500">Borewell depth and yield test certified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONSOLIDATED AWARD REGISTER (SECTION 31) */}
      {activeTab === 'register' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Statutory Award Register (RFCTLARR Section 31 Gazette)</span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Master award registry for Hyderabad–Vijayawada Expressway (NH-65 Alignment)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter landowner, survey..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-700"
                />
              </div>
              <button
                onClick={() => showToast('Exported Section 31 Master Award Gazette PDF', 'success')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-mono text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Parcel ID</th>
                  <th className="py-3 px-4 font-semibold">Landowner</th>
                  <th className="py-3 px-4 font-semibold">Survey No.</th>
                  <th className="py-3 px-4 font-semibold">Extent</th>
                  <th className="py-3 px-4 font-semibold">Multiplier</th>
                  <th className="py-3 px-4 font-semibold">Gross Award</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParcels.map((parcel) => (
                  <tr
                    key={parcel.id}
                    onClick={() => {
                      setSelectedParcelId(parcel.id);
                      setActiveTab('calculator');
                    }}
                    className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                      selectedParcel.id === parcel.id ? 'bg-blue-50/80 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {parcel.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {parcel.landownerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {parcel.surveyNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {parcel.areaAcres} Ac
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {parcel.multiplierFactor || 1.5}x
                    </td>
                    <td className="py-3 px-4 font-mono text-sm font-bold text-emerald-700">
                      ₹{Math.round(parcel.compensation?.totalCompensation || parcel.totalCompensation || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={parcel.compensationStatus} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-700 font-semibold text-[11px] hover:underline flex items-center gap-1">
                        Calculate <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Digital DSC Signature Confirmation Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  NIC Class-3 Digital Signature Seal
                </h3>
                <p className="text-[11px] text-slate-500">
                  Statutory gazette award sign-off under RFCTLARR 2013
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <p className="text-slate-600 leading-relaxed">
                You are about to issue a legally binding Land Acquisition Award under Section 31 of
                RFCTLARR Act 2013 for:
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-900 font-bold text-sm">{selectedParcel.landownerName}</p>
                <p className="font-mono text-blue-900 text-xs">Parcel ID: {selectedParcel.id} • Survey: {selectedParcel.surveyNumber}</p>
                <p className="font-mono text-lg font-bold text-emerald-700">
                  ₹{Math.round(totalCalculated).toLocaleString('en-IN')}
                </p>
              </div>

              <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={digitalSignConsent}
                  onChange={(e) => setDigitalSignConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I certify that the joint measurement survey, 100% statutory solatium, and title verification
                  fully comply with Central & State acquisition rules.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApproval}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Affix Digital DSC & Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Remarks Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Valuation Revision
                </h3>
                <p className="text-[11px] text-slate-500">
                  Return award dossier to District Revenue Committee
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-slate-700">
                Revision Remarks / Statutory Grounds:
              </label>
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                rows={4}
                placeholder="e.g. Tree count discrepancies observed between drone LiDAR and Form 16-B; reassess horticultural valuation..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gazette Form 16-B Printable Modal */}
      {showGazettePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-3xl w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-slate-500 block">
                GOVERNMENT OF TELANGANA • REVENUE DEPARTMENT
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-950 mt-1">
                FORM 16-B: STATUTORY AWARD DETERMINATION ORDER
              </h2>
              <span className="text-xs text-slate-600">
                [Under Section 31 of Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013]
              </span>
            </div>

            <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans">
                <div>
                  <span className="text-slate-500 block text-[11px]">Award Case File No:</span>
                  <span className="font-mono font-bold text-slate-900">LAO/NHAI/2026/AW-145</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Date of Gazette Order:</span>
                  <span className="font-mono font-bold text-slate-900">08 March 2026</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Project Name:</span>
                  <span className="font-semibold text-slate-900">{selectedParcel.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Executing Agency:</span>
                  <span className="font-semibold text-slate-900">National Highways Authority of India (NHAI)</span>
                </div>
              </div>

              <p>
                Whereas the land detailed below situated in Village <strong>{selectedParcel.village}</strong>, District <strong>{selectedParcel.district}</strong>, has been acquired under the RFCTLARR Act 2013, the undersigned Competent Authority (CALA) hereby determines the final statutory award:
              </p>

              <table className="w-full border-collapse border border-slate-300 font-sans text-xs my-4">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100 w-1/2">Awardee / Registered Title Holder</td>
                    <td className="p-2.5 font-semibold">{selectedParcel.landownerName} (Aadhaar: {selectedParcel.maskedAadhaar || 'XXXX-XXXX-8921'})</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Survey No. / Sub-Division</td>
                    <td className="p-2.5 font-mono">{selectedParcel.surveyNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Extent of Land Acquired</td>
                    <td className="p-2.5 font-mono">{landArea} Acres</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Base Market Value (₹ / Acre)</td>
                    <td className="p-2.5 font-mono">₹{marketValuePerUnit.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Rural Distance Multiplier Factor</td>
                    <td className="p-2.5 font-mono">{multiplierFactor}x</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Total Multiplied Land Value</td>
                    <td className="p-2.5 font-mono font-bold">₹{Math.round(multipliedLandValue).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Attached Assets, Crops & Trees Valuation</td>
                    <td className="p-2.5 font-mono">₹{Math.round(assetValuation).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">100% Statutory Solatium (Sec 30(1))</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-700">₹{Math.round(solatiumAmount).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100">Additional Market Value (Sec 30(3) @ 12% p.a.)</td>
                    <td className="p-2.5 font-mono font-bold text-indigo-700">₹{Math.round(interestAmount).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="p-2.5 font-bold text-emerald-950">Total Gross Statutory Award Payable</td>
                    <td className="p-2.5 font-mono text-base font-bold text-emerald-700">₹{Math.round(totalCalculated).toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 flex justify-between items-end">
                <div className="text-center font-sans">
                  <div className="w-28 h-12 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mb-1">
                    NIC DSC Digital Seal
                  </div>
                  <span className="text-[11px] text-slate-500">Class 3 Verified</span>
                </div>

                <div className="text-right font-sans">
                  <span className="font-bold text-slate-900 block">Competent Authority (CALA)</span>
                  <span className="text-slate-600 block text-[11px]">Special Land Acquisition Officer</span>
                  <span className="text-slate-500 block text-[10px]">Medchal-Malkajgiri District</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGazettePreview(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Dispatched Form 16-B to system print queue', 'success');
                  setShowGazettePreview(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certified Award Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
