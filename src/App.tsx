import { useState, useCallback } from 'react';
import { DistancePreset, TriathlonDistances, HistoryEntry, PRESETS } from './types';
import { calculate, SegmentTimes } from './utils/calculator';
import { addEntry, getAllGrouped, GroupedHistory } from './utils/history';
import { DistanceField } from './components/DistanceField';
import { PaceInput } from './components/PaceInput';
import { ResultCard } from './components/ResultCard';
import { HistoryPanel } from './components/HistoryPanel';

const PRESET_KEYS = Object.keys(PRESETS) as Exclude<DistancePreset, 'custom'>[];

const DEFAULT_DISTANCES: TriathlonDistances = { swimMeters: 1500, bikeKm: 40, runKm: 10 };

export default function App() {
  const [preset, setPreset] = useState<DistancePreset>('olympic');
  const [custom, setCustom] = useState<TriathlonDistances>(DEFAULT_DISTANCES);
  const [swimPace, setSwimPace] = useState('02:00');
  const [bikeSpeed, setBikeSpeed] = useState('30');
  const [runPace, setRunPace] = useState('05:30');
  const [t1, setT1] = useState('03:00');
  const [t2, setT2] = useState('02:00');
  const [result, setResult] = useState<SegmentTimes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GroupedHistory>(() => getAllGrouped());

  const distances: TriathlonDistances =
    preset === 'custom' ? custom : PRESETS[preset];

  const refreshHistory = useCallback(() => {
    setHistory(getAllGrouped());
  }, []);

  function handlePreset(p: DistancePreset) {
    setPreset(p);
    if (p !== 'custom') setCustom(PRESETS[p]);
    setResult(null);
    setError(null);
  }

  function handleCalculate() {
    const calc = calculate(
      distances.swimMeters,
      distances.bikeKm,
      distances.runKm,
      swimPace,
      parseFloat(bikeSpeed),
      runPace,
      t1,
      t2
    );
    if (!calc) {
      setError('Verifique os valores. Ritmos devem estar no formato MM:SS e a velocidade deve ser maior que 0.');
      setResult(null);
    } else {
      setError(null);
      setResult(calc);
      addEntry({
        preset,
        distances,
        swimPace,
        bikeSpeed: parseFloat(bikeSpeed),
        runPace,
        t1,
        t2,
        totalSeconds: calc.totalSeconds,
      });
      refreshHistory();
    }
  }

  function handleRestore(entry: HistoryEntry) {
    handlePreset(entry.preset);
    setSwimPace(entry.swimPace);
    setBikeSpeed(String(entry.bikeSpeed));
    setRunPace(entry.runPace);
    setT1(entry.t1);
    setT2(entry.t2);
    const calc = calculate(
      entry.distances.swimMeters,
      entry.distances.bikeKm,
      entry.distances.runKm,
      entry.swimPace,
      entry.bikeSpeed,
      entry.runPace,
      entry.t1,
      entry.t2
    );
    if (calc) setResult(calc);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Calculadora de Triathlon</h1>
          <p className="text-sm text-gray-500 mt-1">Estime seu tempo de prova com base no seu ritmo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Coluna 1 — Formulário */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-5 space-y-4">
          {/* Preset selector */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Modalidade</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => handlePreset(key)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    preset === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {PRESETS[key].label}
                </button>
              ))}
              <button
                onClick={() => handlePreset('custom')}
                className={`col-span-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  preset === 'custom'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                Personalizado
              </button>
            </div>
          </div>

          {/* Distances */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Distâncias</p>
            <div className="space-y-1.5">
              <DistanceField
                label="Natação"
                unit="metros"
                value={distances.swimMeters}
                onChange={(v) => setCustom((c) => ({ ...c, swimMeters: v }))}
                disabled={preset !== 'custom'}
              />
              <DistanceField
                label="Ciclismo"
                unit="km"
                value={distances.bikeKm}
                onChange={(v) => setCustom((c) => ({ ...c, bikeKm: v }))}
                disabled={preset !== 'custom'}
              />
              <DistanceField
                label="Corrida"
                unit="km"
                value={distances.runKm}
                onChange={(v) => setCustom((c) => ({ ...c, runKm: v }))}
                disabled={preset !== 'custom'}
              />
            </div>
          </div>

          {/* Paces */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Ritmo / Velocidade</p>
            <div className="space-y-1.5">
              <PaceInput
                label="Natação"
                unit="min/100m"
                type="pace"
                value={swimPace}
                onChange={setSwimPace}
                placeholder="02:00"
              />
              <PaceInput
                label="Ciclismo"
                unit="km/h"
                type="speed"
                value={bikeSpeed}
                onChange={setBikeSpeed}
                placeholder="30"
              />
              <PaceInput
                label="Corrida"
                unit="min/km"
                type="pace"
                value={runPace}
                onChange={setRunPace}
                placeholder="05:30"
              />
            </div>
          </div>

          {/* Transitions */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Transições</p>
            <div className="space-y-1.5">
              <PaceInput
                label="T1"
                unit="min:seg"
                type="pace"
                value={t1}
                onChange={setT1}
                placeholder="03:00"
              />
              <PaceInput
                label="T2"
                unit="min:seg"
                type="pace"
                value={t2}
                onChange={setT2}
                placeholder="02:00"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            Calcular Tempo
          </button>
        </div>

        {/* Coluna 2 — Resultado */}
        <div>
          {result ? (
            <ResultCard result={result} paces={{ swimPace, bikeSpeed, runPace }} distances={distances} />
          ) : (
            <div className="hidden lg:flex rounded-2xl border border-dashed border-gray-200 bg-white h-full min-h-48 items-center justify-center">
              <p className="text-sm text-gray-400">O resultado aparecerá aqui</p>
            </div>
          )}
        </div>

        {/* Coluna 3 — Histórico */}
        <div>
          {history.length > 0 ? (
            <HistoryPanel
              groups={history}
              onDelete={refreshHistory}
              onRestore={handleRestore}
            />
          ) : (
            <div className="hidden lg:flex rounded-2xl border border-dashed border-gray-200 bg-white h-full min-h-48 items-center justify-center">
              <p className="text-sm text-gray-400">Nenhum cálculo salvo ainda</p>
            </div>
          )}
        </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
}
