import { Request, Response } from "express";
import mongoose from "mongoose";


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

const eipcontentsSchema = new mongoose.Schema({
  eip: {
    type: Number,
  },
  content: { type: String },
});

const erc_contents =
  mongoose.models.erc_contents ||
  mongoose.model("erc_contents", eipcontentsSchema);

const handler = async (req: Request, res: Response) => {
  const parts = req.url.split("/");
  const eipNumber = parseInt(parts[4]);

  try {
    const erc = await erc_contents.findOne({ eipNumber });

    if (!erc) {
      return res.status(404).json({ message: "EIP not found" });
    }

    res.json({ ...erc, repo: "erc" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
export default handler;
