import React from 'react';
import { Comments } from '../Comment';

interface CommentButtonProps {
  postId: string;
  commentCount: number;
}

/**
 * CommentButton component that shows comment count and provides
 * functionality to view and add comments to a post.
 */
export function CommentButton({ postId, commentCount }: CommentButtonProps) {
  return (
    <Comments
      postId={postId}
      commentCount={commentCount}
    />
  );
}
