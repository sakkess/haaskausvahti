// src/components/form/FormField.jsx
import React from 'react'

/**
 * A generic form field: either <input> or <textarea>.
 *
 * Props:
 *  - label       (string): the field label
 *  - value       (string|number): controlled value
 *  - onChange    (value:string => void): setter
 *  - type        (string): HTML input type
 *  - textarea    (bool): render <textarea> instead of <input>
 *  - required    (bool): mark as required
 *  - placeholder (string): placeholder text for the input/textarea
 */
export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
  placeholder = ''
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {textarea ? (
        <textarea
          rows="6"
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full border border-neutral-300 rounded-md shadow-sm"
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full border border-neutral-300 rounded-md shadow-sm"
        />
      )}
    </div>
  )
}
