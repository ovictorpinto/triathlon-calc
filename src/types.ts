export type DistancePreset = 'sprint' | 'olympic' | 'half-ironman' | 'ironman' | 'custom';

export interface TriathlonDistances {
  swimMeters: number;
  bikeKm: number;
  runKm: number;
}

export interface Pace {
  swimPacePer100m: string; // "MM:SS"
  bikeSpeedKmh: number;
  runPacePerKm: string; // "MM:SS"
}

export interface HistoryEntry {
  id: string;
  preset: DistancePreset;
  distances: TriathlonDistances;
  swimPace: string;
  bikeSpeed: number;
  runPace: string;
  t1: string;
  t2: string;
  totalSeconds: number;
  calculatedAt: string; // ISO string
}

export const PRESETS: Record<Exclude<DistancePreset, 'custom'>, TriathlonDistances & { label: string }> = {
  sprint: { label: 'Sprint', swimMeters: 750, bikeKm: 20, runKm: 5 },
  olympic: { label: 'Olímpico', swimMeters: 1500, bikeKm: 40, runKm: 10 },
  'half-ironman': { label: '70.3', swimMeters: 1900, bikeKm: 90, runKm: 21.1 },
  ironman: { label: 'Ironman', swimMeters: 3800, bikeKm: 180, runKm: 42.2 },
};
