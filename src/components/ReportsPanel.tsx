import React from 'react';
import type { CrashData } from '../types';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

interface ReportsPanelProps {
  data: CrashData[];
  currentTime: number;
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({ data, currentTime }) => {
  // Get reports within a 5-second window of current time
  const relevantReports = data
    .filter(d => Math.abs(d.timestamp - currentTime) <= 5)
    .flatMap(d => d.reports || [])
    .filter((report, index, self) => 
      index === self.findIndex(r => 
        r.timestamp === report.timestamp && 
        r.source === report.source
      )
    )
    .sort((a, b) => Math.abs(a.timestamp - currentTime) - Math.abs(b.timestamp - currentTime));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-none">
        <h2 className="text-lg font-semibold text-slate-900">Incident Reports</h2>
        <p className="text-sm text-slate-500 mt-1">
          Showing reports within ±5 seconds of current time
        </p>
      </div>
      <div className="divide-y divide-slate-200 overflow-y-auto flex-1">
        {relevantReports.length > 0 ? (
          relevantReports.map((report, index) => (
            <div
              key={`${report.timestamp}-${report.source}-${index}`}
              className={`p-4 ${Math.abs(report.timestamp - currentTime) < 0.1 ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start gap-3">
                {report.type === 'police' ? (
                  <Shield className="text-blue-600 flex-shrink-0" size={20} />
                ) : (
                  <FileText className="text-gray-600 flex-shrink-0" size={20} />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900 truncate">
                      {report.type === 'police' ? 'Officer ' : ''}{report.source}
                    </span>
                    <span className="text-sm text-slate-500">
                      {report.timestamp.toFixed(1)}s
                    </span>
                    {Math.abs(report.timestamp - currentTime) < 0.1 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-600">{report.statement}</p>
                  <div className="mt-2 flex gap-4 text-sm text-slate-500">
                    {report.type === 'police' && report.officerBadge && (
                      <span className="flex items-center gap-1">
                        <Shield size={14} />
                        {report.officerBadge}
                      </span>
                    )}
                    {report.type === 'witness' && report.credibilityScore && (
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Credibility: {(report.credibilityScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-slate-500">
            No reports available for this timeframe
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPanel;