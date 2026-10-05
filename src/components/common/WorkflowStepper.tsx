import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  FileText,
  MapPin,
  Compass,
  Camera,
  UploadCloud,
  FileCheck,
  Calculator,
  ShieldCheck,
  CreditCard,
  Flag,
  CheckCircle2,
} from 'lucide-react';

export const WorkflowStepper: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const steps: { label: string; view: AppView; icon: any; stepNumber: number }[] = [
    { label: 'Proposal', view: 'projects', icon: FileText, stepNumber: 1 },
    { label: 'Parcel ID', view: 'projects', icon: MapPin, stepNumber: 2 },
    { label: 'GIS Mapping', view: 'gis_map', icon: Compass, stepNumber: 3 },
    { label: 'Field Verify', view: 'field_upload', icon: Camera, stepNumber: 4 },
    { label: 'Docs', view: 'documents', icon: UploadCloud, stepNumber: 5 },
    { label: 'Consent', view: 'consent', icon: FileCheck, stepNumber: 6 },
    { label: 'Comp. Calc', view: 'compensation', icon: Calculator, stepNumber: 7 },
    { label: 'Approval', view: 'compensation', icon: ShieldCheck, stepNumber: 8 },
    { label: 'Payment', view: 'citizen_compensation', icon: CreditCard, stepNumber: 9 },
    { label: 'Possession', view: 'project_details', icon: Flag, stepNumber: 10 },
    { label: 'Completed', view: 'dashboard', icon: CheckCircle2, stepNumber: 11 },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto select-none shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[860px] text-xs">
        <div className="flex items-center gap-2 mr-3 pr-3 border-r border-slate-200 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-blue-600" />
          <span className="text-xs tracking-wider text-blue-900 font-bold uppercase">
            National Lifecycle
          </span>
        </div>

        <div className="flex items-center justify-between flex-1 gap-1">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = currentView === s.view;
            return (
              <React.Fragment key={s.label}>
                <button
                  id={`workflow-step-${s.stepNumber}`}
                  onClick={() => setCurrentView(s.view)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-150 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-950 border border-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                  title={`Jump to ${s.label}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isActive ? 'bg-blue-700 text-white font-bold' : 'bg-slate-100 text-slate-500 font-semibold'
                    }`}
                  >
                    {s.stepNumber}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs whitespace-nowrap">{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-slate-300 select-none">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
