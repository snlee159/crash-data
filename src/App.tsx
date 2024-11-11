import React, { useState, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import CrashDataVisualizer from './components/CrashDataVisualizer';
import ChatBot from './components/ChatBot';
import DataTable from './components/DataTable';
import MetricsPanel from './components/MetricsPanel';
import ReportsPanel from './components/ReportsPanel';
import type { CrashData, ChatMessage, Report } from './types';
import { ClipboardCheck } from 'lucide-react';

// Enhanced sample data with more detailed reports
const sampleReports: Report[] = [
  {
    type: 'witness',
    timestamp: 20.0,
    source: 'James Wilson',
    statement: 'The Tesla was maintaining a safe distance from the vehicle ahead.',
    credibilityScore: 0.88,
    witnessContact: '+1 (555) 0121'
  },
  {
    type: 'police',
    timestamp: 22.5,
    source: 'Officer Mike Chen',
    statement: 'Traffic camera footage confirms normal traffic flow at this point.',
    officerBadge: 'LAPD-2234'
  },
  {
    type: 'witness',
    timestamp: 35.0,
    source: 'Emily Rodriguez',
    statement: 'Traffic began to slow down suddenly. The Tesla\'s brake lights activated immediately.',
    credibilityScore: 0.95,
    witnessContact: '+1 (555) 0122'
  },
  {
    type: 'witness',
    timestamp: 48.5,
    source: 'John Smith',
    statement: 'I saw the Tesla slow down gradually before the impact. The car in front stopped suddenly.',
    credibilityScore: 0.85,
    witnessContact: '+1 (555) 0123'
  },
  {
    type: 'police',
    timestamp: 49.0,
    source: 'Officer Sarah Johnson',
    statement: 'Dash cam from nearby patrol car shows rapid deceleration of traffic.',
    officerBadge: 'LAPD-7845'
  },
  {
    type: 'witness',
    timestamp: 49.5,
    source: 'David Chang',
    statement: 'Multiple vehicles were involved in sudden braking.',
    credibilityScore: 0.91,
    witnessContact: '+1 (555) 0124'
  },
  {
    type: 'police',
    timestamp: 50.0,
    source: 'Officer Sarah Johnson',
    statement: 'Upon arrival at the scene, the Tesla\'s automatic emergency braking system had engaged. Both airbags were deployed.',
    officerBadge: 'LAPD-7845'
  },
  {
    type: 'witness',
    timestamp: 50.5,
    source: 'Maria Garcia',
    statement: 'There was a loud crash sound. The Tesla\'s emergency lights came on immediately after impact.',
    credibilityScore: 0.92,
    witnessContact: '+1 (555) 0456'
  },
  {
    type: 'police',
    timestamp: 51.0,
    source: 'Officer Tom Wilson',
    statement: 'Emergency response initiated. Tesla\'s automatic emergency call system activated.',
    officerBadge: 'LAPD-9922'
  },
  {
    type: 'witness',
    timestamp: 52.0,
    source: 'Robert Lee',
    statement: 'The Tesla remained stationary after impact, hazard lights were active.',
    credibilityScore: 0.87,
    witnessContact: '+1 (555) 0125'
  }
];

const sampleCrashData: CrashData[] = Array.from({ length: 100 }, (_, i) => ({
  timestamp: i * 0.5,
  speed: i < 50 ? 45 - (i/50 * 5) : (i === 50 ? 40 : 40 - ((i-50)/50 * 40)),
  acceleration: i < 50 ? -2 : (i === 50 ? -15 : -1),
  impact_force: i === 50 ? 20 : (i > 50 ? 20 * Math.exp(-(i-50)/10) : 0),
  airbag_deployed: i >= 50,
  observations: i < 50 ? [
    {
      type: 'vehicle',
      distance: 50 - i/2,
      position: 'front',
      details: 'Decelerating vehicle ahead',
      confidence: 0.95
    }
  ] : (i === 50 ? [
    {
      type: 'vehicle',
      distance: 0,
      position: 'front',
      details: 'Collision detected',
      confidence: 0.99
    }
  ] : [
    {
      type: 'obstacle',
      distance: 0,
      position: 'front',
      details: 'Accident scene',
      confidence: 0.98
    }
  ]),
  vehicleActions: i < 50 ? [
    'Gradual braking',
    'Forward collision warning active'
  ] : (i === 50 ? [
    'Emergency braking engaged',
    'Airbag deployment initiated'
  ] : [
    'Post-collision safety measures active'
  ]),
  autopilotActive: i < 50,
  brakeForce: i < 50 ? i/50 * 0.5 : (i === 50 ? 1.0 : 0.8),
  damage_severity: i > 50 ? 0.6 : 0,
  weather_conditions: 'Clear',
  visibility: 'Good',
  reports: sampleReports.filter(r => Math.abs(r.timestamp - i * 0.5) < 0.1)
}));

export function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help analyze this incident. What would you like to know?',
    },
  ]);

  const getCurrentData = useCallback(() => {
    return sampleCrashData.find(d => Math.abs(d.timestamp - currentTime) < 0.1);
  }, [currentTime]);

  const handleSendMessage = (message: string) => {
    const currentData = getCurrentData();
    let response = '';

    if (currentData) {
      const keywords = message.toLowerCase();
      if (keywords.includes('speed')) {
        response = `At ${currentTime.toFixed(1)}s, the vehicle was traveling at ${currentData.speed.toFixed(1)} mph.`;
      } else if (keywords.includes('brake') || keywords.includes('braking')) {
        response = `Brake force was at ${(currentData.brakeForce * 100).toFixed(0)}% with ${currentData.vehicleActions.join(', ')}.`;
      } else if (keywords.includes('impact') || keywords.includes('collision')) {
        response = `Impact force was ${currentData.impact_force.toFixed(1)}G with damage severity at ${(currentData.damage_severity * 100).toFixed(0)}%.`;
      } else if (keywords.includes('witness') || keywords.includes('report')) {
        const reports = currentData.reports || [];
        response = reports.length > 0 
          ? `At ${currentTime.toFixed(1)}s: ${reports.map(r => `${r.type === 'police' ? 'Officer' : 'Witness'} ${r.source} reported: ${r.statement}`).join(' ')}`
          : `No witness or police reports available for timestamp ${currentTime.toFixed(1)}s.`;
      } else if (keywords.includes('autopilot')) {
        response = `At ${currentTime.toFixed(1)}s, Autopilot was ${currentData.autopilotActive ? 'active' : 'inactive'}.`;
      } else if (keywords.includes('airbag')) {
        response = `At ${currentTime.toFixed(1)}s, airbags were ${currentData.airbag_deployed ? 'deployed' : 'not deployed'}.`;
      } else {
        response = `At ${currentTime.toFixed(1)}s: Speed ${currentData.speed.toFixed(1)} mph, Impact ${currentData.impact_force.toFixed(1)}G, Autopilot ${currentData.autopilotActive ? 'Active' : 'Inactive'}`;
      }
    }

    setMessages([
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: response },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-slate-200 flex-none">
        <div className="max-w-[1920px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-slate-900">Tesla Incident Analysis</h1>
            </div>
            <div className="text-sm text-slate-500">Case #TES-2024-0123</div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1920px] mx-auto px-4 py-4 grid grid-cols-4 gap-4">
        <div className="col-span-3 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <MetricsPanel data={sampleCrashData} currentTime={currentTime} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <VideoPlayer
              videoUrl="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
            />
            <CrashDataVisualizer
              data={sampleCrashData}
              currentTime={currentTime}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataTable
              data={sampleCrashData}
              currentTime={currentTime}
            />
            <ReportsPanel
              data={sampleCrashData}
              currentTime={currentTime}
            />
          </div>
        </div>
        <div className="col-span-1">
          <ChatBot
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </main>
    </div>
  );
}

export default App;