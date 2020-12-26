import { setUserFirebaseId, setUserToLoggedIn, setUserToLoggedOut } from '../redux/systemState/systemStateActions';
import fire from './firebase';
import { addProfileToUserAtDataBase, getUserById, registerUserToDataBase, getUserByEmailAndPassword, updateUserProfileData, addCity, giveLike, addCategory, addSwipe } from './userDatabaseFetch';
import { User, CityAdd, UserFireBase, City, LikeProfile, Category, Credentials } from '../types/user';
import { setUser } from '../redux/userState/userActions';
import { clearDirection } from './../redux/directionState/directionActions';
import { Dispatch } from 'react';
import { SystemActionTypes } from '../types/systemTypes';
import { UserActionTypes } from '../types/user/userActions';
import { initialUserState } from './../redux/userState/userReducer';

export const userLogin = (creds: UserFireBase) => {
    return (dispatch: Dispatch<SystemActionTypes | UserActionTypes>): void => {
        fire
            .auth()
            .signInWithEmailAndPassword(creds.email, creds.password)
            .then((res) => {
                if (res.user) {
                    dispatch(setUserFirebaseId(res.user.uid));
                    dispatch(setUserToLoggedIn());
                    getUserByEmailAndPassword(creds.email, creds.password).then(updatedUser => {
                        if (updatedUser.id) {
                            getUserById(updatedUser.id.toString()).then(user => {
                                const newUser = user[0]
                                dispatch(setUser(newUser))

                            })
                        }
                    })
                }
            })
            .catch(err => {
                alert(err)
                console.log(err)
            });
    };
};

export const userLogOut = () => {
    return (dispatch: Dispatch<UserActionTypes | SystemActionTypes>): void => {
        fire.auth().signOut().then(function () {
            dispatch(setUserToLoggedOut())
            dispatch(setUser(initialUserState))
            dispatch(clearDirection([]))
        }).catch(function (error) {
            console.log(error)
        });
    }
};

export const userSignUp = (user: User) => {
    return (dispatch: Dispatch<UserActionTypes | SystemActionTypes>): void => {
        if (user.email && user.password) {
            fire
                .auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then((firebaseUser) => {
                    if (firebaseUser.user) {
                        dispatch(setUserFirebaseId(firebaseUser.user.uid));
                        dispatch(setUserToLoggedIn());
                    }
                    const userToRegister: Credentials = {
                        firstName: user.firstName, lastName: user.lastName,
                        email: user.email, password: user.password
                    }
                    registerUserToDataBase(userToRegister).then(registeredUser => {
                        if (registeredUser.id) {
                            if (user.profile) {
                                user.profile.userId = Number(registeredUser.id);
                                addProfileToUserAtDataBase(user.profile)
                                    .then(() => {
                                        if (user.profile && user.profile.userId) {
                                            getUserById(user.profile.userId.toString())
                                                .then(updatedUser => {
                                                    dispatch(setUser(updatedUser[0]))
                                                })
                                        }
                                    })
                            }
                        }
                    }).catch(e => console.log(e))
                })
                .catch(err => {
                    console.log(err)
                });
        }
    };
};

export const profileUpdate = (user: User) => {
    return (dispatch: Dispatch<UserActionTypes | SystemActionTypes>): void => {
        if (user && user.profile) {
            updateUserProfileData(user.profile)
                .then(() => {
                    dispatch(setUser(user))
                })
        }
    }
};

export const addCityToProfile = (city: CityAdd, user: User) => {
    return (dispatch: Dispatch<UserActionTypes | SystemActionTypes>): void => {
        addCity(city)
            .then((el: City) => {
                if (user.profile && user.profile.cities) {
                    user.profile.cities[0] = el
                    dispatch(setUser(user))
                }
            }).catch((error: Error) => {
                console.log(error);
            })
    }
};

export const addLike = (like: LikeProfile) => {
    return (dispatch: Dispatch<UserActionTypes>): void => {
        giveLike(like)
            .then((newUser: User[]) => {
                dispatch(setUser(newUser[0]))
            })
    }
};

export const addCategoryToProfile = (category: { profileId: number, name: string }, user: User) => {
    return (dispatch: Dispatch<UserActionTypes>): void => {
        addCategory(category)
            .then((activity: Category) => {
                if (user.profile && user.profile.categories) {
                    user.profile.categories[0] = activity
                    dispatch(setUser(user))
                }
            }).catch((error: Error) => {
                console.log(error);
            })
    }
};

export const addSwipeToProfile = (swipe: { profileId: number, swipeId: number, direction: string }): void => {
    addSwipe(swipe);
};

