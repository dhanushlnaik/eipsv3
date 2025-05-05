'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  subComments?: Comment[];
}

interface CommentsProps {
  page: string;
}

const Comments: React.FC<CommentsProps> = ({ page }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${page}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };
    fetchComments();
  }, [page]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/api/comments/${page}`, {
        content: newComment,
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleAddReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await axios.post(`/api/comments/${page}/${commentId}/reply`, {
        content: replyText,
      });
      const newReply: Comment = {
        _id: res.data._id,
        content: replyText,
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                subComments: [...(comment.subComments || []), newReply],
              }
            : comment
        )
      );

      setReplyCommentId(null);
      setReplyText('');
    } catch (err) {
      console.error('Failed to add reply', err);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6 px-4">
        <div className="h-px flex-1 bg-white/20 backdrop-blur-sm"></div>
        <h2 className="text-white text-lg font-semibold tracking-wide backdrop-blur-md bg-white/10 px-4 py-1 rounded-md shadow-sm">
          Comments
        </h2>
        <div className="h-px flex-1 bg-white/20 backdrop-blur-sm"></div>
      </div>
      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-md border border-white/20 bg-white/10 p-4 backdrop-blur-md text-white shadow-lg"
          >
            <p className="mb-2">{comment.content}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-purple-300 hover:text-purple-100"
              onClick={() => setReplyCommentId(comment._id)}
            >
              Reply
            </Button>

            {comment.subComments && (
              <div className="ml-4 mt-3 space-y-2 border-l border-white/10 pl-4">
                {comment.subComments.map((reply) => (
                  <div
                    key={reply._id}
                    className="rounded-md border border-white/10 bg-white/5 p-3 text-white/90"
                  >
                    {reply.content}
                  </div>
                ))}
              </div>
            )}

            {replyCommentId === comment._id && (
              <div className="mt-3 flex items-center space-x-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="bg-white/10 text-white placeholder-white border border-white/20"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-purple-300 hover:text-purple-100"
                  onClick={() => handleAddReply(comment._id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 flex items-center space-x-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="bg-white/10 text-white placeholder-white border border-white/20"
          />
          <Button
            onClick={handleAddComment}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Comment
          </Button>
        </div>
      </div>
    </>
  );
};

export default Comments;
