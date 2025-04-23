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

const prDetailsSchema = new mongoose.Schema({
  prNumber: { type: Number },
  prTitle: { type: String },
  prDescription: { type: String },
  labels: { type: [String] },
  conversations: { type: [Object] },
  numConversations: { type: Number },
  participants: { type: [String] },
  numParticipants: { type: Number },
  commits: { type: [Object] },
  numCommits: { type: Number },
  filesChanged: { type: [String] },
  numFilesChanged: { type: Number },
  mergeDate: { type: Date },
});

const PrDetails =
  mongoose.models.PrDetails || mongoose.model('PrDetails', prDetailsSchema);

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const prNumber = parseInt(parts[3]);

  try {
    const prDetails = await PrDetails.findOne({ prNumber });
    if (!prDetails) {
      return res.status(404).json({ error: 'PR not found' });
    }

    // Return the PR details as JSON response
    res.json(prDetails);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default render;
