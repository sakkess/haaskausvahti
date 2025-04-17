import { IncomingForm } from 'formidable';

// Tell Vercel not to parse the body automatically
export const config = {
  api: { bodyParser: false }
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
      res.status(500).json({ error: 'Error parsing form' });
      return;
    }

    console.log('Received fields:', fields);
    console.log('Received files:', files);
    // TODO: Save fields to a database, store files, etc.

    res.status(200).json({ success: true });
  });
}
