import { Profile } from './profile';

export interface User {
  id?: number,
  firstName: string,
  lastName: string,
  email: string,
  profile: Profile,
  password?: string
}