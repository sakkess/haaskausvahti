import { useState, useEffect } from 'react'
import dropdowns from '../data/dropdowns.json'

export default function Ilmoita() {
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [liitteet, setLiitteet] = useState(null)
  const [lahteet, setLahteet] = useState('')
  const [yhteystiedot, setYhteystiedot] = useState('')
  const [vertailuMaara, setVertailuMaara] = useState('')
  const [maaraMuutoksenJalkeen, setMaaraMuutoksenJalkeen] = useState('')
  const [vertailuhinta, setVertailuhinta] = useState('')
  const [hintaMuutoksenJalkeen, setHintaMuutoksenJalkeen] = useState('')
  const [kokonaisVertailuhinta, setKokonaisVertailuhinta] = useState(0)
  const [kokonaishintaMuutoksenJalkeen, setKokonaishintaMuutoksenJalkeen] = useState(0)

  const [cofog1, setCofog1] = useState('')
  const [cofog2, setCofog2] = useState('')
  const [cofog3, setCofog3] = useState('')
  const [tiliryhmat, setTiliryhmat] = useState('')

  useEffect(() => {
    setCofog2('')
    setCofog3('')
  }, [cofog1])

  useEffect(() => {
    setCofog3('')
  }, [cofog2])

  const dd1 = dropdowns.find(d => d.dropdown === 1) || { options: [] }
  const dd2 = dropdowns.find(d => d.dropdown === 2) || { options: [] }
  const dd3 = dropdowns.find(d => d.dropdown === 3) || { options: [] }
  const dd4 = dropdowns.find(d => d.dropdown === 4) || { options: [] }

  const opts1 = dd1.options
  const opts2 = dd2.options.filter(o => o.parent === cofog1)
  const opts3 = dd3.options.filter(o => o.parent === cofog2)
  const opts4 = dd4.options

  useEffect(() => {
    const vm = parseFloat(vertailuMaara) || 0
    const vh = parseFloat(vertailuhinta) || 0
    setKokonaisVertailuhinta(vm * vh)
  }, [vertailuMaara, vertailuhinta])

  useEffect(() => {
    const mm = parseFloat(maaraMuutoksenJalkeen) || 0
    const hm = parseFloat(hintaMuutoksenJalkeen) || 0
    setKokonaishintaMuutoksenJalkeen(mm * hm)
  }, [maaraMuutoksenJalkeen, hintaMuutoksenJalkeen])

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('otsikko', otsikko)
    formData.append('kuvaus', kuvaus)
    formData.append('cofog1', cofog1)
    formData.append('cofog2', cofog2)
    formData.append('cofog3', cofog3)
    formData.append('tiliryhmat', tiliryhmat)
    formData.append('lahteet', lahteet)
    formData.append('yhteystiedot', yhteystiedot)

    if (liitteet) Array.from(liitteet).forEach(f => formData.append('liitteet', f))

    formData.append('vertailu_maara', vertailuMaara)
    formData.append('maara_muutoksen_jalkeen', maaraMuutoksenJalkeen)
    formData.append('vertailuhinta', vertailuhinta)
    formData.append('hinta_muutoksen_jalkeen', hintaMuutoksenJalkeen)
    formData.append('kokonaisvertailuhinta', kokonaisVertailuhinta)
    formData.append('kokonaishinta_muutoksen_jalkeen', kokonaishintaMuutoksenJalkeen)

    try {
      const res = await fetch('/api/reports', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Tuntematon palvelinvirhe')
      alert('Ilmoitus lähetetty onnistuneesti!')
      setOtsikko('')
      setKuvaus('')
      setCofog1('')
      setCofog2('')
      setCofog3('')
      setTiliryhmat('')
      setLahteet('')
      setLiitteet(null)
      setYhteystiedot('')
      setVertailuMaara('')
      setMaaraMuutoksenJalkeen('')
      setVertailuhinta('')
      setHintaMuutoksenJalkeen('')
    } catch (err) {
      console.error(err)
      alert(`Jokin meni pieleen: ${err.message}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold text-brand-800 mb-6">Tee säästöaloite</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Otsikko" required value={otsikko} onChange={setOtsikko} />
        <FormField label="Kuvaus" textarea required value={kuvaus} onChange={setKuvaus} />
        <SelectField label="COFOG Taso 1" value={cofog1} onChange={setCofog1} options={opts1} />
        <SelectField label="COFOG Taso 2" value={cofog2} onChange={setCofog2} options={opts2} disabled={!cofog1} />
        <SelectField label="COFOG Taso 3" value={cofog3} onChange={setCofog3} options={opts3} disabled={!cofog2} />
        <SelectField label="Tiliryhmät" value={tiliryhmat} onChange={setTiliryhmat} options={opts4} />
        <FormField label="Lähteet" textarea value={lahteet} onChange={setLahteet} />
        <FileField label="Liitteet" onChange={setLiitteet} />
        <TwoCol>
          <FormField label="Vertailumäärä" type="number" value={vertailuMaara} onChange={setVertailuMaara} />
          <FormField label="Määrä muutoksen jälkeen" type="number" value={maaraMuutoksenJalkeen} onChange={setMaaraMuutoksenJalkeen} />
          <FormField label="Vertailuhinta (€)" type="number" value={vertailuhinta} onChange={setVertailuhinta} />
          <FormField label="Hinta muutoksen jälkeen (€)" type="number" value={hintaMuutoksenJalkeen} onChange={setHintaMuutoksenJalkeen} />
        </TwoCol>
        <TwoCol>
          <ReadOnlyField label="Kokonaisvertailuhinta (€)" value={kokonaisVertailuhinta} />
          <ReadOnlyField label="Kokonaishinta muutoksen jälkeen (€)" value={kokonaishintaMuutoksenJalkeen} />
        </TwoCol>
        <FormField label="Yhteystiedot (valinnainen)" value={yhteystiedot} onChange={setYhteystiedot} />
        <button
          type="submit"
          className="w-full inline-flex justify-center font-semibold px-6 py-3 rounded-xl transition bg-brand-600 text-white hover:bg-brand-700"
        >
          Lähetä säästöaloite
        </button>
      </form>
    </div>
  )
}

// 🔽 Helper components
function FormField({ label, value, onChange, type = 'text', textarea = false, required = false }) {
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

function SelectField({ label, value, onChange, options, disabled = false }) {
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

function FileField({ label, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input type="file" multiple onChange={e => onChange(e.target.files)} className="block w-full" />
    </div>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input type="number" disabled value={value} className="block w-full bg-neutral-100 border border-neutral-200 rounded-md shadow-sm" />
    </div>
  )
}

function TwoCol({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}
