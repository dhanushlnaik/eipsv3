import StatusChange from '@/models/statusChange';
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

const MdFiles =
  mongoose.models.MdFiles || mongoose.model('MdFiles', mdFilesSchema);

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[3]);

  try {
    // Find the EIP's created date
    const eip = await MdFiles.findOne({ eip: eipNumber });

    if (!eip) {
      return res.status(404).json({ error: 'EIP not found' });
    }

    const createdDate = new Date(eip.created);

    // Find the first "Final" or "Withdrawn" status change
    const firstFinalStatus = await StatusChange.findOne({
      eip: eipNumber,
      toStatus: { $in: ['Final', 'Withdrawn'] },
    }).sort({ changeDate: 1 });

    if (!firstFinalStatus) {
      return res.status(404).json({ error: 'Final status not found' });
    }

    const finalStatusDate = new Date(firstFinalStatus.changeDate);

    // Calculate the time difference in milliseconds
    const timeDifference = finalStatusDate.getTime() - createdDate.getTime();

    // Convert milliseconds to days
    const daysToFinal = timeDifference / (1000 * 60 * 60 * 24);

    res.json({ eipNumber, daysToFinal, createdDate, finalStatusDate });
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default render;
