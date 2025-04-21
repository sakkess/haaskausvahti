// src/routes/Ilmoita.jsx
import { useState, useEffect } from 'react'
import dropdowns from '../data/dropdowns.json'

export default function Ilmoita() {
  // Basic fields
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus, setKuvaus] = useState('')
  const [liitteet, setLiitteet] = useState(null)
  const [lahteet, setLahteet] = useState('')
  const [yhteystiedot, setYhteystiedot] = useState('')

  // Impact fields
  const [vertailuMaara, setVertailuMaara] = useState('')
  const [maaraMuutoksenJalkeen, setMaaraMuutoksenJalkeen] = useState('')
  const [vertailuhinta, setVertailuhinta] = useState('')
  const [hintaMuutoksenJalkeen, setHintaMuutoksenJalkeen] = useState('')
  const [kokonaisVertailuhinta, setKokonaisVertailuhinta] = useState(0)
  const [kokonaishintaMuutoksenJalkeen, setKokonaishintaMuutoksenJalkeen] = useState(0)

  // Dropdown selections
  const [cofog1, setCofog1] = useState('')
  const [cofog2, setCofog2] = useState('')
  const [cofog3, setCofog3] = useState('')
  const [tiliryhmat, setTiliryhmat] = useState('')

  // Reset dependent dropdowns
  useEffect(() => {
    setCofog2('')
    setCofog3('')
  }, [cofog1])

  useEffect(() => {
    setCofog3('')
  }, [cofog2])

  // Pull and filter options from JSON
  const dd1 = dropdowns.find(d => d.dropdown === 1) || { options: [] }
  const dd2 = dropdowns.find(d => d.dropdown === 2) || { options: [] }
  const dd3 = dropdowns.find(d => d.dropdown === 3) || { options: [] }
  const dd4 = dropdowns.find(d => d.dropdown === 4) || { options: [] }

  const opts1 = dd1.options
  const opts2 = dd2.options.filter(o => o.parent === cofog1)
  const opts3 = dd3.options.filter(o => o.parent === cofog2)
  const opts4 = dd4.options

  // Compute totals
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
      // reset everything
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
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Tee säästöaloite</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Otsikko */}
        <div>
          <label htmlFor="otsikko" className="block text-sm font-medium text-gray-700">
            Otsikko <span className="text-red-500">*</span>
          </label>
          <input
            id="otsikko"
            type="text"
            required
            value={otsikko}
            onChange={e => setOtsikko(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Kuvaus */}
        <div>
          <label htmlFor="kuvaus" className="block text-sm font-medium text-gray-700">
            Kuvaus <span className="text-red-500">*</span>
          </label>
          <textarea
            id="kuvaus"
            rows="4"
            required
            value={kuvaus}
            onChange={e => setKuvaus(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* COFOG Taso 1 */}
        <div>
          <label htmlFor="cofog1" className="block text-sm font-medium text-gray-700">
            COFOG Taso 1
          </label>
          <select
            id="cofog1"
            value={cofog1}
            onChange={e => setCofog1(e.target.value)}
            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="">Valitse…</option>
            {opts1.map(o => (
              <option key={o.code} value={o.code}>
                {o.code}&nbsp;{o.label}
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
            value={cofog2}
            onChange={e => setCofog2(e.target.value)}
            disabled={!cofog1}
            className={
              `mt-1 block w-full rounded-md shadow-sm ` +
              (!cofog1
                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-white')
            }
          >
            <option value="">Valitse…</option>
            {opts2.map(o => (
              <option key={o.code} value={o.code}>
                {o.code}&nbsp;{o.label}
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
            value={cofog3}
            onChange={e => setCofog3(e.target.value)}
            disabled={!cofog2}
            className={
              `mt-1 block w-full rounded-md shadow-sm ` +
              (!cofog2
                ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'border-gray-300 bg-white')
            }
          >
            <option value="">Valitse…</option>
            {opts3.map(o => (
              <option key={o.code} value={o.code}>
                {o.code}&nbsp;{o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tiliryhmät */}
        <div>
          <label htmlFor="tiliryhmat" className="block text-sm font-medium text-gray-700">
            Tiliryhmät
          </label>
          <select
            id="tiliryhmat"
            value={tiliryhmat}
            onChange={e => setTiliryhmat(e.target.value)}
            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="">Valitse…</option>
            {opts4.map(o => (
              <option key={o.code} value={o.code}>
                {o.code}&nbsp;{o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lähteet */}
        <div>
          <label htmlFor="lahteet" className="block text-sm font-medium text-gray-700">
            Lähteet
          </label>
          <textarea
            id="lahteet"
            rows="3"
            placeholder="URL tai muu lähde"
            value={lahteet}
            onChange={e => setLahteet(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Liitteet */}
        <div>
          <label htmlFor="liitteet" className="block text-sm font-medium text-gray-700">
            Liitteet (kuvat/PDF)
          </label>
          <input
            id="liitteet"
            type="file"
            multiple
            onChange={e => setLiitteet(e.target.files)}
            className="mt-1 block w-full"
          />
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="vertailu_maara" className="block text-sm font-medium text-gray-700">
              Vertailumäärä
            </label>
            <input
              id="vertailu_maara"
              type="number"
              step="any"
              value={vertailuMaara}
              onChange={e => setVertailuMaara(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="maara_muutoksen_jalkeen" className="block text-sm font-medium text-gray-700">
              Määrä muutoksen jälkeen
            </label>
            <input
              id="maara_muutoksen_jalkeen"
              type="number"
              step="any"
              value={maaraMuutoksenJalkeen}
              onChange={e => setMaaraMuutoksenJalkeen(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="vertailuhinta" className="block text-sm font-medium text-gray-700">
              Vertailuhinta (€)
            </label>
            <input
              id="vertailuhinta"
              type="number"
              step="any"
              value={vertailuhinta}
              onChange={e => setVertailuhinta(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="hinta_muutoksen_jalkeen" className="block text-sm font-medium text-gray-700">
              Hinta muutoksen jälkeen (€)
            </label>
            <input
              id="hinta_muutoksen_jalkeen"
              type="number"
              step="any"
              value={hintaMuutoksenJalkeen}
              onChange={e => setHintaMuutoksenJalkeen(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Computed totals */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kokonaisvertailuhinta (€)
            </label>
            <input
              type="number"
              value={kokonaisVertailuhinta}
              disabled
              className="mt-1 block w-full border-gray-200 bg-gray-100 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kokonaishinta muutoksen jälkeen (€)
            </label>
            <input
              type="number"
              value={kokonaishintaMuutoksenJalkeen}
              disabled
              className="mt-1 block w-full border-gray-200 bg-gray-100 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Yhteystiedot & Submit */}
        <div>
          <label htmlFor="yhteystiedot" className="block text-sm font-medium text-gray-700">
            Yhteystiedot (valinnainen)
          </label>
          <input
            id="yhteystiedot"
            type="text"
            placeholder="Sähköposti tai puhelin"
            value={yhteystiedot}
            onChange={e => setYhteystiedot(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Lähetä säästöaloite
        </button>
      </form>
    </div>
  )
}