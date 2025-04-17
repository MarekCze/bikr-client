export interface EngagementRibbonProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  // Event-specific props
  isEvent?: boolean;
  isAttending?: boolean;
  // Callbacks
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onBookmarkPress?: () => void;
  onRidingTherePress?: () => void;
}

export interface ActionButtonProps {
  count?: number;
  isActive?: boolean;
  onPress?: () => void;
  testID?: string;
}

export interface LikeButtonProps extends ActionButtonProps {}

export interface CommentButtonProps extends ActionButtonProps {}

export interface ShareButtonProps {
  onPress?: () => void;
  testID?: string;
}

export interface BookmarkButtonProps {
  isActive?: boolean;
  onPress?: () => void;
  testID?: string;
}

export interface EventActionsProps {
  isAttending?: boolean;
  onRidingTherePress?: () => void;
  testID?: string;
}
