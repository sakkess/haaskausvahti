// src/components/form/TwoCol.jsx
import React from 'react'

/**
 * TwoCol lays out exactly two children side by side (on sm+)
 * and bottom-aligns each, so inputs line up even if labels wrap.
 */
export default function TwoCol({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {React.Children.map(children, child => (
        <div className="flex flex-col justify-end">
          {child}
        </div>
      ))}
    </div>
  )
}
