import { User, UserActionTypes, SET_USER, } from '../../types/userTypes';

export function userReducer(state = {}, action: UserActionTypes):User {
    switch (action.type) {
    case SET_USER:
      return {
       ...state, ...action.payload
      }

     default: return state
    }
}

