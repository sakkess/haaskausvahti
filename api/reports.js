// api/reports.js
import fs from 'fs';
import { IncomingForm } from 'formidable';
import { supabase } from '../lib/supabaseClient.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).send('Method Not Allowed');

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form' });
    }

    try {
      // 1️⃣ Validate & collect files
      const fileObjs = files.liitteet
        ? Array.isArray(files.liitteet)
          ? files.liitteet
          : [files.liitteet]
        : [];

      const uploadedUrls = [];
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
      const ALLOWED = ['image/png','image/jpeg','application/pdf'];

      for (const file of fileObjs) {
        // Type & size checks
        if (!ALLOWED.includes(file.mimetype)) {
          return res.status(400).json({ error: 'Sallitut tiedostotyypit: PNG, JPG, PDF' });
        }
        if (file.size > MAX_SIZE) {
          return res.status(400).json({ error: 'Tiedosto on liian suuri (max 5 MB).' });
        }

        // Read file buffer
        const buffer = fs.readFileSync(file.filepath);
        const filename = `${Date.now()}_${file.originalFilename}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadErr } = await supabase
          .storage
          .from('liitteet')
          .upload(filename, buffer, { contentType: file.mimetype });
        if (uploadErr) throw uploadErr;

        // Create a signed URL valid for 1 hour
        const { data: { signedUrl }, error: urlErr } = await supabase
          .storage
          .from('liitteet')
          .createSignedUrl(uploadData.path, 60 * 60);
        if (urlErr) throw urlErr;

        uploadedUrls.push(signedUrl);
      }

      // 2️⃣ Insert the report row
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
          liitteet: uploadedUrls.length ? uploadedUrls : null,
        }])
        .select();

      if (error) throw error;
      return res.status(200).json({ success: true, report: data[0] });

    } catch (uploadError) {
      console.error('Error in reports handler:', uploadError);
      return res.status(500).json({ error: uploadError.message });
    }
  });
}
