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
      <h2 className="text-h2 text-brand-800 mb-6">Tee säästöaloite</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Keep all inputs as-is but feel free to replace border-gray-300 → border-neutral-300 */}
        {/* and text-gray-* → text-neutral-* or brand-* to match your palette */}

        {/* Submit button */}
        <button type="submit" className="btn-primary w-full">
          Lähetä säästöaloite
        </button>
      </form>
    </div>
  )
}
