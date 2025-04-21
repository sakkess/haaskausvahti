import dropdowns from '../data/dropdowns.json'

function getLabel(code, level) {
    const dropdown = dropdowns.find(d => d.dropdown === level)
    if (!dropdown) return code
    const found = dropdown.options.find(opt => opt.code === code)
    return found ? `${code} – ${found.label}` : code
  }
  

export function formatCOFOG({ cofog1, cofog2, cofog3 }) {
  return [cofog1 && getLabel(cofog1, 1), cofog2 && getLabel(cofog2, 2), cofog3 && getLabel(cofog3, 3)].filter(Boolean)
}

export function formatTiliryhma(code) {
  return getLabel(code, 4)
}

export function formatCurrency(value) {
  const num = parseFloat(value)
  return isNaN(num) ? '-' : `${num.toFixed(2)} €`
}

export function unwrap(val) {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed) && parsed.length === 1) return parsed[0]
      return parsed
    } catch {
      return val
    }
  }
  
