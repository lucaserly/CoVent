import { SET_USER, SET_USER_NAME, SET_USER_AGE, UserActionTypes } from '../../types/user/userActions';
import { User } from '../../types/user'

export function setUser(user: User): UserActionTypes {
  return {
    type: SET_USER,
    payload: user
  }
}

export function setUserName(newName: string): UserActionTypes {
  return {
    type: SET_USER_NAME,
    payload: newName
  }
}

export function setUserProfilePic(newAge: number): UserActionTypes {
  return {
    type: SET_USER_AGE,
    payload: newAge
  }
}





