import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
  if (typeof process.env.MONGODB_URI === 'string') {
    mongoose.connect(process.env.MONGODB_URI);
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

// Fetch reviewers from GitHub configuration
const fetchReviewers = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml'
    );
    const text = await response.text();
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

// Common schema for EIP, ERC, and RIP review collections
const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  prInfo: {
    prNumber: { type: Number, required: true },
    prTitle: { type: String, required: true },
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

// Models for EIP, ERC, and RIP reviews
const EIPReviewDetails =
  mongoose.models.EIPReviewDetails ||
  mongoose.model('EIPReviewDetails', reviewSchema);
const ERCReviewDetails =
  mongoose.models.ERCReviewDetails ||
  mongoose.model('ERCReviewDetails', reviewSchema);
const RIPReviewDetails =
  mongoose.models.RIPReviewDetails ||
  mongoose.model('RIPReviewDetails', reviewSchema);

// Controller to fetch and combine PR review details by reviewer
const fetchAndCombinePRReviewDetails = async (req: Request, res: Response) => {
  try {
    // Fetch GitHub reviewer handles
    const githubHandles = await fetchReviewers();

    // Create an object to store combined results
    interface Review {
      reviewerName: string;
      repo: string;
      prNumber: number;
      prTitle: string;
      created_at: Date;
      closed_at?: Date;
      merged_at?: Date;
      reviewDate: Date;
      reviewComment?: string;
    }

    const resultByReviewer: { [key: string]: Review[] } = {};
    githubHandles.forEach((handle) => {
      resultByReviewer[handle] = [];
    });

    // Aggregate reviews for each collection
    const collections = [
      { model: EIPReviewDetails, repo: 'EIPs' },
      { model: ERCReviewDetails, repo: 'ERCs' },
      { model: RIPReviewDetails, repo: 'RIPs' },
    ];

    const promises = collections.map(({ model, repo }) =>
      model.aggregate([
        { $match: { reviewerName: { $in: githubHandles } } },
        { $unwind: '$reviews' },
        {
          $project: {
            repo,
            reviewerName: '$reviewerName',
            prNumber: '$prInfo.prNumber',
            prTitle: '$prInfo.prTitle',
            created_at: '$prInfo.createdAt',
            closed_at: '$prInfo.closedAt',
            merged_at: '$prInfo.mergedAt',
            reviewDate: '$reviews.reviewDate',
            reviewComment: '$reviews.reviewComment',
          },
        },
      ])
    );

    const [eipReviews, ercReviews, ripReviews] = await Promise.all(promises);

    // Combine all reviews
    const allReviews = [...eipReviews, ...ercReviews, ...ripReviews];

    // Group reviews by reviewer
    allReviews.forEach((review: Review) => {
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
      resultByReviewer[reviewerName].push({
        reviewerName,
        repo,
        prNumber,
        prTitle,
        created_at,
        closed_at,
        merged_at,
        reviewDate,
        reviewComment,
      });
    });

    // Return the grouped results
    res.json(resultByReviewer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default fetchAndCombinePRReviewDetails;
