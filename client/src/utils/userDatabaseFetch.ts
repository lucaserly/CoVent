import { User, Profile, City, Category, LikeProfile, ReceiveLike, Swipe, Message, Messaged, Credentials, CityAdd } from '../types/user';
const baseUrl = "http://localhost:3002";

export const getAllUsers = (): Promise<User[]> => {
  return fetchRequest(`/users`, {
    headers: {
      Accept: "application/json",
    }
  })
};

export function getUserByEmailAndPassword(email: string, password: string): Promise<User> {
  return fetchRequest(`/login`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  })
}

export function getUserById(id: string): Promise<User[]> {
  return fetchRequest(`/user/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function registerUserToDataBase(userToRegister: Credentials): Promise<User> {
  return fetchRequest(`/register`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userToRegister),
  })
}

export function addProfileToUserAtDataBase(profile: Profile): Promise<Response> {
  return fetchRequest(`/profile`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile),
  })
}

export function addCategoryToUserAtDataBase(category: Category): Promise<User> {
  return fetchRequest(`/category`, {
    method: "POST",
    body: JSON.stringify(category),
    headers: {
      Accept: "application/json",
    }
  })
}

export function giveLikeToOtherUser(giveLike: LikeProfile): Promise<User> {
  return fetchRequest(`/like/give`, {
    method: "POST",
    body: JSON.stringify(giveLike),
    headers: {
      Accept: "application/json",
    }
  })
}

export function receivedLikeFromOther(receivedLike: ReceiveLike): Promise<User> {
  return fetchRequest(`/like/received`, {
    method: "POST",
    body: JSON.stringify(receivedLike),
    headers: {
      Accept: "application/json",
    }
  })
}

export const updateUserProfileData = (updatedUserProfile: Profile): Promise<Response> => {
  return fetchRequest(`/profile`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUserProfile),
  })
};

export const getAllCities = (): Promise<City[]> => {
  return fetchRequest(`/cities`, {
    headers: {
      Accept: "application/json",
    },
  })
};

export const getAllProfiles = (): Promise<Profile[]> => {
  return fetchRequest(`/profiles`, {
    headers: {
      Accept: "application/json",
    },
  })
};

export const addCity = (city: CityAdd): Promise<City> => {
  return fetchRequest(`/city`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(city),
  })
};

export const giveLike = (like: LikeProfile): Promise<User[]> => {
  return fetchRequest(`/like/give`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(like),
  })
};

export const addCategory = (category: { profileId: number, name: string }): Promise<Category> => {
  return fetchRequest(`/category`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(category),
  })
}

export const addSwipe = (swipe: { profileId: number, swipeId: number, direction: string }): Promise<Swipe> => {
  return fetchRequest(`/swipe`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(swipe)
  })
};

export const addMsg = (msg: Messaged): Promise<Response> => {
  return fetchRequest(`/message`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(msg)
  })
};

export const getAllMsgs = (): Promise<Message[]> => {
  return fetchRequest(`/messages`, {
    headers: {
      Accept: "application/json",
    }
  })
}

export const getMsgByProfileId = (profileId: number): Promise<Profile> => {
  return fetchRequest(`/messages/${profileId}`, {
    headers: {
      Accept: "application/json",
    }
  })
}

export const getMsgByReceivedId = (receivedId: number): Promise<Message[]> => {
  return fetchRequest(`/messages/received/${receivedId}`, {
    headers: {
      Accept: "application/json",
    }
  })
}

export const getMsgBySentId = (sentId: number): Promise<Message[]> => {
  return fetchRequest(`/messages/sent/${sentId}`, {
    headers: {
      Accept: "application/json",
    }
  })
}

export const getMsgsByProfileIdAndReceiverId = (profileId: number, receiverId: number): Promise<Message[]> => {
  return fetchRequest(`/messages/${profileId}/${receiverId}`, {
    headers: {
      Accept: "application/json",
    }
  })
}

const fetchRequest = (path: string, options?: RequestInit) => {
  return fetch(baseUrl + path, options)
    .then(res => res.status < 400 ? res : Promise.reject())
    .then(res => res.status !== 204 ? res.json() : res)
    .catch(err => {
      console.error('Error:', err);
    })
}
