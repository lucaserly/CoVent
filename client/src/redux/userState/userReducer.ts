import { UserActionTypes, SET_USER, } from '../../types/user/userActions';
import { User, Profile, Swipe, Match, City } from '../../types/user';

export const initialMatchesState: Match = {
  createdAt: '',
  updatedAt: '',
  matched: undefined,
  partner: undefined,
}

export const initialCitiesState: City = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  cityProfiles: {
    createdAt: '',
    updatedAt: '',
    cityId: undefined,
    profileId: undefined,
  }
}

// export const initialMatchedState: Profile = {
//   id: undefined,
//   picture: '',
//   description: '',
//   age: '',
//   gender: '',
//   location: '',
//   userId: undefined,
//   hasNewMatch: false,
//   user: {
//     id: undefined,
//     firstName: '',
//     lastName: '',
//     email: '',

//   },
//   matches: initialMatchesState
// }

export const initialSwipesState: Swipe = {
  id: undefined,
  swipeId: '',
  createdAt: '',
  updatedAt: '',
  profileId: undefined
}

export const initialReceivedLikeState: Profile = {
  id: undefined,
  age: '',
  description: '',
  gender: '',
  location: '',
  picture: '',
  userId: undefined,
  hasNewMatch: false,
  receivedLike: [],
  swipes: [initialSwipesState],
  matches: initialMatchesState,
  cities: [initialCitiesState]
}

export const initialProfileState: Profile = {
  id: undefined,
  picture: '',
  description: '',
  age: '',
  gender: '',
  location: '',
  hasNewMatch: false,
  userId: undefined,
  receivedLike: [initialReceivedLikeState],
  swipes: [initialSwipesState],
  // matched: [initialMatchedState],
  matches: initialMatchesState,
  cities: [initialCitiesState]
}

export const initialUserState: User = {
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

