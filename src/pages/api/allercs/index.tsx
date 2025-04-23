import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Ensure the MongoDB URI is defined
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

// Connect to the database
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: Error) => {
    console.error('Error connecting to the database:', error.message);
  });

// Define the schema for EIPs
const mdFilesSchema = new mongoose.Schema({
  eip: { type: String, unique: true },
  title: { type: String },
  author: { type: String },
  status: { type: String },
  type: { type: String },
  category: { type: String },
  created: { type: String },
});

// Create or retrieve the Mongoose model
const MdFiles =
  mongoose.models.ErcMdFiles || mongoose.model('ErcMdFiles', mdFilesSchema);

// Define the handler function
const handler = async (req: Request, res: Response): Promise<void> => {
  try {
    // Aggregate and sort documents by _id in ascending order
    const result = await MdFiles.aggregate([
      {
        $sort: {
          _id: 1, // Sort by _id in ascending order
        },
      },
    ]);

    // Send the sorted result as a JSON response
    res.json(result);
  } catch (error) {
    console.error('Error retrieving EIPs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the handler as the default export
export default handler;
