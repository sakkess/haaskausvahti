export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          rows="3"
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="block w-full border border-neutral-300 rounded-md shadow-sm"
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="block w-full border border-neutral-300 rounded-md shadow-sm"
        />
      )}
    </div>
  )
}
