import { User } from './user';
import { LikedProfile } from './likedProfile';
import { ReceivedLike } from './receivedLike';
import { Match } from './match';
import { Category } from './category';
import { City } from './city';
import { Swipe } from './swipe';

export interface Profile {
  id: number | undefined,
  picture?: string,
  description?: string,
  age: string,
  gender: string,
  location: string,
  userId?: number,
  hasNewMatch?: boolean,

  likedProfile?: Profile[],
  receivedLike: Profile[],
  matched?: Profile[],
  user?: User,
  likedProfiles?: LikedProfile,
  receivedLikes?: ReceivedLike,
  matches?: Match,
  categories?: Category[],
  cities?: City[],
  swipes: Swipe[],
}