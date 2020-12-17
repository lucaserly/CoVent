import { UserActionTypes, SET_USER, } from '../../types/user/userActions';
import { User, Profile, Swipe } from '../../types/user';


const initialSwipesState: Swipe = {
  id: undefined,
  swipeId: '',
  createdAt: '',
  updatedAt: '',
  profileId: undefined
}

const initialReceivedLikeState: Profile = {
  id: undefined,
  age: '',
  description: '',
  gender: '',
  location: '',
  picture: '',
  receivedLike: [],
  swipes: [initialSwipesState]
}

export const initialProfileState: Profile = {
  id: undefined,
  picture: '',
  description: '',
  age: '',
  gender: '',
  location: '',
  hasNewMatch: false,
  receivedLike: [initialReceivedLikeState],
  swipes: [initialSwipesState],
}

const initialUserState: User = {
  firstName: '',
  lastName: '',
  email: '',
  profile: initialProfileState
}

export function userReducer(state = initialUserState, action: UserActionTypes): User {
  switch (action.type) {
    case SET_USER:
      return {
        ...state, ...action.payload
      }
    default: return state
  }
}

