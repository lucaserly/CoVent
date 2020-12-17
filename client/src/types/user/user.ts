import { Profile } from './profile';

export interface User {
  id?: number | undefined,
  firstName: string,
  lastName: string,
  email: string,
  profile: Profile,
  password?: string
}