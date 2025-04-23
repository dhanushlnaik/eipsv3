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

const eipHistorySchema = new mongoose.Schema({
  eip: { type: String },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: Date },
  discussion: { type: String },
  deadline: { type: String },
  requires: { type: String },
  commitSha: { type: String },
  commitDate: { type: Date },
  mergedDate: { type: Date },
  prNumber: { type: Number },
  closedDate: { type: Date },
  changes: { type: Number },
  insertions: { type: Number },
  deletions: { type: Number },
  mergedDay: { type: Number },
  mergedMonth: { type: Number },
  mergedYear: { type: Number },
  // createdDate: { type: Date },
  createdMonth: { type: Number },
  createdYear: { type: Number },
  previousdeadline: { type: String },
  newdeadline: { type: String },
  message: { type: String },
});

const ErcHistory =
  mongoose.models.RipHistory || mongoose.model('RipHistory', eipHistorySchema);

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[4]);

  try {
    if (isNaN(eipNumber)) {
      return res.status(400).json({ message: 'Invalid RIP number' });
    }

    const ercHistory = await ErcHistory.find({ eip: eipNumber });

    res.json({ ...ercHistory, repo: 'rip' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default render;
