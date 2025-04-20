// src/routes/Reports.jsx
import { useState, useEffect } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);     // will hold the array
  const [loading, setLoading] = useState(true);   // true until fetch completes
  const [error, setError] = useState(null);       // set if fetch or JSON parsing fails

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ reports }) => {
        setReports(reports || []);
      })
      .catch((err) => {
        console.error('Error fetching reports:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // 1) Loading state
  if (loading) {
    return (
      <p className="text-center mt-8 text-gray-600">
        Ladataan raportteja…
      </p>
    );
  }

  // 2) Error state
  if (error) {
    return (
      <p className="text-center mt-8 text-red-600">
        Virhe ladattaessa raportteja: {error}
      </p>
    );
  }

  // 3) No reports yet
  if (reports.length === 0) {
    return (
      <p className="text-center mt-8 text-gray-600">
        Ei raportteja vielä.
      </p>
    );
  }

  // 4) Render the list
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold">Lähetetyt raportit</h2>
      {reports.map((r) => (
        <div key={r.id} className="p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold">{r.otsikko}</h3>
          <p className="text-gray-700">{r.kuvaus}</p>
          <p className="text-sm text-gray-500">
            {r.kategoria}{r.alakategoria && ` / ${r.alakategoria}`}
          </p>

          {r.lahteet && (
            <p className="mt-2 text-sm">
              <strong>Lähteet:</strong> {r.lahteet}
            </p>
          )}

          {r.liitteet?.length > 0 && (
            <div className="mt-2 space-y-1">
              <strong>Liitteet:</strong>
              {r.liitteet.map((url) =>
                /\.(jpe?g|png)$/i.test(url) ? (
                  <img
                    src={url}
                    key={url}
                    alt=""
                    className="max-w-full rounded"
                  />
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
              )}
            </div>
          )}

          {(r.kokonaisvertailuhinta || r.kokonaishinta_muutoksen_jalkeen) && (
            <div className="mt-2 text-sm">
              <p>
                <strong>Kokonaisvertailuhinta:</strong>{' '}
                {r.kokonaisvertailuhinta ?? '-'} €
              </p>
              <p>
                <strong>Kokonaishinta muutoksen jälkeen:</strong>{' '}
                {r.konanaishinta_muutoksen_jalkeen ?? '-'} €
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
