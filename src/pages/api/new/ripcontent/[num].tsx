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

const ripcontentsSchema = new mongoose.Schema({
  eip: {
    type: Number,
  },
  content: { type: String },
});

const rip_contents =
  mongoose.models.rip_contents ||
  mongoose.model('rip_contents', ripcontentsSchema);

const render = async (req: Request, res: Response) => {
  const parts = req.url.split('/');
  const eipNumber = parseInt(parts[4]);

  try {
    const eip = await rip_contents.findOne({ eipNumber });

    if (!eip) {
      return res.status(404).json({ message: 'RIP not found' });
    }

    res.json({ ...eip, repo: 'rip' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default render;
