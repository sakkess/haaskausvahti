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
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          otsikko: fields.otsikko,
          kuvaus: fields.kuvaus,
          kategoria: fields.kategoria,
          alakategoria: fields.alakategoria || null,
          lahteet: fields.lahteet || null,
          yhteystiedot: fields.yhteystiedot || null,
          vertailu_maara: fields.vertailu_maara || null,
          maara_muutoksen_jalkeen: fields.maara_muutoksen_jalkeen || null,
          vertailuhinta: fields.vertailuhinta || null,
          hinta_muutoksen_jalkeen: fields.hinta_muutoksen_jalkeen || null,
          kokonaisvertailuhinta: fields.kokonaisvertailuhinta || null,
          kokonaishinta_muutoksen_jalkeen: fields.kokonaishinta_muutoksen_jalkeen || null,
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, report: data[0] });
    } catch (err) {
      console.error('Unexpected error inserting report:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
