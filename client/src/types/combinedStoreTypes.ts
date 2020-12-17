import { SystemState } from "./systemTypes";
import { User } from './user';

export interface RootState {
  system: SystemState,
  user: User,
  direction: string[],
}