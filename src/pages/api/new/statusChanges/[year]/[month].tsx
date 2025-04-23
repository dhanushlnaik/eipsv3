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
const EipStatusChange =
  mongoose.models.EipStatusChange2 ||
  mongoose.model('EipStatusChange2', statusChangeSchema, 'eipstatuschange2');

const ErcStatusChange =
  mongoose.models.ErcStatusChange2 ||
  mongoose.model('ErcStatusChange2', statusChangeSchema, 'ercstatuschange2');

const RipStatusChange =
  mongoose.models.RipStatusChange2 ||
  mongoose.model('RipStatusChange2', statusChangeSchema, 'ripstatuschange2');

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const year = parseInt(parts[4]);
  const month = parseInt(parts[5]);
  try {
    // Convert year and month to numbers
    const yearNum = year;
    const monthNum = month;

    // Get the start and end dates of the specified month and year
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    // Query the database for status changes within the specified date range
    const EipstatusChanges = await EipStatusChange.aggregate([
      {
        $match: {
          eip: { $nin: ['7212'] },
          changeDate: { $gte: startDate, $lte: endDate },
          category: {
            $ne: 'ERC',
          },
        },
      },
      {
        $group: {
          _id: '$toStatus',
          count: { $sum: 1 },
          statusChanges: { $push: '$$ROOT' },
        },
      },
    ]);

    const RipstatusChanges = await RipStatusChange.aggregate([
      {
        $match: {
          changeDate: { $gte: startDate, $lte: endDate },
          category: {
            $ne: 'ERC',
          },
        },
      },
      {
        $group: {
          _id: '$toStatus',
          count: { $sum: 1 },
          statusChanges: { $push: '$$ROOT' },
        },
      },
    ]);

    const eipFinal = EipstatusChanges.map(
      (item: {
        _id: string;
        count: number;
        statusChanges: {
          eip: string;
          fromStatus: string;
          toStatus: string;
          changeDate: Date;
          changedDay: number;
          changedMonth: number;
          changedYear: number;
        }[];
      }) => {
        return { ...item, repo: 'eip' };
      }
    );

    const ripFinal = RipstatusChanges.map(
      (item: {
        _id: string;
        count: number;
        statusChanges: {
          eip: string;
          fromStatus: string;
          toStatus: string;
          changeDate: Date;
          changedDay: number;
          changedMonth: number;
          changedYear: number;
        }[];
      }) => {
        return { ...item, repo: 'rip' };
      }
    );

    if (yearNum === 2023 && monthNum === 10) {
      const FrozenErcStatusChanges = await EipStatusChange.aggregate([
        {
          $match: {
            changeDate: { $gte: startDate, $lte: endDate },
            category: 'ERC',
          },
        },
        {
          $group: {
            _id: '$toStatus',
            count: { $sum: 1 },
            statusChanges: { $push: '$$ROOT' },
          },
        },
      ]);

      const ercFrozenFinal = FrozenErcStatusChanges.map(
        (item: {
          _id: string;
          count: number;
          statusChanges: {
            eip: string;
            fromStatus: string;
            toStatus: string;
            changeDate: Date;
            changedDay: number;
            changedMonth: number;
            changedYear: number;
          }[];
        }) => {
          return { ...item, repo: 'erc' };
        }
      );
      res.json({
        eip: eipFinal,
        erc: ercFrozenFinal,
        rip: ripFinal,
      });
    } else if (yearNum < 2023 || (yearNum === 2023 && monthNum <= 11)) {
      const FrozenErcStatusChanges = await EipStatusChange.aggregate([
        {
          $match: {
            changeDate: { $gte: startDate, $lte: endDate },
            category: 'ERC',
          },
        },
        {
          $group: {
            _id: '$toStatus',
            count: { $sum: 1 },
            statusChanges: { $push: '$$ROOT' },
          },
        },
      ]);

      const ercFrozenFinal = FrozenErcStatusChanges.map(
        (item: {
          _id: string;
          count: number;
          statusChanges: {
            eip: string;
            fromStatus: string;
            toStatus: string;
            changeDate: Date;
            changedDay: number;
            changedMonth: number;
            changedYear: number;
          }[];
        }) => {
          return { ...item, repo: 'erc' };
        }
      );

      const ErcstatusChanges = await ErcStatusChange.aggregate([
        { $match: { changeDate: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: '$toStatus',
            count: { $sum: 1 },
            statusChanges: { $push: '$$ROOT' },
          },
        },
      ]);

      const ercFinal = ErcstatusChanges.map(
        (item: {
          _id: string;
          count: number;
          statusChanges: {
            eip: string;
            fromStatus: string;
            toStatus: string;
            changeDate: Date;
            changedDay: number;
            changedMonth: number;
            changedYear: number;
          }[];
        }) => {
          return { ...item, repo: 'erc' };
        }
      );

      res.json({
        eip: eipFinal,
        erc: [...ercFinal, ...ercFrozenFinal],
        rip: ripFinal,
      });
    } else {
      const ErcstatusChanges = await ErcStatusChange.aggregate([
        { $match: { changeDate: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: '$toStatus',
            count: { $sum: 1 },
            statusChanges: { $push: '$$ROOT' },
          },
        },
      ]);

      const ercFinal = ErcstatusChanges.map(
        (item: {
          _id: string;
          count: number;
          statusChanges: {
            eip: string;
            fromStatus: string;
            toStatus: string;
            changeDate: Date;
            changedDay: number;
            changedMonth: number;
            changedYear: number;
          }[];
        }) => {
          return { ...item, repo: 'erc' };
        }
      );
      res.json({ eip: eipFinal, erc: ercFinal, rip: ripFinal });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
    console.log(error);
  }
};

export default render;
