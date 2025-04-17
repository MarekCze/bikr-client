export interface OwnerRibbonProps {
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isVerified?: boolean;
  postDate: string;
  isEdited?: boolean;
  isCurrentlyRiding?: boolean;
  isFollowed?: boolean;
  // Callbacks
  onProfilePress?: () => void;
  onFollowPress?: () => void;
  onMorePress?: () => void;
}

export interface UserInfoProps {
  userId: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isVerified?: boolean;
  onPress?: () => void;
  testID?: string;
}

export interface PostMetadataProps {
  postDate: string;
  isEdited?: boolean;
  testID?: string;
}

export interface UserActionsProps {
  userId: string;
  isFollowed: boolean;
  onFollowPress?: () => void;
  onMorePress?: () => void;
  testID?: string;
}

export interface RiderStatusProps {
  isRiding: boolean;
  testID?: string;
}
