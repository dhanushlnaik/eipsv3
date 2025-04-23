import mongoose, { Document } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// Ensure Mongo URI is defined
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Connect to MongoDB
mongoose.connection.on('connected', () => {
  console.log('Connected to the database');
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});

if (mongoose.connection.readyState === 0) {
  mongoose.connect(mongoUri);
}

// Define Mongoose schema for IssueDetails
interface IIssueDetails extends Document {
  issueNumber: number;
  issueTitle: string;
  issueDescription: string;
  labels: string[];
  conversations: Conversation[];
  numConversations: number;
  participants: string[];
  numParticipants: number;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

interface Conversation {
  user: {
    login: string;
  };
}

const issueDetailsSchema = new mongoose.Schema<IIssueDetails>({
  issueNumber: { type: Number },
  issueTitle: { type: String },
  issueDescription: { type: String },
  labels: { type: [String] },
  conversations: { type: [Object] },
  numConversations: { type: Number },
  participants: { type: [String] },
  numParticipants: { type: Number },
  state: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  closedAt: { type: Date },
});

const IssueDetails =
  mongoose.models.IssueDetails ||
  mongoose.model('IssueDetails', issueDetailsSchema);

const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

// API handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { Type, number } = req.query;
  const typeString = Array.isArray(Type) ? Type[0] : Type || '';

  try {
    if (!typeString || !number) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    console.log('Issue number:', number);
    console.log('Type:', typeString);

    // Fetch issue details from GitHub API
    const issueResponse = await axios.get(
      `https://api.github.com/repos/ethereum/${typeString}/issues/${number}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (issueResponse.status === 200) {
      const issueDetails = await processIssueDetails(issueResponse.data);

      res.json({
        type: 'Issue',
        title: issueDetails.issueTitle,
        state: issueDetails.state,
        url: issueResponse.data.html_url,
        issueDetails,
      });
    } else {
      res.status(404).json({ error: 'Issue not found' });
    }
  } catch (error) {
    console.error(
      'Error fetching issue details:',
      (error as mongoose.Error).message
    );
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Process issue details
interface IssueData {
  number: number;
  title: string;
  body: string;
  labels: { name: string }[];
  state: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  html_url: string;
}

const processIssueDetails = async (
  issueData: IssueData
): Promise<IIssueDetails> => {
  try {
    const labels = issueData.labels.map((label) => label.name);
    const conversations = await fetchIssueConversations(issueData.number);
    const participants = getParticipants(conversations);

    const issueDetails = new IssueDetails({
      issueNumber: issueData.number,
      issueTitle: issueData.title,
      issueDescription: issueData.body,
      labels,
      conversations,
      numConversations: conversations.length,
      participants,
      numParticipants: participants.length,
      state: issueData.state,
      createdAt: new Date(issueData.created_at),
      updatedAt: new Date(issueData.updated_at),
      closedAt: issueData.closed_at ? new Date(issueData.closed_at) : null,
    });

    // Save issue details to the database
    await issueDetails.save();

    return issueDetails;
  } catch (error) {
    console.error('Error processing issue:', error);
    throw error;
  }
};

// Fetch issue comments
const fetchIssueConversations = async (
  issueNumber: number
): Promise<Conversation[]> => {
  try {
    let page = 1;
    let allConversations: Conversation[] = [];

    while (true) {
      const conversationResponse = await axios.get(
        `https://api.github.com/repos/ethereum/EIPs/issues/${issueNumber}/comments`,
        {
          params: { page, per_page: 100 },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const conversations: Conversation[] = conversationResponse.data;
      allConversations = allConversations.concat(conversations);

      if (conversations.length < 100) {
        break;
      }

      page++;
    }

    return allConversations;
  } catch (error) {
    console.error('Error fetching issue conversations:', error);
    throw error;
  }
};

// Extract unique participants
const getParticipants = (conversations: Conversation[]): string[] => {
  const commentParticipants = conversations
    .filter(
      (conversation) => conversation.user?.login !== 'github-actions[bot]'
    )
    .map((conversation) => conversation.user?.login);

  const uniqueParticipants = new Set(commentParticipants);

  return Array.from(uniqueParticipants);
};

export default handler;
