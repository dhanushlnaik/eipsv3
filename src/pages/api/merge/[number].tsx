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

const EipHistory =
  mongoose.models.EipHistory || mongoose.model('EipHistory', eipHistorySchema);

const handler = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[3]);

  try {
    const eip = await MdFiles.findOne({ eip: eipNumber }).exec();
    const latest_mergedate = await EipHistory.findOne({ eip: eipNumber })
      .sort({ mergedDate: -1 })
      .exec();

    if (eip) {
      res.json({
        EIP:
          eip +
          latest_mergedate['mergedMonth'] +
          latest_mergedate['mergedYear'],
      });
    } else {
      res.status(404).json({ error: 'EIP not found' });
    }
  } catch (error) {
    console.error('Error retrieving EIP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
