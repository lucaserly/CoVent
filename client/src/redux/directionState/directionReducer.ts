import { UserActionTypes, SET_USER_DIRECTION, CLEAR_USER_DIRECTION } from '../../types/user/userActions';

export function directionReducer(state = [], action: UserActionTypes): string[] {
  switch (action.type) {
    case SET_USER_DIRECTION:
      return [
        ...state, ...action.payload,
      ]
    case CLEAR_USER_DIRECTION:
      return []
    default: return state;
  }
}