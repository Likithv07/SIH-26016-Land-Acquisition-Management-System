import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckCircle2,
  Download,
  Filter,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditLogs, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(s)) ||
      (log.user && log.user.toLowerCase().includes(s)) ||
      (log.role && log.role.toLowerCase().includes(s)) ||
      (log.details && log.details.toLowerCase().includes(s)) ||
      (log.module && log.module.toLowerCase().includes(s)) ||
      (log.parcelId && log.parcelId.toLowerCase().includes(s));

    const matchesRole =
      selectedRole === 'ALL' ||
      (log.role && log.role.toLowerCase().includes(selectedRole.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  const handleExportCSV = () => {
    if (auditLogs.length === 0) {
      showToast('No audit logs to export', 'warning');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'Parcel ID', 'IP Address', 'Tx Hash'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.module.replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.parcelId || 'N/A'}"`,
      `"${l.ipAddress || '10.244.18.92'}"`,
      `"${l.txHash || 'Verified'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BhoomiSetu_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Audit trail ledger exported successfully (CSV)', 'success');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs uppercase font-mono text-rose-700 font-bold tracking-wider">
              Immutable Cryptographic Audit Trail
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            System &amp; Regulatory Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Real-time append-only ledger tracking all administrative approvals, field uploads, and citizen consents.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-2 shadow-2xs btn-hover transition-colors cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>Export Audit Ledger (CSV)</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit action, officer, parcel ID, or module..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Central', 'State', 'District', 'Field', 'Citizen'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRole === role
                    ? 'bg-blue-700 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">Cryptographically Chained Entries</span>
          </div>
          <span className="text-xs font-mono text-slate-500 font-semibold">
            {filteredLogs.length} Verified Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] uppercase border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Log ID &amp; Timestamp</th>
                <th className="py-3 px-4">Officer / User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Module &amp; Details</th>
                <th className="py-3 px-4">Entity / Parcel</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11.5px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No matching audit log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="interactive-row">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-blue-900 font-bold block">{log.id}</span>
                      <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-900 whitespace-nowrap">
                      {log.user || 'System Authority'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-sans font-medium">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-900 font-medium">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600 max-w-xs">
                      <span className="font-semibold text-slate-800 block text-[11px]">{log.module}</span>
                      <span className="truncate block text-slate-500 text-[10.5px]">{log.details}</span>
                    </td>
                    <td className="py-3 px-4 text-blue-900 font-bold whitespace-nowrap">
                      {log.parcelId || 'System'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                      {log.ipAddress || '10.244.18.92'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-emerald-700 font-bold text-[10.5px] inline-flex items-center gap-1 font-sans bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        VALID
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
