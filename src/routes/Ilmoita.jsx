import { useState } from 'react';

export default function Ilmoita() {
  const [otsikko, setOtsikko] = useState('');
  const [kuvaus, setKuvaus] = useState('');
  const [sijainti, setSijainti] = useState('');
  const [kategoria, setKategoria] = useState('');
  const [liitteet, setLiitteet] = useState(null);
  const [yhteystiedot, setYhteystiedot] = useState('');

  const kategoriat = [
    'Julkinen rakentaminen',
    'Hankinnat',
    'Koulutus',
    'Liikenne',
    'Muu'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Lähetä data backendille
    const report = { otsikko, kuvaus, sijainti, kategoria, yhteystiedot };
    console.log('Ilmoitus lähetetty:', report);
    // Voit lisätä liitteiden käsittelyn myöhemmin
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ilmoita hukasta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div>
          <label htmlFor="sijainti" className="block text-sm font-medium text-gray-700">
            Sijainti
          </label>
          <input
            id="sijainti"
            type="text"
            placeholder="Kaupunki tai tarkempi osoite"
            value={sijainti}
            onChange={e => setSijainti(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="kategoria" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <select
            id="kategoria"
            value={kategoria}
            onChange={e => setKategoria(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Valitse kategoria</option>
            {kategoriat.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

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
          Lähetä ilmoitus
        </button>
      </form>
    </div>
  );
}
