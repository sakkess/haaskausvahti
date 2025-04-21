export default function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input type="number" disabled value={value} className="block w-full bg-neutral-100 border border-neutral-200 rounded-md shadow-sm" />
    </div>
  )
}
