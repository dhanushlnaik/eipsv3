import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

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

// Define the Next.js API route handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const eipResults = (await EipStatusChange.find({})).map(
        (result: mongoose.Document) => ({
          ...result.toObject(),
          repo: 'eip',
        })
      );

      const ercResults = (await ErcStatusChange.find({})).map(
        (result: mongoose.Document) => ({
          ...result.toObject(),
          repo: 'erc',
        })
      );

      const ripResults = (await RipStatusChange.find({})).map(
        (result: mongoose.Document) => ({
          ...result.toObject(),
          repo: 'rip',
        })
      );

      // Structure the response in the desired format
      res.status(200).json({
        eip: eipResults,
        erc: ercResults,
        rip: ripResults,
      });
    } catch (error) {
      console.error('Error fetching status changes:', error);
      res.status(500).json({ error: 'Error fetching status changes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
