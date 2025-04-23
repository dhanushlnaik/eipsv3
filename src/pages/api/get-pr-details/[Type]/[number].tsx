import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import mongoose from 'mongoose';

const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

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

interface Commit {
  committer: {
    login: string;
  };
}

interface Conversation {
  user: {
    login: string;
  };
}

interface PRDetails {
  prNumber: number;
  prTitle: string;
  prDescription: string;
  labels: string[];
  conversations: Conversation[];
  numConversations: number;
  participants: string[];
  numParticipants: number;
  commits: Commit[];
  numCommits: number;
  filesChanged: string[];
  numFilesChanged: number;
  mergeDate: Date | null;
}

const PrDetails =
  mongoose.models.PrDetails || mongoose.model('PrDetails', prDetailsSchema);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { Type, number } = req.query;
  const typeString = Array.isArray(Type) ? Type[0] : Type || '';

  try {
    let prDetails: PRDetails | null = null;

    try {
      const prResponse = await axios.get(
        `https://api.github.com/repos/ethereum/${typeString}/pulls/${number}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (prResponse.status === 200) {
        const issueDetails = await processPRDetails(
          prResponse.data,
          typeString
        );

        let state = prResponse.data.state;
        if (state === 'closed' && prResponse.data.merged === true) {
          state = 'merged';
        }

        const commentsResponse = await axios.get(
          `https://api.github.com/repos/ethereum/${typeString}/pulls/${number}/reviews`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        let allConversations2: Conversation[] = commentsResponse.data;

        allConversations2 = allConversations2.concat(commentsResponse.data);

        const participants2 = getParticipants2(allConversations2);

        const commitAuthor = issueDetails?.commits[0]?.committer.login;

        const mergedParticipants = new Set([
          ...issueDetails.participants,
          ...participants2,
          ...(commitAuthor ? [commitAuthor] : []),
        ]);

        const uniqueParticipantsArray = Array.from(mergedParticipants);

        issueDetails.participants = uniqueParticipantsArray;
        issueDetails.numParticipants = uniqueParticipantsArray.length;

        prDetails = {
          prNumber: prResponse.data.number,
          prTitle: prResponse.data.title,
          prDescription: prResponse.data.body,
          labels: issueDetails.labels,
          conversations: issueDetails.conversations,
          numConversations: issueDetails.numConversations,
          participants: issueDetails.participants,
          numParticipants: issueDetails.numParticipants,
          commits: issueDetails.commits,
          numCommits: issueDetails.numCommits,
          filesChanged: issueDetails.filesChanged,
          numFilesChanged: issueDetails.numFilesChanged,
          mergeDate: issueDetails.mergeDate,
        };
      }
    } catch (prError) {
      console.log(prError);
      console.log('Not a PR, now checking for issues');
    }

    if (prDetails) {
      res.json(prDetails);
    } else {
      res.status(404).json({ error: 'PR or open Issue not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Process PR details
const processPRDetails = async (
  prData: {
    labels: { name: string }[];
    number: number;
    state: string;
    title: string;
    body: string;
    merged_at: string | null;
    commits: Commit[];
  },
  Type: string
): Promise<PRDetails> => {
  try {
    const labels = prData.labels.map((label: { name: string }) => label.name);
    const conversations = await fetchConversations(Type, prData.number);
    const commits = await fetchCommits(Type, prData.number);
    const participants = getParticipants(conversations, commits);
    const files = await fetchFilesChanged(Type, prData.number);
    const mergeDate = prData.merged_at ? new Date(prData.merged_at) : null;

    const newPrDetails = new PrDetails({
      prNumber: prData.number,
      state: prData.state,
      prTitle: prData.title,
      prDescription: prData.body,
      labels,
      conversations,
      numConversations: conversations.length,
      participants,
      numParticipants: participants.length,
      commits,
      numCommits: commits.length,
      filesChanged: files,
      numFilesChanged: files.length,
      mergeDate,
    });

    await newPrDetails.save();

    return newPrDetails;
  } catch (error) {
    console.log('Error processing PR:', error);
    throw error;
  }
};

// Fetch conversations
const fetchConversations = async (
  Type: string,
  number: number
): Promise<Conversation[]> => {
  try {
    let page = 1;
    let allConversations: Conversation[] = [];

    while (true) {
      const conversationResponse = await axios.get(
        `https://api.github.com/repos/ethereum/${Type}/pulls/${number}/comments`,
        {
          params: {
            page,
            per_page: 100,
          },
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

    while (true) {
      const conversationResponse = await axios.get(
        `https://api.github.com/repos/ethereum/${Type}/issues/${number}/comments`,
        {
          params: {
            page,
            per_page: 100,
          },
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
    console.log('Error fetching conversations:', error);
    throw error;
  }
};

// Get participants from conversations and commits
const getParticipants = (
  conversations: Conversation[],
  commits: Commit[]
): string[] => {
  const commentParticipants = conversations
    .filter((conversation) => conversation.user.login !== 'github-actions[bot]')
    .map((conversation) => conversation.user.login);

  const commitParticipants = commits.map((commit) => commit.committer.login);

  const uniqueParticipants = new Set([
    ...commentParticipants,
    ...commitParticipants,
  ]);

  return Array.from(uniqueParticipants);
};

const getParticipants2 = (conversations: Conversation[]): string[] => {
  if (conversations.length === 0) return [];

  const commentParticipants = conversations
    .filter(
      (conversation) =>
        conversation.user &&
        conversation.user.login &&
        conversation.user.login !== 'github-actions[bot]'
    )
    .map((conversation) => conversation.user.login);

  const uniqueParticipants = new Set(commentParticipants);

  return Array.from(uniqueParticipants);
};

// Fetch commits
const fetchCommits = async (
  Type: string,
  number: number
): Promise<Commit[]> => {
  try {
    const commitsResponse = await axios.get(
      `https://api.github.com/repos/ethereum/${Type}/pulls/${number}/commits`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return commitsResponse.data;
  } catch (error) {
    console.log('Error fetching commits:', error);
    throw error;
  }
};

// Fetch files changed
const fetchFilesChanged = async (
  Type: string,
  number: number
): Promise<string[]> => {
  try {
    const filesResponse = await axios.get(
      `https://api.github.com/repos/ethereum/${Type}/pulls/${number}/files`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return filesResponse.data.map(
      (file: { filename: string }) => file.filename
    );
  } catch (error) {
    console.log('Error fetching files changed:', error);
    throw error;
  }
};

export default handler;
