// Parses "MM:SS" string into total seconds
export function parsePace(pace: string): number | null {
  const parts = pace.split(':');
  if (parts.length !== 2) return null;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return null;
  return minutes * 60 + seconds;
}

// Formats total seconds into "H:MM:SS"
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export interface SegmentTimes {
  swimSeconds: number;
  t1Seconds: number;
  bikeSeconds: number;
  t2Seconds: number;
  runSeconds: number;
  totalSeconds: number;
}

export function calculate(
  swimMeters: number,
  bikeKm: number,
  runKm: number,
  swimPacePer100m: string,
  bikeSpeedKmh: number,
  runPacePerKm: string,
  t1: string,
  t2: string
): SegmentTimes | null {
  const swimPaceSeconds = parsePace(swimPacePer100m);
  const runPaceSeconds = parsePace(runPacePerKm);
  const t1Seconds = parsePace(t1) ?? 0;
  const t2Seconds = parsePace(t2) ?? 0;

  if (swimPaceSeconds === null || runPaceSeconds === null) return null;
  if (bikeSpeedKmh <= 0) return null;

  const swimSeconds = (swimMeters / 100) * swimPaceSeconds;
  const bikeSeconds = (bikeKm / bikeSpeedKmh) * 3600;
  const runSeconds = runKm * runPaceSeconds;

  return {
    swimSeconds,
    t1Seconds,
    bikeSeconds,
    t2Seconds,
    runSeconds,
    totalSeconds: swimSeconds + t1Seconds + bikeSeconds + t2Seconds + runSeconds,
  };
}
