// src/components/Ilmoita.jsx
import { useState, useEffect } from 'react'
import dropdowns from '../data/dropdowns.json'  // <-- your JSON file

export default function Ilmoita() {
  // Other form state...
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [liitteet, setLiitteet] = useState(null)
  const [lahteet, setLahteet] = useState('')
  const [yhteystiedot, setYhteystiedot] = useState('')

  // Impact fields...
  const [vertailuMaara, setVertailuMaara] = useState('')
  const [maaraMuutoksenJalkeen, setMaaraMuutoksenJalkeen] = useState('')
  const [vertailuhinta, setVertailuhinta] = useState('')
  const [hintaMuutoksenJalkeen, setHintaMuutoksenJalkeen] = useState('')
  const [kokonaisVertailuhinta, setKokonaisVertailuhinta] = useState(0)
  const [kokonaishintaMuutoksenJalkeen, setKokonaishintaMuutoksenJalkeen] = useState(0)

  // Dropdown selections
  const [level1, setLevel1] = useState('')
  const [level2, setLevel2] = useState('')
  const [level3, setLevel3] = useState('')
  const [level4, setLevel4] = useState('')

  // Clear dependent dropdowns when parent changes:
  useEffect(() => {
    setLevel2('')
    setLevel3('')
  }, [level1])
  useEffect(() => {
    setLevel3('')
  }, [level2])

  // Filtered option lists:
  const opts1 = dropdowns.cofog1
  const opts2 = dropdowns.cofog2.filter(o => o.code.startsWith(level1))
  const opts3 = dropdowns.cofog3.filter(o => o.code.startsWith(level2))
  const opts4 = dropdowns.tiliryhmat

  // Recompute totals:
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
      // dropdowns
      formData.append('cofog1', level1)
      formData.append('cofog2', level2)
      formData.append('cofog3', level3)
      formData.append('tiliryhmat', level4)
      formData.append('lahteet', lahteet)
      formData.append('yhteystiedot', yhteystiedot)
      // attachments
      if (liitteet) Array.from(liitteet).forEach(f => formData.append('liitteet', f))
      // impact
      formData.append('vertailu_maara', vertailuMaara)
      formData.append('maara_muutoksen_jalkeen', maaraMuutoksenJalkeen)
      formData.append('vertailuhinta', vertailuhinta)
      formData.append('hinta_muutoksen_jalkeen', hintaMuutoksenJalkeen)
      formData.append('kokonaisvertailuhinta', kokonaisVertailuhinta)
      formData.append('kokonaishinta_muutoksen_jalkeen', kokonaishintaMuutoksenJalkeen)

    try {
      const res = await fetch('/api/reports', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Tuntematon virhe')
      alert('Ilmoitus lähetetty onnistuneesti!')
      // reset all...
      setOtsikko('')
      setKuvaus('')
      setLevel1('')
      setLevel2('')
      setLevel3('')
      setLevel4('')
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
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ilmoita hukasta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... otsikko, kuvaus, etc. ... */}

        {/* COFOG Taso 1 */}
        <div>
          <label htmlFor="cofog1" className="block text-sm font-medium text-gray-700">
            COFOG Taso 1
          </label>
          <select
            id="cofog1"
            value={level1}
            onChange={e => setLevel1(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Valitse…</option>
            {opts1.map(o => (
              <option key={o.code} value={o.code}>
                {o.code} {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* COFOG Taso 2 */}
        <div>
          <label htmlFor="cofog2" className="block text-sm font-medium text-gray-700">
            COFOG Taso 2
          </label>
          <select
            id="cofog2"
            value={level2}
            onChange={e => setLevel2(e.target.value)}
            disabled={!level1}
            className={`mt-1 block w-full rounded-md shadow-sm
              ${!level1
                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-white'}
            `}
          >
            <option value="">Valitse…</option>
            {opts2.map(o => (
              <option key={o.code} value={o.code}>
                {o.code} {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* COFOG Taso 3 */}
        <div>
          <label htmlFor="cofog3" className="block text-sm font-medium text-gray-700">
            COFOG Taso 3
          </label>
          <select
            id="cofog3"
            value={level3}
            onChange={e => setLevel3(e.target.value)}
            disabled={!level2}
            className={`mt-1 block w-full rounded-md shadow-sm
              ${!level2
                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-white'}
            `}
          >
            <option value="">Valitse…</option>
            {opts3.map(o => (
              <option key={o.code} value={o.code}>
                {o.code} {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tiliryhmät (4th dropdown) */}
        <div>
          <label htmlFor="tiliryhmat" className="block text-sm font-medium text-gray-700">
            Tiliryhmät
          </label>
          <select
            id="tiliryhmat"
            value={level4}
            onChange={e => setLevel4(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Valitse…</option>
            {opts4.map(o => (
              <option key={o.code} value={o.code}>
                {o.code} {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* ... rest of your form (liitteet, impact fields, submit) ... */}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Lähetä ilmoitus
        </button>
      </form>
    </div>
  )
}
