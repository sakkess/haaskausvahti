// api/reports.js
import fs from 'fs';
import { IncomingForm } from 'formidable';
import { supabase } from '../lib/supabaseClient.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ─── GET all reports ─────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ reports });
    } catch (err) {
      console.error('Error fetching reports:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── POST a new report (your existing logic) ────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    // sanitize numbers...
    const vertailuMaaraVal = Array.isArray(fields.vertailu_maara)
      ? null
      : parseFloat(fields.vertailu_maara) || null;
    const maaraMuutVal = Array.isArray(fields.maara_muutoksen_jalkeen)
      ? null
      : parseFloat(fields.maara_muutoksen_jalkeen) || null;
    const vertHintaVal = Array.isArray(fields.vertailuhinta)
      ? null
      : parseFloat(fields.vertailuhinta) || null;
    const hintaMuutVal = Array.isArray(fields.hinta_muutoksen_jalkeen)
      ? null
      : parseFloat(fields.hinta_muutoksen_jalkeen) || null;
    const kokVertVal = Array.isArray(fields.kokonaisvertailuhinta)
      ? null
      : parseFloat(fields.kokonaisvertailuhinta) || null;
    const kokMuutVal = Array.isArray(fields.kokonaishinta_muutoksen_jalkeen)
      ? null
      : parseFloat(fields.kokonaishinta_muutoksen_jalkeen) || null;

    try {
      // upload attachments...
      const fileObjs = files.liitteet
        ? Array.isArray(files.liitteet)
          ? files.liitteet
          : [files.liitteet]
        : [];
      const uploadedUrls = [];
      const MAX_SIZE = 5 * 1024 * 1024;
      const ALLOWED = ['image/png','image/jpeg','application/pdf'];

      for (const file of fileObjs) {
        if (!ALLOWED.includes(file.mimetype)) {
          return res.status(400).json({ error: 'Sallitut tiedostotyypit: PNG, JPG, PDF' });
        }
        if (file.size > MAX_SIZE) {
          return res.status(400).json({ error: 'Tiedosto on liian suuri (max 5 MB).' });
        }

        const buffer = fs.readFileSync(file.filepath);
        const filename = `${Date.now()}_${file.originalFilename}`;
        const { data: uploadData, error: uploadErr } = await supabase
          .storage.from('liitteet').upload(filename, buffer, { contentType: file.mimetype });
        if (uploadErr) throw uploadErr;

        const { data: { signedUrl }, error: urlErr } = await supabase
          .storage.from('liitteet').createSignedUrl(uploadData.path, 60 * 60);
        if (urlErr) throw urlErr;

        uploadedUrls.push(signedUrl);
      }

      // insert row
      const { data, error } = await supabase.from('reports').insert([{
        otsikko: fields.otsikko,
        kuvaus: fields.kuvaus,
        cofog1:   fields.cofog1   || null,
        cofog2:   fields.cofog2   || null,
        cofog3:   fields.cofog3   || null,
        tiliryhmat: fields.tiliryhmat || null,      
        lahteet: fields.lahteet || null,
        yhteystiedot: fields.yhteystiedot || null,
        vertailu_maara: vertailuMaaraVal,
        maara_muutoksen_jalkeen: maaraMuutVal,
        vertailuhinta: vertHintaVal,
        hinta_muutoksen_jalkeen: hintaMuutVal,
        kokonaisvertailuhinta: kokVertVal,
        kokonaishinta_muutoksen_jalkeen: kokMuutVal,
        liitteet: uploadedUrls.length ? uploadedUrls : null,
      }]).select();

      if (error) throw error;
      return res.status(200).json({ success: true, report: data[0] });
    } catch (uploadError) {
      console.error('Error in reports handler:', uploadError);
      return res.status(500).json({ error: uploadError.message });
    }
  });
}
