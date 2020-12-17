import { UserActionTypes } from '../types/user/userActions';
import { Dispatch } from 'react';
import { setUser } from '../redux/userState/userActions';
import { getUserById } from './userDatabaseFetch';

export function getUserByIdDispatch(firebaseId: string) {
  return (dispatch: Dispatch<UserActionTypes>): void => {
    getUserById(firebaseId).then(user => {
      dispatch(setUser(user[0]))
    })
  }
}

