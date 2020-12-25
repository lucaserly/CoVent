import { UserActionTypes, SET_USER, } from '../../types/user/userActions';
import { User, Profile, Swipe, Match, Category, City } from '../../types/user';

export const initialCityState: City = {
  id: '',
  name: '',
  createdAt: '',
  updatedAt: '',
  cityProfiles: {
    createdAt: '',
    updatedAt: '',
    cityId: undefined,
    profileId: undefined
  }
}

export const initialCategoryState: Category = {
  id: undefined,
  name: '',
  createdAt: '',
  updatedAt: '',
  categoryProfiles: {
    createdAt: '',
    updatedAt: '',
    categoryId: undefined,
    profileId: undefined,
  }
}

export const initialMatchesState: Match = {
  createdAt: '',
  updatedAt: '',
  matched: undefined,
  partner: undefined,
}

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
  likedProfile: [],
  swipes: [initialSwipesState],
  matches: initialMatchesState,
  categories: [initialCategoryState],
  cities: [initialCityState]
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
  likedProfile: [initialReceivedLikeState],
  swipes: [initialSwipesState],
  matches: initialMatchesState,
  categories: [initialCategoryState],
  cities: [initialCityState]
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

