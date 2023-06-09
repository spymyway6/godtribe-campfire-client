export type MemberParams = {
  profileUrl?: string;
  name?: string;
  email?: string;
  status?: 'pending' | 'invited';
  role?: 'speaker' | 'moderator' | 'audience';
  isRaising?: boolean;
  isMuted?: boolean;
  uid: string;
  campfire?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
  socketId?: string;
  peerId?: string;
  member?: any;
  title?: string;
  isPrivate?: boolean;
  isAdmin?: boolean;
};
