import { DetailedPost, MediaItem, PollOption, PostContextType } from '../../../../shared/src/types/post';

export interface MediaCardProps {
  post: DetailedPost;
  onPress?: () => void;
  onLongPress?: () => void;
  testID?: string;
  // Add rendering options
  showEngagementRibbon?: boolean;
  showOwnerRibbon?: boolean;
  // Event handlers for child components
  onImagePress?: (index: number) => void;
  onVote?: (optionId: string) => void;
}

export interface TextPostCardProps {
  content: string;
  onPress?: () => void;
}

export interface ImageGalleryCardProps {
  media: MediaItem[];
  onImagePress?: (index: number) => void;
}

export interface VideoPlayerCardProps {
  media: MediaItem;
  autoPlay?: boolean;
  muted?: boolean;
  onVideoPress?: () => void;
}

export interface PollCardProps {
  question: string;
  options: PollOption[];
  userVotedOptionId: string | null;
  onVote?: (optionId: string) => void;
}

export interface ContextBadgeProps {
  type: PostContextType;
  contextId?: string;
  name?: string;
  onPress?: () => void;
}
