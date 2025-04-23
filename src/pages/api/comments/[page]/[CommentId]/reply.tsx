import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI as string; // Ensure this is set in your .env.local file

// Define the structure of a comment document, including subComments
interface Comment {
  _id: ObjectId;
  content: string;
  author: string;
  profileLink: string;
  profileImage: string;
  page: string;
  createdAt: Date;
  subComments: SubComment[]; // subComments is an array of SubComment objects
}

interface SubComment {
  _id: ObjectId;
  content: string;
  createdAt: Date;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { CommentId, page } = req.query; // Extract the CommentId and page parameters
  const { content } = req.body;

  if (req.method === 'POST') {
    // Validate required parameters
    if (!page || typeof page !== 'string') {
      return res
        .status(400)
        .json({ message: 'Page parameter is required and must be a string' });
    }

    if (!CommentId || !ObjectId.isValid(CommentId as string)) {
      return res.status(400).json({ message: 'Invalid or missing Comment ID' });
    }

    if (!content || typeof content !== 'string') {
      return res
        .status(400)
        .json({ message: 'Content is required and must be a string' });
    }

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection<Comment>('comments'); // Specify the Comment type

      console.log('Triggered the reply API');

      // Create a new sub-comment
      const newSubComment: SubComment = {
        _id: new ObjectId(),
        content,
        createdAt: new Date(),
      };

      // Use $push to add a new sub-comment to the array
      const result = await comments.updateOne(
        { _id: new ObjectId(CommentId as string), page }, // Filter by comment ID and page
        {
          $push: {
            subComments: newSubComment, // Push the sub-comment directly
          },
        }
      );

      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: 'Reply added successfully' });
      } else {
        return res
          .status(404)
          .json({ message: 'Comment not found or category mismatch' });
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      return res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
