// src/routes/Reports.jsx
import { useState, useEffect } from 'react';
import Card from '../components/Card';

export default function Reports() {
  /* ------------ data fetching ------------ */
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    fetch('/api/reports')
      .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
      .then(({ reports }) => setReports(reports ?? []))
      .catch(err => { console.error(err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-8 text-center text-neutral-500">Ladataan…</p>;
  if (error)   return <p className="mt-8 text-center text-red-600">Virhe: {error}</p>;

  /* ------------ helpers ------------ */
  const badge = 'inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700';

  /* ------------ UI ------------ */
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-h2">Lähetetyt säästöaloitteet</h2>

      {reports.length === 0 ? (
        <p className="text-neutral-600">Säästöaloitteita ei vielä ole.</p>
      ) : (
        reports.map(r => {
          /* attachments → always an array of urls */
          let attachments = [];
          if (Array.isArray(r.liitteet)) attachments = r.liitteet;
          else if (typeof r.liitteet === 'string')
            try { attachments = JSON.parse(r.liitteet); } catch {}

          return (
            <Card key={r.id}>
              <h3 className="text-h3">{r.otsikko}</h3>
              <p className="mt-1">{r.kuvaus}</p>

              {/* codes */}
              <div className="mt-3 flex flex-wrap gap-2">
                {r.cofog1 && <span className={badge}>{r.cofog1}</span>}
                {r.cofog2 && <span className={badge}>{r.cofog2}</span>}
                {r.cofog3 && <span className={badge}>{r.cofog3}</span>}
                {r.tiliryhmat && (
                  <span className={`${badge} bg-accent-100 text-accent-700 ring-1 ring-accent-400/30`}>
                    {r.tiliryhmat}
                  </span>
                )}
              </div>

              {/* numbers */}
              {(r.vertailu_maara || r.maara_muutoksen_jalkeen) && (
                <p className="mt-3 text-sm">
                  <strong>Määrä:</strong> {r.vertailu_maara ?? '-'} → {r.maara_muutoksen_jalkeen ?? '-'}
                </p>
              )}
              {(r.vertailuhinta || r.hinta_muutoksen_jalkeen) && (
                <p className="text-sm">
                  <strong>Hinta €/yks:</strong> {r.vertailuhinta ?? '-'} → {r.hinta_muutoksen_jalkeen ?? '-'}
                </p>
              )}
              {(r.kokonaisvertailuhinta || r.kokonaishinta_muutoksen_jalkeen) && (
                <p className="mt-2 text-sm">
                  <strong>Kokonaisvertailuhinta:</strong> {r.kokonaisvertailuhinta ?? '-'} €<br/>
                  <strong>Kokonaishinta muutoksen jälkeen:</strong> {r.kokonaishinta_muutoksen_jalkeen ?? '-'} €
                </p>
              )}

              {r.lahteet && <p className="mt-2 text-sm"><strong>Lähteet:</strong> {r.lahteet}</p>}

              {attachments.length > 0 && (
                <div className="mt-2 space-y-1 text-sm">
                  <strong>Liitteet:</strong>
                  {attachments.map(url =>
                    /\.(jpe?g|png)$/i.test(url) ? (
                      <img key={url} src={url} alt="" className="max-w-full rounded"/>
                    ) : (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                         className="block text-brand-600 underline">Lataa liite</a>
                    )
                  )}
                </div>
              )}

              {r.yhteystiedot && (
                <p className="mt-2 text-xs text-neutral-500">
                  <strong>Yhteystiedot:</strong> {r.yhteystiedot}
                </p>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
