export default function SelectField({ label, value, onChange, options, disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <select
        disabled={disabled}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`block w-full border rounded-md shadow-sm ${
          disabled ? 'bg-neutral-100 border-neutral-200 text-neutral-500 cursor-not-allowed' : 'bg-white border-neutral-300'
        }`}
      >
        <option value="">Valitse…</option>
        {options.map(o => (
          <option key={o.code} value={o.code}>
            {o.code} {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
