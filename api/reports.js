import { IncomingForm } from 'formidable';
import { supabase } from '../lib/supabaseClient.js';

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const form = new IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    supabase
      .from('reports')
      .insert([{
        otsikko: fields.otsikko,
        kuvaus: fields.kuvaus,
        sijainti: fields.sijainti,
        kategoria: fields.kategoria,
        yhteystiedot: fields.yhteystiedot || null,
      }])
      .then(({ data, error }) => {
        if (error) {
          console.error('Supabase insert error:', error);
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ success: true, report: data[0] });
      });
  });
}
