import React from 'react';
import type { CrashData } from '../types';
import { AlertTriangle, Gauge, Shield } from 'lucide-react';

interface DataTableProps {
  data: CrashData[];
  currentTime: number;
}

const DataTable: React.FC<DataTableProps> = ({ data, currentTime }) => {
  const currentIndex = data.findIndex(d => Math.abs(d.timestamp - currentTime) < 0.1);
  const startIndex = Math.max(0, currentIndex - 25);
  const endIndex = Math.min(data.length, startIndex + 50);
  const visibleData = data.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden h-[400px] flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-none">
        <h2 className="text-lg font-semibold text-slate-900">Telemetry Data</h2>
        <p className="text-sm text-slate-500 mt-1">
          Showing 50 rows of data around current time
        </p>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Speed
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impact
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brake Force
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((row) => (
              <tr
                key={row.timestamp}
                className={Math.abs(row.timestamp - currentTime) < 0.1 ? 'bg-blue-50' : ''}
              >
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {row.timestamp.toFixed(1)}s
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Gauge size={16} className="text-blue-500" />
                    {row.speed.toFixed(1)} mph
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <AlertTriangle 
                      size={16} 
                      className={row.impact_force > 0 ? 'text-red-500' : 'text-gray-400'} 
                    />
                    {row.impact_force.toFixed(1)}G
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                  {(row.brakeForce * 100).toFixed(0)}%
                </td>
                <td className="px-4 py-2 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${row.autopilotActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {row.autopilotActive ? 'Autopilot On' : 'Manual'}
                    </span>
                    {row.airbag_deployed && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Airbag
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;