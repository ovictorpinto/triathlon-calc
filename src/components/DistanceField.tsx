interface Props {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DistanceField({ label, unit, value, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-500 w-16 shrink-0">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        disabled={disabled}
        min={0}
        step={0.1}
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      />
      <span className="text-xs text-gray-400 whitespace-nowrap w-10 shrink-0">{unit}</span>
    </div>
  );
}
