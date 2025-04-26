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
 *  - placeholder (string): placeholder text
 *  - rows        (number): number of rows for textarea
 */
export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  required = false,
  placeholder = '',
  rows = 3,              // <-- default rows
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {textarea ? (
        <textarea
          rows={rows}       // <-- use the rows prop
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
