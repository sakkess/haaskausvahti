import { useState, useEffect } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ reports }) => {
        setReports(reports || []);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-8 text-neutral-600">
        Ladataan säästöaloitteita…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-8 text-red-600">
        Virhe ladattaessa säästöaloitteita: {error}
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-h2 text-brand-800">Lähetetyt säästöaloitteet</h2>

      {reports.length === 0 ? (
        <p className="text-neutral-600">Säästöaloitteita ei vielä ole.</p>
      ) : (
        reports.map(r => {
          let attachments = [];
          if (Array.isArray(r.liitteet)) {
            attachments = r.liitteet;
          } else if (typeof r.liitteet === 'string') {
            try {
              attachments = JSON.parse(r.liitteet);
            } catch {
              attachments = [];
            }
          }

          return (
            <div key={r.id} className="card space-y-2 text-left">
              <h3 className="text-xl font-semibold text-brand-800">{r.otsikko}</h3>
              <p className="text-neutral-700">{r.kuvaus}</p>

              {(r.cofog1 || r.cofog2 || r.cofog3 || r.tiliryhmat) && (
                <p className="text-sm text-neutral-600">
                  <strong>COFOG:</strong> {r.cofog1 || '-'}
                  {r.cofog2 && ` / ${r.cofog2}`}
                  {r.cofog3 && ` / ${r.cofog3}`}<br />
                  <strong>Tiliryhmät:</strong> {r.tiliryhmat || '-'}
                </p>
              )}

              {r.lahteet && (
                <p className="text-sm">
                  <strong>Lähteet:</strong> {r.lahteet}
                </p>
              )}

              {r.yhteystiedot && (
                <p className="text-sm text-neutral-500">
                  <strong>Yhteystiedot:</strong> {r.yhteystiedot}
                </p>
              )}

              {attachments.length > 0 && (
                <div className="mt-2 space-y-1 text-sm">
                  <strong>Liitteet:</strong>
                  {attachments.map(url =>
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
                <div className="mt-2 text-sm space-y-1">
                  <p>
                    <strong>Kokonaisvertailuhinta:</strong>{' '}
                    {r.kokonaisvertailuhinta ?? '-'} €
                  </p>
                  <p>
                    <strong>Kokonaishinta muutoksen jälkeen:</strong>{' '}
                    {r.kokonaishinta_muutoksen_jalkeen ?? '-'} €
                  </p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
