import { SegmentTimes, formatDuration } from '../utils/calculator';
import { TriathlonDistances } from '../types';

interface Paces {
  swimPace: string;
  bikeSpeed: string;
  runPace: string;
}

interface Props {
  result: SegmentTimes;
  paces: Paces;
  distances: TriathlonDistances;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 font-mono">
      {children}
    </span>
  );
}

interface SegmentRowProps {
  icon: string;
  label: string;
  seconds: number;
  badges?: React.ReactNode;
  muted?: boolean;
}

function SegmentRow({ icon, label, seconds, badges, muted }: SegmentRowProps) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${muted ? 'opacity-60' : ''}`}>
      <div>
        <span className="text-sm text-gray-600">{icon} {label}</span>
        {badges && <div className="flex gap-1.5 mt-1 ml-5">{badges}</div>}
      </div>
      <span className="font-mono font-medium text-gray-800 ml-3 shrink-0">{formatDuration(seconds)}</span>
    </div>
  );
}

export function ResultCard({ result, paces, distances }: Props) {
  return (
    <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
      <div className="mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">Tempo Total Estimado</p>
        <p className="text-4xl font-bold font-mono text-blue-700">{formatDuration(result.totalSeconds)}</p>
      </div>
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <SegmentRow
          icon="🏊" label="Natação" seconds={result.swimSeconds}
          badges={<><Badge>{paces.swimPace}/100m</Badge><Badge>{distances.swimMeters}m</Badge></>}
        />
        <SegmentRow icon="⏱" label="T1" seconds={result.t1Seconds} muted />
        <SegmentRow
          icon="🚴" label="Ciclismo" seconds={result.bikeSeconds}
          badges={<><Badge>{paces.bikeSpeed}km/h</Badge><Badge>{distances.bikeKm}km</Badge></>}
        />
        <SegmentRow icon="⏱" label="T2" seconds={result.t2Seconds} muted />
        <SegmentRow
          icon="🏃" label="Corrida" seconds={result.runSeconds}
          badges={<><Badge>{paces.runPace}/km</Badge><Badge>{distances.runKm}km</Badge></>}
        />
      </div>
    </div>
  );
}
