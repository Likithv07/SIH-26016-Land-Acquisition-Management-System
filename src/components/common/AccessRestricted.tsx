import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Landmark, Lock, CheckCircle2 } from 'lucide-react';

interface AccessRestrictedProps {
  moduleName: string;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({ moduleName }) => {
  const { setCurrentView, userRole } = useApp();

  const isCitizen = userRole === 'citizen';

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-mono font-bold border border-rose-200 uppercase tracking-wider">
            {isCitizen ? 'Administrative Role Required' : 'Designated Role Required'}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Access Restricted: {moduleName}
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
            {isCitizen
              ? `The ${moduleName} is classified as an official authority tool reserved strictly for designated revenue and land acquisition authorities.`
              : `The ${moduleName} is strictly reserved for the designated Field Officer role. Your current authority (${userRole}) does not have approval or data modification privileges here.`}
          </p>
        </div>

        {isCitizen && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
            <span className="font-bold text-slate-800 block">Available Citizen Portal Modules:</span>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>My Land Acquisition Particulars & Demarcation</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Statutory Compensation Award (RFCTLARR 2013) & PFMS DBT</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Aadhaar eSign Consent Authorization</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>CPGRAMS Integrated Grievance Submission</span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
