export interface VehicleObservation {
  type: 'pedestrian' | 'vehicle' | 'obstacle' | 'traffic_signal';
  distance: number;
  position: 'front' | 'left' | 'right';
  details: string;
  confidence: number;
}

export interface Report {
  type: 'witness' | 'police';
  timestamp: number;
  source: string;
  statement: string;
  credibilityScore?: number;
  officerBadge?: string;
  witnessContact?: string;
}

export interface CrashData {
  timestamp: number;
  speed: number;
  acceleration: number;
  impact_force: number;
  airbag_deployed: boolean;
  observations: VehicleObservation[];
  vehicleActions: string[];
  autopilotActive: boolean;
  brakeForce: number;
  damage_severity: number;
  weather_conditions: string;
  visibility: string;
  reports?: Report[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}