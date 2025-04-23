import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
  const mongoURI = process.env.MONGODB_URI;
  if (typeof mongoURI === 'string') {
    mongoose.connect(mongoURI).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

// ERC Review Schema
const ercReviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  prInfo: {
    prNumber: { type: Number, required: true },
    prTitle: { type: String, required: true },
    prDescription: String,
    labels: [String],
    numCommits: Number,
    filesChanged: [String],
    numFilesChanged: Number,
    mergeDate: Date,
    createdAt: { type: Date, default: Date.now },
    closedAt: Date,
    mergedAt: Date,
  },
  reviews: [
    {
      review: { type: String, required: true },
      reviewDate: { type: Date, required: true },
      reviewComment: String,
    },
  ],
});

// Create or reuse the ERCReviewDetails model
const ERCReviewDetails =
  mongoose.models.ERCReviewDetails ||
  mongoose.model('ERCReviewDetails', ercReviewSchema);

// Controller logic to fetch and group PR review details by reviewer
const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    // GitHub handles to filter by
    const githubHandles = [
      'CarlBeek',
      'nconsigny',
      'yoavw',
      'adietrichs',
      'axic',
      'gcolvin',
      'lightclient',
      'SamWilsn',
      'xinbenlv',
      'g11tech',
      'cdetrio',
      'Pandapip1',
      'Souptacular',
      'wanderer',
      'MicahZoltu',
      'arachnid',
      'nicksavers',
      'vbuterin',
    ];

    // Initialize the result object with empty arrays for each reviewer
    const resultByReviewer = githubHandles.reduce(
      (acc, handle) => {
        acc[handle] = [];
        return acc;
      },
      {} as Record<
        string,
        Array<{
          repo: string;
          prNumber: number;
          prTitle: string;
          created_at: Date;
          closed_at: Date | null;
          merged_at: Date | null;
          reviewDate: Date;
          reviewComment: string | null;
        }>
      >
    );

    // Efficient MongoDB query to fetch review details
    const ercReviews = await ERCReviewDetails.aggregate([
      { $match: { reviewerName: { $in: githubHandles } } }, // Filter by reviewerName
      { $unwind: '$reviews' }, // Unwind the reviews array
      {
        $project: {
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
    ercReviews.forEach((review) => {
      const {
        reviewerName,
        prNumber,
        prTitle,
        created_at,
        closed_at,
        merged_at,
        reviewDate,
        reviewComment,
      } = review;

      // Add review details to the respective reviewer
      if (resultByReviewer[reviewerName]) {
        resultByReviewer[reviewerName].push({
          repo: 'ERCs',
          prNumber,
          prTitle,
          created_at,
          closed_at,
          merged_at,
          reviewDate,
          reviewComment,
        });
      }

      // Export the handler function
    });

    // Return the PR details grouped by each reviewer as a JSON response
    res.status(200).json(resultByReviewer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handler;
