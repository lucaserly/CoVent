import { User, UserActionTypes, SET_USER_AGE, SET_USER_NAME, SET_USER, SET_USER_DIRECTION, } from '../../types/userTypes';

export function userReducer(state = {}, action: UserActionTypes):User {
    switch (action.type) {
    case SET_USER:
      return {
       ...state, ...action.payload
      }

     default: return state
    }
}

