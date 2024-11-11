import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { CrashData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CrashDataVisualizerProps {
  data: CrashData[];
  currentTime: number;
}

const CrashDataVisualizer: React.FC<CrashDataVisualizerProps> = ({ data, currentTime }) => {
  const chartData = {
    labels: data.map(d => d.timestamp.toFixed(1)),
    datasets: [
      {
        label: 'Speed',
        data: data.map(d => d.speed),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Impact',
        data: data.map(d => d.impact_force),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Brake',
        data: data.map(d => d.brakeForce * 100),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          padding: 8,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 h-full">
      <div className="h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CrashDataVisualizer;