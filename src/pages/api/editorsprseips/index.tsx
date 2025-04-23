import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the database connection is established only once
if (mongoose.connection.readyState === 0) {
  if (typeof process.env.MONGODB_URI === 'string') {
    mongoose.connect(process.env.MONGODB_URI).catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
  } else {
    console.error('MONGODB_URI environment variable is not defined');
  }
}

// EIP Review Schema
const eipReviewSchema = new mongoose.Schema({
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
    prDescription: {
      type: String,
    },
    labels: {
      type: [String],
    },
    numCommits: {
      type: Number,
    },
    filesChanged: {
      type: [String],
    },
    numFilesChanged: {
      type: Number,
    },
    mergeDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
    },
    mergedAt: {
      type: Date,
    },
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
      reviewComment: {
        type: String,
      },
    },
  ],
});

// Create EIPReviewDetails model
const EIPReviewDetails =
  mongoose.models.EIPReviewDetails ||
  mongoose.model('EIPReviewDetails', eipReviewSchema);

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

    // Create an object to store the results for each reviewer
    interface Review {
      repo: string;
      prNumber: number;
      prTitle: string;
      created_at: Date;
      closed_at?: Date;
      merged_at?: Date;
      reviewDate: Date;
      reviewComment?: string;
    }

    const resultByReviewer: Record<string, Review[]> = {};

    // Initialize the result object with empty arrays for each reviewer
    githubHandles.forEach((handle) => {
      resultByReviewer[handle] = [];
    });

    // Efficient MongoDB query to fetch review details
    interface EIPReview {
      reviewerName: string;
      prNumber: number;
      prTitle: string;
      created_at: Date;
      closed_at?: Date;
      merged_at?: Date;
      reviewDate: Date;
      reviewComment?: string;
    }

    const eipReviews: EIPReview[] = await EIPReviewDetails.aggregate([
      { $match: { reviewerName: { $in: githubHandles } } }, // Filter by reviewerName
      { $unwind: '$reviews' }, // Unwind the reviews array
      {
        $project: {
          prNumber: '$prInfo.prNumber',
          prTitle: '$prInfo.prTitle',
          closed_at: '$prInfo.closedAt',
          merged_at: '$prInfo.mergedAt',
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
        created_at: Date;
        closed_at?: Date;
        merged_at?: Date;
        reviewDate: Date;
        reviewComment?: string;
      }) => {
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
        resultByReviewer[reviewerName].push({
          repo: 'EIPs',
          prNumber,
          prTitle,
          created_at,
          closed_at,
          merged_at,
          reviewDate,
          reviewComment,
        });
      }
    );

    // Return the PR details grouped by each reviewer as a JSON response
    res.json(resultByReviewer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handler;
