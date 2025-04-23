import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Create a model based on the schema

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI is not defined');
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error: mongoose.Error) => {
    console.error('Error connecting to the database:', error.message);
  });

const likeSchema = new mongoose.Schema({
  pageName: String,
  likeCount: Number,
  dislikeCount: Number,
});

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

const dislikeHandler = async (req: Request, res: Response) => {
  try {
    const pageName = 'dislike';

    // Find the like count document for the given page name, create it if it doesn't exist
    let likeDoc = await Like.findOne({ pageName });

    if (!likeDoc) {
      likeDoc = new Like({ pageName, likeCount: 0, dislikeCount: 0 });
    }

    // Increment the like count
    likeDoc.likeCount++;
    await likeDoc.save();

    res.json({
      pageName,
      likeCount: likeDoc.likeCount,
      dislikeCount: likeDoc.dislikeCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default dislikeHandler;
