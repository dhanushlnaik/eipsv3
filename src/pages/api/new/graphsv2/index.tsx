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
interface StatusChange {
  eip: string;
  fromStatus: string;
  toStatus: string;
  changeDate: Date;
  changedDay: number;
  changedMonth: number;
  changedYear: number;
}

const statusChangeSchema = new mongoose.Schema<StatusChange>({
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
  mongoose.model<StatusChange>(
    'EipStatusChange2',
    statusChangeSchema,
    'eipstatuschange2'
  );

const ErcStatusChange =
  mongoose.models.ErcStatusChange2 ||
  mongoose.model<StatusChange>(
    'ErcStatusChange2',
    statusChangeSchema,
    'ercstatuschange2'
  );

const RipStatusChange =
  mongoose.models.RipStatusChange2 ||
  mongoose.model<StatusChange>(
    'RipStatusChange2',
    statusChangeSchema,
    'ripstatuschange2'
  );

interface AggregatedResult {
  status: string;
  eips: {
    category: string;
    month: number;
    year: number;
    date: string;
    count: number;
    eips: StatusChange[];
    repo: string;
  }[];
}

const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    const eipResult = await EipStatusChange.aggregate([
      { $match: { category: { $ne: 'ERC' } } },
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
    ]);

    interface EipGroup {
      _id: string;
      eips: {
        category: string;
        changedYear: number;
        changedMonth: number;
        count: number;
        eips: StatusChange[];
      }[];
    }

    const formattedResult: AggregatedResult[] = eipResult.map(
      (group: EipGroup) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc: AggregatedResult['eips'], eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: 'eip',
            });
            return acc;
          }, [])
          .sort((a, b) => (a.date > b.date ? 1 : -1)),
      })
    );

    const frozenErcResult = await EipStatusChange.aggregate([
      { $match: { category: 'ERC' } },
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
    ]);

    interface ErcGroup {
      _id: string;
      eips: {
        category: string;
        changedYear: number;
        changedMonth: number;
        count: number;
        eips: StatusChange[];
      }[];
    }

    const formattedFrozenErcResult: AggregatedResult[] = frozenErcResult.map(
      (group: ErcGroup) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc: AggregatedResult['eips'], eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: 'erc',
            });
            return acc;
          }, [])
          .sort((a, b) => (a.date > b.date ? 1 : -1)),
      })
    );

    const ercResult = await ErcStatusChange.aggregate([
      { $match: { changeDate: { $gte: new Date('2023-11-01') } } },
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
    ]);

    interface ErcGroup {
      _id: string;
      eips: {
        category: string;
        changedYear: number;
        changedMonth: number;
        count: number;
        eips: StatusChange[];
      }[];
    }

    const ERCformattedResult: AggregatedResult[] = ercResult.map(
      (group: ErcGroup) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc: AggregatedResult['eips'], eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: 'erc',
            });
            return acc;
          }, [])
          .sort((a, b) => (a.date > b.date ? 1 : -1)),
      })
    );

    const ripResult = await RipStatusChange.aggregate([
      { $match: { changeDate: { $gte: new Date('2023-11-01') } } },
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
    ]);

    interface RipGroup {
      _id: string;
      eips: {
        category: string;
        changedYear: number;
        changedMonth: number;
        count: number;
        eips: StatusChange[];
      }[];
    }

    const RIPformattedResult: AggregatedResult[] = ripResult.map(
      (group: RipGroup) => ({
        status: group._id,
        eips: group.eips
          .reduce((acc: AggregatedResult['eips'], eipGroup) => {
            const { category, changedYear, changedMonth, count, eips } =
              eipGroup;
            acc.push({
              category,
              month: changedMonth,
              year: changedYear,
              date: `${changedYear}-${changedMonth}`,
              count,
              eips,
              repo: 'rip',
            });
            return acc;
          }, [])
          .sort((a, b) => (a.date > b.date ? 1 : -1)),
      })
    );

    res.json({
      eip: formattedResult,
      erc: [...ERCformattedResult, ...formattedFrozenErcResult],
      rip: RIPformattedResult,
    });
  } catch (error) {
    console.error('Error retrieving EIPs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
