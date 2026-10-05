import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileCheck,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  Building,
  Clock,
  Printer,
  ChevronRight,
  ExternalLink,
  Users,
  Search,
  Filter,
  Check,
  X,
  FileText,
  BadgeCheck,
  HelpCircle,
  Send,
  Sparkles,
  QrCode,
  Lock,
} from 'lucide-react';
import { LandParcel } from '../../types';

export const ConsentPortal: React.FC = () => {
  const {
    landParcels,
    selectedParcelId,
    setSelectedParcelId,
    userRole,
    submitConsent,
    showToast,
    addAuditLog,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'citizen_sign' | 'register' | 'statutory'>('citizen_sign');
  const [selectedConsentType, setSelectedConsentType] = useState<'unconditional' | 'conditional' | 'objection'>('unconditional');
  const [conditionalDemand, setConditionalDemand] = useState('Requesting 1 permanent Group-D PSU employment under R&R Schedule II clause 4.');
  const [objectionGround, setObjectionGround] = useState('Disputing boundary pegging at North-East boundary canal overlap.');
  const [otpValue, setOtpValue] = useState('781923');
  const [isVerifying, setIsVerifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showCertModal, setShowCertModal] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Active parcel
  const activeParcel: LandParcel =
    landParcels.find((p) => p.id === selectedParcelId) || landParcels[0];

  const handleExecuteConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      showToast('Please accept the statutory declaration terms to proceed', 'warning');
      return;
    }
    if (otpValue.length < 6) {
      showToast('Please enter a valid 6-digit Aadhaar OTP', 'warning');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      submitConsent(activeParcel.id);
      addAuditLog(
        'Aadhaar eSign Consent Executed',
        'Consent Portal',
        `Landowner ${activeParcel.landownerName} (Sy ${activeParcel.surveyNumber}) submitted ${selectedConsentType} digital consent via UIDAI eSign API`,
        activeParcel.id
      );
      showToast('Aadhaar eSign Consent recorded and cryptographically sealed', 'success');
      setShowCertModal(true);
    }, 450);
  };

  const filteredParcels = landParcels.filter((p) => {
    const matchSearch =
      p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.landownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.village.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'eSigned' && p.consentReceived) ||
      (filterStatus === 'Pending' && !p.consentReceived);

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              RFCTLARR Statutory Consent Management (Form 7)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Digital Consent & eSign Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Secured Aadhaar-based digital agreement portal with legal validity under Section 5 of the Information Technology Act, 2000.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {activeParcel.consentReceived && (
            <button
              onClick={() => setShowCertModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover cursor-pointer"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>View eSign Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('citizen_sign')}
            className={`px-3.5 py-2 rounded-xl transition-all btn-hover cursor-pointer ${
              activeTab === 'citizen_sign'
                ? 'bg-blue-900 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Form 7 Consent Undertaking
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3.5 py-2 rounded-xl transition-all btn-hover cursor-pointer ${
              activeTab === 'register'
                ? 'bg-blue-900 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Consent Verification Register ({landParcels.filter((p) => p.consentReceived).length}/{landParcels.length})
          </button>
          <button
            onClick={() => setActiveTab('statutory')}
            className={`px-3.5 py-2 rounded-xl transition-all btn-hover cursor-pointer ${
              activeTab === 'statutory'
                ? 'bg-blue-900 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Statutory Framework (RFCTLARR 2013)
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium px-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>UIDAI C-DAC Compliant Node</span>
        </div>
      </div>

      {/* TAB 1: Citizen Sign & Form 7 Undertaking */}
      {activeTab === 'citizen_sign' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left Column: Form 7 Agreement & Statutory Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-blue-800 uppercase font-bold">
                    Schedule II • Statutory Form 7
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">
                    Agreement of Voluntary Consent & Award Acceptance
                  </h2>
                </div>
                {activeParcel.consentReceived ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
                    ✓ DIGITALLY SEALED
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold font-mono">
                    PENDING ESIGN
                  </span>
                )}
              </div>

              {/* Parcel Snapshot */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Survey Number</span>
                  <span className="font-bold text-slate-900">{activeParcel.surveyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Acquired Area</span>
                  <span className="font-bold text-slate-900">{activeParcel.areaAcres} Acres</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Land Classification</span>
                  <span className="font-bold text-slate-900">{activeParcel.landType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Sanctioned Award</span>
                  <span className="font-bold text-emerald-700">₹{(activeParcel.totalCompensation || 7225000).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Statutory Agreement Terms */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs text-slate-700 space-y-3 max-h-72 overflow-y-auto leading-relaxed">
                <p className="font-bold text-slate-900">
                  FORM OF CONSENT UNDER SECTION 2(2) &amp; SECTION 30 OF THE RIGHT TO FAIR COMPENSATION AND TRANSPARENCY IN LAND ACQUISITION, REHABILITATION AND RESETTLEMENT ACT, 2013
                </p>
                <p>
                  1. <strong>Identity &amp; Ownership:</strong> I, <strong>{activeParcel.landownerName}</strong>, holding Aadhaar number <strong>{activeParcel.maskedAadhaar || activeParcel.landownerAadhaar || 'XXXX-XXXX-8921'}</strong>, being the lawful recorded tenure holder/pattadar of land comprised in Survey No. <strong>{activeParcel.surveyNumber}</strong> situated at Village <strong>{activeParcel.village}</strong>, District <strong>{activeParcel.district}</strong>, hereby declare that the boundary markers and DGPS measurements recorded during the Joint Measurement Survey have been verified by me.
                </p>
                <p>
                  2. <strong>Compensation Acceptance:</strong> I have reviewed the statutory valuation prepared under Sections 26–30 of the RFCTLARR Act, 2013, incorporating the base market rate, rural multiplier factor (1.50×), 100% Solatium, and 12% additional market value. The aggregate compensation sum of <strong>₹{(activeParcel.totalCompensation || 7225000).toLocaleString('en-IN')}</strong> is accepted by me for direct electronic transfer into my PFMS pre-validated bank account.
                </p>
                <p>
                  3. <strong>Handover of Possession:</strong> Upon receipt of the full compensation award into my designated bank account via Direct Benefit Transfer (DBT), I agree to surrender unencumbered physical possession of the demarcated land to the Competent Authority within the statutory 60-day notice period.
                </p>
                <p>
                  4. <strong>Legal Standing:</strong> This digital consent agreement executed via Aadhaar Electronic Signature Service (eSign) shall have the full legal force of an executed physical deed under Section 5 and Section 10A of the Information Technology Act, 2000.
                </p>
              </div>

              {/* Consent Type Selection */}
              {!activeParcel.consentReceived && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-800 block">
                    Select Your Form 7 Consent Response:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedConsentType('unconditional')}
                      className={`p-3 rounded-xl border text-left transition-all btn-hover cursor-pointer ${
                        selectedConsentType === 'unconditional'
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unconditional</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Full acceptance of valuation and direct PFMS disbursal.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedConsentType('conditional')}
                      className={`p-3 rounded-xl border text-left transition-all btn-hover cursor-pointer ${
                        selectedConsentType === 'conditional'
                          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                        <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>Conditional (R&amp;R)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Consent contingent on employment or commercial resettlement unit.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedConsentType('objection')}
                      className={`p-3 rounded-xl border text-left transition-all btn-hover cursor-pointer ${
                        selectedConsentType === 'objection'
                          ? 'border-rose-600 bg-rose-50/70 ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Section 15 Hearing</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Request formal hearing before Collector on measurement or rate.
                      </p>
                    </button>
                  </div>

                  {selectedConsentType === 'conditional' && (
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1.5 animate-fade-in">
                      <label className="text-xs font-bold text-indigo-950 block">Specify Conditional R&amp;R Stipulation:</label>
                      <input
                        type="text"
                        value={conditionalDemand}
                        onChange={(e) => setConditionalDemand(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-300 text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  )}

                  {selectedConsentType === 'objection' && (
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5 animate-fade-in">
                      <label className="text-xs font-bold text-rose-950 block">Grounds of Section 15 Objection:</label>
                      <textarea
                        value={objectionGround}
                        onChange={(e) => setObjectionGround(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-rose-300 text-xs text-slate-900 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: eSign Verification Execution Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                  <Fingerprint className="w-5 h-5 text-blue-700" />
                  <h2 className="text-base font-bold text-slate-900">
                    Aadhaar eSign Authentication
                  </h2>
                </div>

                {activeParcel.consentReceived ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-900">Form 7 eSign Successfully Recorded</h3>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Digital consent registered on {activeParcel.consentDate || '08 Sep 2026'}. The acquisition proceeding has satisfied mandatory consent requirements under Section 2(2).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                        <span>Signer:</span>
                        <span className="font-semibold text-slate-900">{activeParcel.landownerName}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                        <span>Aadhaar Token:</span>
                        <span className="font-mono text-slate-900">UIDAI-AUTH-9821-OK</span>
                      </div>
                      <div className="flex justify-between text-slate-600 border-b border-slate-200/60 pb-1.5">
                        <span>Certificate SHA-256:</span>
                        <span className="font-mono text-slate-700 text-[10px] truncate max-w-[180px]">
                          0x8892f39281a9cd412089b211
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Status:</span>
                        <span className="font-bold text-emerald-700">Verified by CALA</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCertModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs btn-hover flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BadgeCheck className="w-4 h-4" />
                      <span>Download Certified eSign Deed</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleExecuteConsent} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-blue-950 block">Aadhaar Linked Mobile</span>
                      <p className="text-slate-600">
                        OTP will be dispatched to registered number +91 98••• ••210 linked to Aadhaar {activeParcel.maskedAadhaar || 'XXXX-XXXX-8921'}.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 block">Enter 6-Digit Aadhaar OTP</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          placeholder="781923"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-center tracking-widest text-base font-bold text-slate-900 focus:outline-none focus:border-blue-700 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => showToast('New OTP dispatched: 781923', 'info')}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold btn-hover cursor-pointer shrink-0"
                        >
                          Resend
                        </button>
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none pt-2">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span>
                        I consent to authenticate my identity via Aadhaar eSign and affix my digital signature to Form 7 under Section 30 of the RFCTLARR Act, 2013.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs btn-hover flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" />
                          <span>Validating with UIDAI C-DAC Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="w-4 h-4" />
                          <span>Execute Aadhaar eSign Consent</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Certifying Authority: e-Mudhra / C-DAC</span>
                <span className="font-mono text-emerald-700 font-bold">256-Bit SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Consent Verification Master Register */}
      {activeTab === 'register' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Project Landowner Consent Register</h2>
              <p className="text-xs text-slate-500">
                Official registry tracking voluntary consents required for Section 3D gazette and possession notifications.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search landowner or survey..."
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="eSigned">eSigned Consents</option>
                <option value="Pending">Pending Consents</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Survey No</th>
                  <th className="py-2.5 px-3">Landowner Name</th>
                  <th className="py-2.5 px-3">Extent</th>
                  <th className="py-2.5 px-3">Award Sanctioned</th>
                  <th className="py-2.5 px-3">Consent Status</th>
                  <th className="py-2.5 px-3">Aadhaar eSign Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="interactive-row">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{parcel.surveyNumber}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block">{parcel.landownerName}</span>
                      <span className="text-[11px] text-slate-500">{parcel.village}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">{parcel.areaAcres} Ac</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                      ₹{(parcel.totalCompensation || 6500000).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      {parcel.consentReceived ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-[10px]">
                          ✓ eSigned
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {parcel.consentDate || 'Pending Submission'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedParcelId(parcel.id);
                          setActiveTab('citizen_sign');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-900 border border-blue-200 font-semibold text-[11px] transition-colors btn-hover cursor-pointer"
                      >
                        {parcel.consentReceived ? 'View Deed' : 'Take Consent'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Statutory Rules Under RFCTLARR */}
      {activeTab === 'statutory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold">Statutory Consent Quorums (Section 2)</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The RFCTLARR Act, 2013 sets rigid consent benchmarks prior to preliminary notification:
            </p>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="font-bold text-blue-950 block">Public-Private Partnership (PPP) Projects: 70%</span>
                <p className="text-slate-600 mt-1">
                  Requires prior written consent of at least 70% of affected land-owning families.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <span className="font-bold text-purple-950 block">Private Company Acquisitions: 80%</span>
                <p className="text-slate-600 mt-1">
                  Requires prior written consent of at least 80% of affected land-owning families.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-950 block">Linear Government Infrastructure: Exempt</span>
                <p className="text-slate-600 mt-1">
                  Highways, railways, and power transmission lines follow National Highways Act / Railways Act fast-track provisions with full Section 26–30 compensation.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <FileCheck className="w-5 h-5 text-blue-700" />
              <h2 className="text-base font-bold">Digital eSign Legal Validity</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              BhoomiSetu integrates Aadhaar Electronic Signature Services adhering strictly to the Controller of Certifying Authorities (CCA) guidelines:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 list-disc pl-5 leading-relaxed">
              <li>Admissible as primary electronic evidence under Section 65B of the Indian Evidence Act, 1872.</li>
              <li>Timestamped using Indian Standard Time (IST) derived from National Physical Laboratory (NPL) atomic clocks.</li>
              <li>Dual-hash verification linking the cadastral survey polygon directly to the biometric identity.</li>
              <li>Prevents post-award impersonation, duplicate claims, and proxy litigation.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <BadgeCheck className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Certified Digital eSign Certificate</h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Signer Identity:</span>
                <span className="text-slate-900 font-bold">{activeParcel.landownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aadhaar Token:</span>
                <span className="text-slate-900 font-bold">{activeParcel.maskedAadhaar || 'XXXX-XXXX-8921'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Survey No / Mandal:</span>
                <span className="text-slate-900 font-bold">{activeParcel.surveyNumber} • {activeParcel.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Award:</span>
                <span className="text-emerald-700 font-bold">₹{(activeParcel.totalCompensation || 7225000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Execution Date:</span>
                <span className="text-slate-900 font-bold">{activeParcel.consentDate || '08 Sep 2026, 11:42 IST'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500">SHA-256 Hash:</span>
                <span className="text-slate-700 text-[10px] truncate max-w-[200px]">
                  0x9b2d8e41a87c10b4f36a8e8093db4c80381e4b31a892
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  showToast('Preparing PDF download for Form 7 deed...', 'info');
                  window.print();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs btn-hover flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Deed</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs btn-hover cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
