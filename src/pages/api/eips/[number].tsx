import { Request, Response } from 'express';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined');
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: mongoose.Error) => {
    console.error('Error connecting to the database:', error.message);
  });

const mdFilesSchema = new mongoose.Schema({
  eip: { type: String, unique: true },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: String },
});

const EIPMdFiles =
  mongoose.models.EipMdFiles || mongoose.model('EipMdFiles', mdFilesSchema);

const handler = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[3]);

  EIPMdFiles.findOne({ eip: eipNumber })
    .then((eip: mongoose.Document | null) => {
      if (eip) {
        res.json({ ...eip.toObject(), repo: 'eip' });
      } else {
        res.status(404).json({ error: 'EIP not found' });
      }
    })
    .catch((error: mongoose.Error) => {
      console.error('Error retrieving EIP:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
};

export default handler;
