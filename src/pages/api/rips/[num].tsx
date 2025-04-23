import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure Mongo URI is defined
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Connect to MongoDB
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

const RIPMdFiles =
  mongoose.models.RipMdFiles || mongoose.model('RipMdFiles', mdFilesSchema);

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[3]);

  RIPMdFiles.findOne({ eip: eipNumber })
    .then((eip: typeof RIPMdFiles) => {
      if (eip) {
        res.json({ ...eip, repo: 'rip' });
      } else {
        res.status(404).json({ error: 'EIP not found' });
      }
    })
    .catch((error: mongoose.Error) => {
      console.error('Error retrieving EIP:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
};

export default render;
