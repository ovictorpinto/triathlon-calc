interface Props {
  label: string;
  unit: string;
  type: 'pace' | 'speed';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}

function applyPaceMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function PaceInput({ label, unit, type, value, onChange, placeholder }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (type === 'pace') {
      onChange(applyPaceMask(e.target.value));
    } else {
      onChange(e.target.value);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-500 w-16 shrink-0">{label}</label>
      <input
        type={type === 'speed' ? 'number' : 'text'}
        inputMode={type === 'pace' ? 'numeric' : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={type === 'speed' ? 1 : undefined}
        step={type === 'speed' ? 0.1 : undefined}
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <span className="text-xs text-gray-400 whitespace-nowrap w-14 shrink-0">{unit}</span>
    </div>
  );
}
