import { useState, useEffect } from 'react';

export default function Ilmoita() {
  const [otsikko, setOtsikko] = useState('');
  const [kuvaus, setKuvaus] = useState('');
  const [kategoria, setKategoria] = useState('');
  const [liitteet, setLiitteet] = useState(null);
  const [lahteet, setLahteet] = useState('');
  const [yhteystiedot, setYhteystiedot] = useState('');

  // Quantity & price
  const [vertailuMaara, setVertailuMaara] = useState('');
  const [maaraMuutoksenJalkeen, setMaaraMuutoksenJalkeen] = useState('');
  const [vertailuhinta, setVertailuhinta] = useState('');
  const [hintaMuutoksenJalkeen, setHintaMuutoksenJalkeen] = useState('');

  // Computed totals
  const [kokonaisVertailuhinta, setKokonaisVertailuhinta] = useState(0);
  const [kokonaishintaMuutoksenJalkeen, setKokonaishintaMuutoksenJalkeen] = useState(0);

  const kategoriat = [
    'Julkinen rakentaminen',
    'Hankinnat',
    'Koulutus',
    'Liikenne',
    'Muu'
  ];

  // Recompute totals whenever base values change
  useEffect(() => {
    const vm = parseFloat(vertailuMaara) || 0;
    const vh = parseFloat(vertailuhinta) || 0;
    setKokonaisVertailuhinta(vm * vh);
  }, [vertailuMaara, vertailuhinta]);

  useEffect(() => {
    const mm = parseFloat(maaraMuutoksenJalkeen) || 0;
    const hm = parseFloat(hintaMuutoksenJalkeen) || 0;
    setKokonaishintaMuutoksenJalkeen(mm * hm);
  }, [maaraMuutoksenJalkeen, hintaMuutoksenJalkeen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('otsikko', otsikko);
    formData.append('kuvaus', kuvaus);
    formData.append('kategoria', kategoria);
    formData.append('lahteet', lahteet);
    formData.append('yhteystiedot', yhteystiedot || '');
    // Attachments
    if (liitteet) {
      Array.from(liitteet).forEach((file) =>
        formData.append('liitteet', file)
      );
    }
    // Quantities & prices
    formData.append('vertailu_maara', vertailuMaara);
    formData.append('maara_muutoksen_jalkeen', maaraMuutoksenJalkeen);
    formData.append('vertailuhinta', vertailuhinta);
    formData.append('hinta_muutoksen_jalkeen', hintaMuutoksenJalkeen);
    // Computed totals
    formData.append('kokonaisvertailuhinta', kokonaisVertailuhinta);
    formData.append(
      'kokonaishinta_muutoksen_jalkeen',
      kokonaishintaMuutoksenJalkeen
    );

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Tuntematon palvelinvirhe');
      }
      alert('Ilmoitus lähetetty onnistuneesti!');
      // Reset form
      setOtsikko('');
      setKuvaus('');
      setKategoria('');
      setLahteet('');
      setLiitteet(null);
      setYhteystiedot('');
      setVertailuMaara('');
      setMaaraMuutoksenJalkeen('');
      setVertailuhinta('');
      setHintaMuutoksenJalkeen('');
    } catch (err) {
      console.error(err);
      alert(`Jokin meni pieleen: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ilmoita hukasta</h2>
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
            onChange={(e) => setOtsikko(e.target.value)}
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
            onChange={(e) => setKuvaus(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Kategoria */}
        <div>
          <label htmlFor="kategoria" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <select
            id="kategoria"
            value={kategoria}
            onChange={(e) => setKategoria(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Valitse kategoria</option>
            {kategoriat.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Lähteet */}
        <div>
          <label htmlFor="lahteet" className="block text-sm font-medium text-gray-700">
            Lähteet
          </label>
          <input
            id="lahteet"
            type="text"
            placeholder="URL tai muu lähde"
            value={lahteet}
            onChange={(e) => setLahteet(e.target.value)}
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
            onChange={(e) => setLiitteet(e.target.files)}
            className="mt-1 block w-full"
          />
        </div>

        {/* Quantity & Price inputs */}
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

        {/* Contact & Submit */}
        <div>
          <label htmlFor="yhteystiedot" className="block text-sm font-medium text-gray-700">
            Yhteystiedot (valinnainen)
          </label>
          <input
            id="yhteystiedot"
            type="text"
            placeholder="Sähköposti tai puhelin"
            value={yhteystiedot}
            onChange={(e) => setYhteystiedot(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Lähetä ilmoitus
        </button>
      </form>
    </div>
  );
}
