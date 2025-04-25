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

const EIPMdFiles =
  mongoose.models.EipMdFiles || mongoose.model('EipMdFiles', mdFilesSchema);
const ERCMdFiles =
  mongoose.models.ErcMdFiles || mongoose.model('ErcMdFiles', mdFilesSchema);
const RIPMdFiles =
  mongoose.models.RipMdFiles || mongoose.model('RipMdFiles', mdFilesSchema);

const handler = async (req: Request, res: Response) => {
  try {
    const eipResult = await EIPMdFiles.aggregate([
      {
        $match: {
          eip: { $nin: ['7212'] },
          category: { $nin: ['ERC', 'ERCs'] },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const eipModified = eipResult.map(
      (item: {
        eip: string;
        title: string;
        author: string;
        status: string;
        type: string;
        category: string;
        created: string;
        _id: string;
      }) => {
        return { ...item, repo: 'eip' };
      }
    );

    const ercResult = await ERCMdFiles.aggregate([
      {
        $sort: {
          _id: 1, // Sort by status in ascending order
        },
      },
    ]);

    const ercModified = ercResult.map(
      (item: {
        eip: string;
        title: string;
        author: string;
        status: string;
        type: string;
        category: string;
        created: string;
        _id: string;
      }) => {
        return { ...item, repo: 'erc' };
      }
    );

    const ripResult = await RIPMdFiles.aggregate([
      {
        $sort: {
          _id: 1, // Sort by status in ascending order
        },
      },
    ]);

    const ripModified = ripResult.map(
      (item: {
        eip: string;
        title: string;
        author: string;
        status: string;
        type: string;
        category: string;
        created: string;
        _id: string;
      }) => {
        return { ...item, repo: 'rip' };
      }
    );

    res.json({ eip: eipModified, erc: ercModified, rip: ripModified });
  } catch (error) {
    console.error('Error retrieving EIPs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
