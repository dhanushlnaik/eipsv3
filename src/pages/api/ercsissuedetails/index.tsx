import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';

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

// Define the Issue schema interface
interface IIssueDetails extends Document {
  issueNumber: number;
  issueTitle: string;
  issueDescription?: string;
  labels?: string[];
  conversations?: object[];
  numConversations: number;
  participants?: string[];
  numParticipants: number;
  state: string;
  createdAt: Date;
  closedAt?: Date;
  updatedAt: Date;
  author: string;
}

// Define the schema for IssueDetails
const IssueDetailsSchema = new mongoose.Schema<IIssueDetails>({
  issueNumber: { type: Number, required: true, unique: true },
  issueTitle: { type: String, required: true },
  issueDescription: { type: String },
  labels: { type: [String] },
  conversations: { type: [Object] },
  numConversations: { type: Number, default: 0 },
  participants: { type: [String] },
  numParticipants: { type: Number, default: 0 },
  state: { type: String, required: true },
  createdAt: { type: Date, required: true },
  closedAt: { type: Date },
  updatedAt: { type: Date, required: true },
  author: { type: String, required: true },
});

// Check or create the model
const IssueDetails =
  mongoose.models.AllErcsIssueDetails ||
  mongoose.model<IIssueDetails>('AllErcsIssueDetails', IssueDetailsSchema);

const getIssueDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch Issue details with selected fields
    const issueDetails = await IssueDetails.find({})
      .select('issueNumber issueTitle createdAt closedAt state')
      .exec();

    // Transform the data to include createdAt, closedAt, and state
    const transformedDetails = issueDetails.map((issue) => {
      const created_at = issue.createdAt;
      const closed_at = issue.closedAt;
      const state = issue.state;

      return {
        repo: 'ERCs',
        IssueNumber: issue.issueNumber,
        IssueTitle: issue.issueTitle,
        created_at,
        closed_at,
        state,
      };
    });

    // Return the Issue details as JSON response
    res.json(transformedDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default getIssueDetails;
