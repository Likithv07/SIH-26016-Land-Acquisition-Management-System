import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  MessageSquarePlus,
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Search,
  Check,
  Shield,
  FileCheck,
} from 'lucide-react';
import { Grievance, GrievanceCategory } from '../../types';

export const GrievancePortal: React.FC = () => {
  const { grievances, addGrievance, landParcels, showToast } = useApp();

  const [category, setCategory] = useState<GrievanceCategory>('Compensation Issue');
  const [parcelId, setParcelId] = useState(landParcels[0]?.id || 'TS-HYD-2026-001245');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('Rajesh Kumar Reddy');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [documentAttached, setDocumentAttached] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide grievance description details', 'warning');
      return;
    }

    addGrievance({
      parcelId,
      citizenName,
      mobile: phone,
      category,
      subject: `${category} for Parcel ${parcelId}`,
      description,
    });

    setDescription('');
    setDocumentAttached(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-700" />
            <span className="text-xs uppercase font-mono text-blue-900 font-bold tracking-wider">
              Statutory Grievance Redressal Mechanism (CPGRAMS Integrated)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Grievance Redressal & Citizen Petitions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Escalate valuation disputes, survey measurement errors, or resettlement claims directly to the District Competent Authority (CALA).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raise Grievance Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">Lodge a Formal Grievance</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Grievance Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none"
              >
                <option value="Compensation Issue">Compensation Issue (Valuation / Solatium)</option>
                <option value="Measurement Error">Measurement Error (Area / Survey Boundaries)</option>
                <option value="Delayed Payment">Delayed Payment (PFMS Transfer Latency)</option>
                <option value="Title Dispute">Title Dispute / Heirship Conflict</option>
                <option value="Resettlement & Rehabilitation">Resettlement & Rehabilitation (R&R Housing)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Land Parcel ID
                </label>
                <select
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono focus:border-blue-700 focus:bg-white focus:outline-none"
                >
                  {landParcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} (Sy {p.surveyNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Mobile
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Grounds of Objection
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="State your factual objection clearly. Specify survey tree counts, structure dimensions, or legal inheritance details..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
              />
            </div>

            {/* Document Upload Button */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Supporting Documentation
              </label>
              <div
                onClick={() => {
                  setDocumentAttached(true);
                  showToast('Affidavit / Registered Title Deed attached', 'info');
                }}
                className={`p-3.5 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-2 text-xs transition-all ${
                  documentAttached
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-300 hover:border-blue-500 text-slate-600 bg-slate-50'
                }`}
              >
                {documentAttached ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Title_Deed_Certified_Extract.pdf attached (2.4 MB)</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-slate-400" />
                    <span>Click to attach Revenue Record or Affidavit</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Statutory Grievance Petition</span>
            </button>
          </form>
        </div>

        {/* Right: Grievance Status Tracker */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-700" />
              <span>Grievance Registry & Resolution Status</span>
            </h2>
            <span className="text-xs font-mono text-slate-600 font-bold">
              {grievances.length} Registered Petitions
            </span>
          </div>

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {grievances.map((grv) => (
              <div
                key={grv.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900">{grv.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-800 font-semibold">{grv.category}</span>
                  </div>
                  <StatusBadge status={grv.status} />
                </div>

                <p className="text-slate-600 leading-relaxed">{grv.description}</p>

                {grv.resolutionNote && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11.5px]">
                    <span className="font-bold block text-emerald-950">Official Hearing Finding:</span>
                    {grv.resolutionNote}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <span>Filed by: {grv.citizenName} ({grv.parcelId})</span>
                  <span>Date: {grv.submittedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
