import { useState, useEffect } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then(({ reports }) => setReports(reports))
      .catch(console.error);
  }, []);

  if (!reports.length) {
    return <p className="text-center mt-8">Ei raportteja vielä.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Lähetetyt raportit</h2>
      {reports.map((r) => (
        <div key={r.id} className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold">{r.otsikko}</h3>
          <p className="text-gray-700">{r.kuvaus}</p>
          <p className="text-sm text-gray-500">
            {r.kategoria} / {r.alakategoria}
          </p>
          {r.lahteet && (
            <p className="mt-2 text-sm">
              <strong>Lähteet:</strong> {r.lahteet}
            </p>
          )}
          {r.liitteet?.length > 0 && (
            <div className="mt-2 space-y-1">
              <strong>Liitteet:</strong>
              {r.liitteet.map((url) => (
                url.match(/\.(jpe?g|png)$/i) ? (
                  <img src={url} key={url} alt="" className="max-w-full rounded" />
                ) : (
                  <a
                    href={url}
                    key={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    Lataa liite
                  </a>
                )
              ))}
            </div>
          )}
          {/* numeric impact, if present */}
          {(r.kokonaisvertailuhinta || r.kokonaishinta_muutoksen_jalkeen) && (
            <div className="mt-2 text-sm">
              <p>Kokonaisvertailuhinta: {r.kokonaisvertailuhinta ?? '-'} €</p>
              <p>Kokonaishinta muutoksen jälkeen: {r.kokonaishinta_muutoksen_jalkeen ?? '-'} €</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
