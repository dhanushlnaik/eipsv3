import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
  if (typeof process.env.MONGODB_URI === 'string') {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.error('Error connecting to MongoDB:', err));
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

// Function to fetch reviewers from a YAML file
const fetchReviewers = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml'
    );
    const text = await response.text();

    // Match unique reviewers using a regex to handle YAML structure
    const matches = text.match(/-\s(\w+)/g);
    return matches ? Array.from(new Set(matches.map((m) => m.slice(2)))) : [];
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return [];
  }
};

// Define the schema for EIP review details
const ripReviewSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
  },
  prInfo: {
    prNumber: {
      type: Number,
      required: true,
    },
    prTitle: {
      type: String,
      required: true,
    },
    prDescription: String,
    labels: [String],
    numCommits: Number,
    filesChanged: [String],
    numFilesChanged: Number,
    mergeDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: Date,
    mergedAt: Date,
  },
  reviews: [
    {
      review: {
        type: String,
        required: true,
      },
      reviewDate: {
        type: Date,
        required: true,
      },
      reviewComment: String,
    },
  ],
});

// Create or use existing RIPReviewDetails model
const RIPReviewDetails =
  mongoose.models.RIPReviewDetails ||
  mongoose.model('RIPReviewDetails', ripReviewSchema);

// Controller logic to fetch and group PR review details by reviewer
const fetchAndGroupReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch GitHub handles to filter by
    const githubHandles = await fetchReviewers();

    // Create an object to store results grouped by reviewer
    const resultByReviewer: {
      [key: string]: {
        repo: string;
        prNumber: number;
        prTitle: string;
        createdAt: Date;
        closedAt: Date | null;
        mergedAt: Date | null;
        reviewDate: Date;
        reviewComment: string | null;
      }[];
    } = {};
    githubHandles.forEach((handle) => {
      resultByReviewer[handle] = [];
    });

    // MongoDB query to fetch review details
    const eipReviews = await RIPReviewDetails.aggregate([
      { $match: { reviewerName: { $in: githubHandles } } }, // Filter by reviewerName
      { $unwind: '$reviews' }, // Unwind the reviews array
      {
        $project: {
          prNumber: '$prInfo.prNumber',
          prTitle: '$prInfo.prTitle',
          createdAt: '$prInfo.createdAt',
          closedAt: '$prInfo.closedAt',
          mergedAt: '$prInfo.mergedAt',
          reviewDate: '$reviews.reviewDate',
          reviewComment: '$reviews.reviewComment',
          reviewerName: '$reviewerName',
        },
      },
    ]);

    // Group PR details by reviewer
    eipReviews.forEach(
      (review: {
        reviewerName: string;
        prNumber: number;
        prTitle: string;
        createdAt: Date;
        closedAt: Date | null;
        mergedAt: Date | null;
        reviewDate: Date;
        reviewComment: string | null;
      }) => {
        const {
          reviewerName,
          prNumber,
          prTitle,
          createdAt,
          closedAt,
          mergedAt,
          reviewDate,
          reviewComment,
        } = review;

        resultByReviewer[reviewerName].push({
          repo: 'RIPs',
          prNumber,
          prTitle,
          createdAt,
          closedAt,
          mergedAt,
          reviewDate,
          reviewComment,
        });
      }
    );

    // Send the grouped details as a JSON response
    res.status(200).json(resultByReviewer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default fetchAndGroupReviews;
