import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure MONGODB_URI is defined
const mongoUri: string = process.env.MONGODB_URI as string;

if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Specify the database name
const dbName = 'test';

mongoose
  .connect(mongoUri, { dbName }) // Specify the database name during connection
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to the database:', error.message);
  });

// Define the schema for the collections
const linkSchema = new mongoose.Schema({
  url: { type: String, unique: true },
});

// Models for collections within the same database
const EipBoard =
  mongoose.models.EipBoard ||
  mongoose.model('EipBoard', linkSchema, 'eip_board');
const ErcBoard =
  mongoose.models.ErcBoard ||
  mongoose.model('ErcBoard', linkSchema, 'erc_board');

// Controller function to handle requests
const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Retrieve data from the respective collections
    const [eips, ercs] = await Promise.all([
      EipBoard.find(), // Retrieve EIP data from eip_board
      ErcBoard.find(), // Retrieve ERC data from erc_board
    ]);

    // Send the response with the data for eips and ercs
    res.json({
      eips,
      ercs,
    });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
