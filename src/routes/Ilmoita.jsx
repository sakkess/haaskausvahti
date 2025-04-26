// src/routes/Ilmoita.jsx
import { useState, useEffect } from 'react'
import dropdowns from '../data/dropdowns.json'
import FormField     from '../components/form/FormField'
import SelectField   from '../components/form/SelectField'
import FileField     from '../components/form/FileField'
import ReadOnlyField from '../components/form/ReadOnlyField'
import TwoCol        from '../components/form/TwoCol'
import Button        from '../components/ui/Button'

export default function Ilmoita() {
  const [otsikko, setOtsikko] = useState('')
  const [kuvaus1, setKuvaus1] = useState('')
  const [kuvaus2, setKuvaus2] = useState('')
  const [kuvaus3, setKuvaus3] = useState('')
  const [nimimerkki, setNimimerkki] = useState('')
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

  // prepare dropdowns
  const dd1 = dropdowns.find(d => d.dropdown === 1) || { options: [] }
  const dd2 = dropdowns.find(d => d.dropdown === 2) || { options: [] }
  const dd3 = dropdowns.find(d => d.dropdown === 3) || { options: [] }
  const dd4 = dropdowns.find(d => d.dropdown === 4) || { options: [] }
  const opts1 = dd1.options
  const opts2 = dd2.options.filter(o => o.parent === cofog1)
  const opts3 = dd3.options.filter(o => o.parent === cofog2)
  const opts4 = dd4.options

  // cascade selects
  useEffect(() => { setCofog2(''); setCofog3('') }, [cofog1])
  useEffect(() => { setCofog3('') }, [cofog2])

  // auto‐select single‐option children
  useEffect(() => {
    if (opts2.length === 1 && cofog1 && !cofog2) {
      setCofog2(opts2[0].code)
    }
  }, [opts2, cofog1, cofog2])

  useEffect(() => {
    if (opts3.length === 1 && cofog2 && !cofog3) {
      setCofog3(opts3[0].code)
    }
  }, [opts3, cofog2, cofog3])

  // compute totals
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

  // submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    const payload = {
      otsikko,
      kuvaus1,
      kuvaus2,
      kuvaus3,
      nimimerkki,
      cofog1,
      cofog2,
      cofog3,
      tiliryhmat,
      lahteet,
      yhteystiedot,
      vertailu_maara: parseFloat(vertailuMaara) || null,
      maara_muutoksen_jalkeen: parseFloat(maaraMuutoksenJalkeen) || null,
      vertailuhinta: parseFloat(vertailuhinta) || null,
      hinta_muutoksen_jalkeen: parseFloat(hintaMuutoksenJalkeen) || null,
      kokonaisvertailuhinta: parseFloat(kokonaisVertailuhinta) || null,
      kokonaishinta_muutoksen_jalkeen: parseFloat(kokonaishintaMuutoksenJalkeen) || null
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Tuntematon virhe')
      alert('Ilmoitus lähetetty onnistuneesti!')
      // reset form
      setOtsikko(''); setKuvaus1(''); setKuvaus2(''); setKuvaus3('')
      setNimimerkki(''); setCofog1(''); setCofog2(''); setCofog3('')
      setTiliryhmat(''); setLahteet(''); setLiitteet(null); setYhteystiedot('')
      setVertailuMaara(''); setMaaraMuutoksenJalkeen('')
      setVertailuhinta(''); setHintaMuutoksenJalkeen('')
    } catch (err) {
      console.error(err)
      alert(`Jokin meni pieleen: ${err.message}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-brand-800 mb-4">
        Tee säästöaloite
      </h2>
      <p className="text-neutral-700 mb-6">
        Tekemäsi aloite näkyy tarkastuksen jälkeen “Säästöaloitteet” -sivulla.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Otsikko" required value={otsikko} onChange={setOtsikko} />

        <FormField
          label="Nykytilan kuvaus:"
          textarea
          rows={6}
          required
          placeholder="Mikä on käsityksesi mukaan nykyinen toimintamalli ja missä organisaatiossa tai alueella? Erottele selvästi mitä tiedät ja mitä uskot."
          value={kuvaus1}
          onChange={setKuvaus1}
        />
        <FormField
          label="Säästöaloitteen kuvaus:"
          textarea
          rows={6}
          required
          placeholder={
            `Mistä säästö muodostuu?\n` +
            `Vähennetäänkö 1. hintaa vai 2. määrää?\n` +
            `1. Onko hinnanalennus esimerkiksi hinnoittelumalli, edullisempi korvaava tuote- tai palvelutyyppi tai kilpailutus?\n` +
            `2. Onko määrän alennus esimerkiksi ostetun tuotteen tai palvelun laajuus, ostojen määrä per kuluttaja tai kuluttajien määrä?`
          }
          value={kuvaus2}
          onChange={setKuvaus2}
        />
        <FormField
          label="Muutoksen kuvaus:"
          textarea
          rows={6}
          required
          placeholder="Miten toteuttaisit muutoksen? Vaatiiko muutos näkemyksesi mukaan linjausta organisaatiossa, muutosta lainsäädännössä, uuden tuotteen- tai palvelun keksimistä?"
          value={kuvaus3}
          onChange={setKuvaus3}
        />

        <SelectField label="COFOG Taso 1" value={cofog1} onChange={setCofog1} options={opts1} />
        <SelectField label="COFOG Taso 2" value={cofog2} onChange={setCofog2} options={opts2} disabled={!cofog1} />
        <SelectField label="COFOG Taso 3" value={cofog3} onChange={setCofog3} options={opts3} disabled={!cofog2} />
        <SelectField label="Tiliryhmät" value={tiliryhmat} onChange={setTiliryhmat} options={opts4} />

        <FormField label="Lähteet" textarea value={lahteet} onChange={setLahteet} />
        <FileField label="Liitteet" onChange={setLiitteet} />

        <TwoCol>
          <FormField label="Vertailumäärä" type="number" value={vertailuMaara} onChange={setVertailuMaara} />
          <FormField label="Määrä muutoksen jälkeen" type="number" value={maaraMuutoksenJalkeen} onChange={setMaaraMuutoksenJalkeen} />
        </TwoCol>
        <TwoCol>
          <FormField label="Vertailuhinta (€)" type="number" value={vertailuhinta} onChange={setVertailuhinta} />
          <FormField label="Hinta muutoksen jälkeen (€)" type="number" value={hintaMuutoksenJalkeen} onChange={setHintaMuutoksenJalkeen} />
        </TwoCol>
        <TwoCol>
          <ReadOnlyField label="Kokonaisvertailuhinta (€)" value={kokonaisVertailuhinta} />
          <ReadOnlyField label="Kokonaishinta muutoksen jälkeen (€)" value={kokonaishintaMuutoksenJalkeen} />
        </TwoCol>

        {/* Moved Nimimerkki field here, right above Yhteystiedot */}
        <FormField
          label="Nimimerkki"
          value={nimimerkki}
          onChange={setNimimerkki}
          placeholder="Esimerkiksi työnimike tai muu aloitteen kontekstiin liittyvä nimike."
        />

        <FormField label="Yhteystiedot (valinnainen)" value={yhteystiedot} onChange={setYhteystiedot} />
        <p className="text-sm text-neutral-500">
          Yhteystietosi näkyvät vain raportin tarkastajalle lisätietojen kysymistä varten.
        </p>

        <Button type="submit" className="w-full">
          Lähetä säästöaloite
        </Button>
      </form>
    </div>
  )
}
