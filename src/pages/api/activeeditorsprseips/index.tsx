import { Request, Response } from 'express';
import mongoose from 'mongoose';

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

// Function to fetch reviewers from GitHub configuration
const fetchReviewers = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml'
    );
    const text = await response.text();

    // Match unique reviewers using a regex to handle YAML structure
    const matches = text.match(/-\s(\w+)/g);
    const reviewers = matches
      ? Array.from(new Set(matches.map((m) => m.slice(2))))
      : [];
    return reviewers;
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return [];
  }
};

// EIP Review Schema
const eipReviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  prInfo: {
    prNumber: { type: Number, required: true },
    prTitle: { type: String, required: true },
    prDescription: { type: String },
    labels: { type: [String] },
    numCommits: { type: Number },
    filesChanged: { type: [String] },
    numFilesChanged: { type: Number },
    mergeDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    mergedAt: { type: Date },
  },
  reviews: [
    {
      review: { type: String, required: true },
      reviewDate: { type: Date, required: true },
      reviewComment: { type: String },
    },
  ],
});

// Create or reuse the Mongoose model
const EIPReviewDetails =
  mongoose.models.EIPReviewDetails ||
  mongoose.model('EIPReviewDetails', eipReviewSchema);

// Controller to fetch and group PR review details by reviewer
const fetchAndGroupPRDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch GitHub reviewer handles
    const githubHandles = await fetchReviewers();

    if (!githubHandles || githubHandles.length === 0) {
      res
        .status(404)
        .json({ error: 'No reviewers found from GitHub configuration' });
      return;
    }

    interface ReviewDetails {
      repo: string;
      prNumber: number;
      prTitle: string;
      created_at: Date;
      closed_at: Date | null;
      merged_at: Date | null;
      reviewDate: Date;
      reviewComment: string;
    }

    const resultByReviewer: { [key: string]: ReviewDetails[] } = {};

    // Initialize the result object with empty arrays for each reviewer
    githubHandles.forEach((handle) => {
      resultByReviewer[handle] = [];
    });

    // Fetch and aggregate review details from MongoDB
    const eipReviews = await EIPReviewDetails.aggregate([
      { $match: { reviewerName: { $in: githubHandles } } }, // Filter by reviewerName
      { $unwind: '$reviews' }, // Unwind the reviews array
      {
        $project: {
          repo: 'EIPs',
          prNumber: '$prInfo.prNumber',
          prTitle: '$prInfo.prTitle',
          created_at: '$prInfo.createdAt',
          closed_at: '$prInfo.closedAt',
          merged_at: '$prInfo.mergedAt',
          reviewDate: '$reviews.reviewDate',
          reviewComment: '$reviews.reviewComment',
          reviewerName: '$reviewerName',
        },
      },
    ]);

    // Group PR details by reviewer
    eipReviews.forEach((review) => {
      const {
        reviewerName,
        repo,
        prNumber,
        prTitle,
        created_at,
        closed_at,
        merged_at,
        reviewDate,
        reviewComment,
      } = review;

      if (resultByReviewer[reviewerName]) {
        resultByReviewer[reviewerName].push({
          repo,
          prNumber,
          prTitle,
          created_at,
          closed_at,
          merged_at,
          reviewDate,
          reviewComment,
        });
      }
    });

    // Return the grouped PR details by reviewer
    res.json(resultByReviewer);
  } catch (error) {
    console.error('Error fetching PR review details:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default fetchAndGroupPRDetails;
