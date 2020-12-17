import { User } from '.';
export const SET_USER_FIREBASE_ID = 'SET_USER_FIREBASE_ID'
export const SET_USER_NAME = 'SET_USER_NAME'
export const SET_USER_AGE = 'SET_USER_AGE'
export const SET_USER_PROFILE_PIC = 'SET_USER_PROFILE_PIC'
export const SET_USER_HAS_MATCHES_TO_FALSE = 'SET_USER_HAS_MATCHES_TO_FALSE'
export const SET_USER = "SET_USER"
export const SET_USER_DIRECTION = "SET_USER_DIRECTION"
export const CLEAR_USER_DIRECTION = "CLEAR_USER_DIRECTION"

interface SetUserNameAction {
  type: typeof SET_USER_NAME,
  payload: string
}

interface SetUserAgeAction {
  type: typeof SET_USER_AGE,
  payload: number
}

interface SetUserAction {
  type: typeof SET_USER,
  payload: User
}

interface SetUserDirection {
  type: typeof SET_USER_DIRECTION,
  payload: string[]
}

interface ClearUserDirection {
  type: typeof CLEAR_USER_DIRECTION,
  payload: []
}

export type UserActionTypes = SetUserAgeAction | SetUserNameAction | SetUserAction | SetUserDirection | ClearUserDirection;