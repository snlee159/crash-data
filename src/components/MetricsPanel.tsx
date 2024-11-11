import React from 'react';
import type { CrashData } from '../types';
import { AlertTriangle, Gauge } from 'lucide-react';

interface MetricsPanelProps {
  data: CrashData[];
  currentTime: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ data, currentTime }) => {
  const currentData = data.find(d => Math.abs(d.timestamp - currentTime) < 0.1);
  
  if (!currentData) return null;

  const metrics = [
    {
      label: 'Damage Severity',
      value: `${(currentData.damage_severity * 100).toFixed(0)}%`,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Impact Force',
      value: `${currentData.impact_force.toFixed(1)}G`,
      icon: Gauge,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} rounded-lg p-3 shadow-sm border border-slate-200`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{metric.label}</p>
              <p className={`text-xl font-bold ${metric.color} mt-1`}>
                {metric.value}
              </p>
            </div>
            <metric.icon className={`${metric.color}`} size={20} />
          </div>
        </div>
      ))}
    </>
  );
};

export default MetricsPanel;