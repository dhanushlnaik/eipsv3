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

// Define the StatusChange schema
const statusChangeSchema = new mongoose.Schema({
  eip: {
    type: String,
    required: true,
  },
  fromStatus: {
    type: String,
    required: true,
  },
  toStatus: {
    type: String,
    required: true,
  },
  changeDate: {
    type: Date,
    required: true,
  },
  changedDay: {
    type: Number,
    required: true,
  },
  changedMonth: {
    type: Number,
    required: true,
  },
  changedYear: {
    type: Number,
    required: true,
  },
});
const StatusChange =
  mongoose.models.StatusChange ||
  mongoose.model('StatusChange', statusChangeSchema);

const handler = async (req: Request, res: Response) => {
  StatusChange.aggregate([
    {
      $group: {
        _id: {
          status: '$status',
          category: '$category',
          changedYear: { $year: '$changeDate' },
          changedMonth: { $month: '$changeDate' },
        },
        count: { $sum: 1 },
        eips: { $push: '$$ROOT' },
      },
    },
    {
      $group: {
        _id: '$_id.status',
        eips: {
          $push: {
            category: '$_id.category',
            changedYear: '$_id.changedYear',
            changedMonth: '$_id.changedMonth',
            count: '$count',
            eips: '$eips',
          },
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ])
    .then(
      (
        result: {
          _id: string;
          eips: {
            category: string;
            changedYear: number;
            changedMonth: number;
            count: number;
            eips: (typeof StatusChange)[];
          }[];
        }[]
      ) => {
        const formattedResult = result.map(
          (group: {
            _id: string;
            eips: {
              category: string;
              changedYear: number;
              changedMonth: number;
              count: number;
              eips: (typeof StatusChange)[];
            }[];
          }) => ({
            status: group._id,
            eips: group.eips
              .reduce(
                (
                  acc: {
                    category: string;
                    month: number;
                    year: number;
                    date: string;
                    count: number;
                  }[],
                  eipGroup: {
                    category: string;
                    changedYear: number;
                    changedMonth: number;
                    count: number;
                    eips: (typeof StatusChange)[];
                  }
                ) => {
                  const { category, changedYear, changedMonth, count } =
                    eipGroup;
                  acc.push({
                    category,
                    month: changedMonth,
                    year: changedYear,
                    date: `${changedYear}-${changedMonth}`,
                    count,
                  });
                  return acc;
                },
                []
              )
              .sort((a: { date: string }, b: { date: string }) =>
                a.date > b.date ? 1 : -1
              ),
          })
        );
        res.json(formattedResult);
      }
    )
    .catch((error: mongoose.Error) => {
      console.error('Error retrieving EIPs:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
};

export default handler;
