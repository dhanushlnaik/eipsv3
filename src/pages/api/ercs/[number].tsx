import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

// Ensure Mongo URI is defined
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined');
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

// Define schema interface
interface IMdFile extends Document {
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
}

// Define the schema for ERCMdFiles
const mdFilesSchema = new mongoose.Schema<IMdFile>({
  eip: { type: String, unique: true },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: String },
});

// Check or create the model
const ERCMdFiles =
  mongoose.models.ErcMdFiles ||
  mongoose.model<IMdFile>('ErcMdFiles', mdFilesSchema);

const handler = async (req: Request, res: Response): Promise<void> => {
  // Extract EIP number from the request URL
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[3], 10);

  // Fetch EIP details from the database
  try {
    const eip = await ERCMdFiles.findOne({ eip: eipNumber });

    if (eip) {
      res.json({ ...eip.toObject(), repo: 'erc' });
    } else {
      res.status(404).json({ error: 'EIP not found' });
    }
  } catch (error) {
    console.error('Error retrieving EIP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
