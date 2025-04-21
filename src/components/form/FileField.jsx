export default function FileField({ label, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input type="file" multiple onChange={e => onChange(e.target.files)} className="block w-full" />
    </div>
  )
}
