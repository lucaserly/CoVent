import React, { FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Button, Modal } from 'react-bootstrap';
import { profileUpdate, addCityToProfile, addCategoryToProfile, addLike } from '../../utils/systemFunction';
import { Link } from 'react-router-dom';
import { getAllProfiles } from './../../utils/userDatabaseFetch';
import { setDirection } from '../../redux/directionState/directionActions';
import './profilePage.css';
import { User, Profile, CityAdd } from '../../types/user';

const categories = [
  'Athletics',
  'Ball Sports',
  'Beach Sports',
  'Body & Mind',
  'Cars',
  'City',
  'Climbing',
  'Combat Sports',
  'Cycling',
  'Dancing',
  'Equestrianism',
  'Fitness',
  'For Fun',
  'Games',
  'Hiking',
  'Ice',
  'Motorcycles',
  'Multi-Sport',
  'Nature',
  'Party',
  'Photography',
  'Piloting',
  'Pool',
  'Racket Sports',
  'Rowing',
  'Shooting',
  'Sky',
  'Slacklining',
  'Snow',
  'Strength',
  'Traveling',
  'Underwater',
  'Water',
  'Wind'
]

const initialProfileState: Profile = {
  id: undefined,
  picture: '',
  description: '',
  age: '',
  gender: '',
  location: '',
  hasNewMatch: false,
  receivedLike: [],
  swipes: []
}

export const ProfilePage = (): JSX.Element => {

  const user = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [picture, setPicture] = useState('')
  const [description, setDescription] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('');
  const [receivedLikes, setReceivedLikes] = useState<Profile[]>([initialProfileState]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    setReceivedLikes(user.profile.receivedLike)
    getAllProfiles()
      .then((list) => {
        const filteredList = list.filter((el) => el.id !== user.id)
        setProfiles(filteredList)
        if (user.profile.id) {
          sendLikesToBackEnd(currentDirection, user.profile.id)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseCity = () => setShowCityModal(false);
  const handleShowCity = () => setShowCityModal(true);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>, cb: React.Dispatch<React.SetStateAction<string>>) => {
    cb(ev.target.value)
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
      const newUs: User = {
        ...user, profile: {
          age: age !== "" ? age : user.profile.age,
          categories: user.profile.categories,
          cities: user.profile.cities,
          description: description !== "" ? description : user.profile.description,
          gender: gender !== "" ? gender : user.profile.gender,
          hasNewMatch: user.profile.hasNewMatch,
          id: user.profile.id,
          likedProfile: user.profile.likedProfile,
          location: location !== "" ? location : user.profile.location,
          matched: user.profile.matched,
          picture: picture !== "" ? picture : user.profile.picture,
          receivedLike: user.profile.receivedLike,
          userId: user.id,
          swipes: user.profile.swipes
        }
      }
      dispatch(profileUpdate(newUs))
  };

  const firstLetterUpper = (str: string): string => {
    const arr = str.split('')
    arr[0] = arr[0].toUpperCase()
    return arr.join('')
  }

  const handleCitySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (user.profile.id) {
      const cityObj: CityAdd = {
        profileId: user.profile.id,
        name: firstLetterUpper(city)
      }
      dispatch(addCityToProfile(cityObj, user))
    }
  };

  const handleCategorySubmit = (ev: FormEvent): void => {
    const target = ev.target as HTMLInputElement
    if (user.profile.id) {
      const categoryToSend = {
        profileId: user.profile.id,
        name: target.value
      }
      dispatch(addCategoryToProfile(categoryToSend, user))
    }
  };

  const filterSwipedProfiles = (profiles: Profile[], currentDir: string[]): Profile[] | void => {
    const filteredByCity = filterByCity(profiles);
    const filteredByCityAndActivity = filterByActivity(filteredByCity)

    if (filteredByCityAndActivity) {
      const filteredByCityActivitySelf = filteredByCityAndActivity.filter((el: Profile) => el.id !== user.id)
      let filteredByPreviousSwipes = [];
      if (user.profile.swipes.length > 0) {
        for (let a = 0; a < filteredByCityActivitySelf.length; a++) {
          let flag;
          for (let c = 0; c < user.profile.swipes.length; c++) {
            if (Number(user.profile.swipes[c].swipeId) === filteredByCityActivitySelf[a].id) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            filteredByPreviousSwipes.push(filteredByCityActivitySelf[a])
          }
          else {
            flag = false;
          }
        }
      } else {
        filteredByPreviousSwipes = filteredByCityActivitySelf
      }

      if (filteredByPreviousSwipes.length > 0 && (user.profile && user.profile.swipes && user.profile.swipes.length > 0 || currentDir.length > 0)) {
        const result = [];
        for (let i = 0; i < filteredByPreviousSwipes.length; i++) {
          let flag;
          for (let a = 0; a < currentDir.length; a++) {
            if (Number(currentDir[a].match(/\d+/g)) === filteredByPreviousSwipes[i].id) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            result.push(filteredByPreviousSwipes[i]);
          } else {
            flag = false;
          }
        }
        return result;
      }
      else {
        const filteredByNotMatchedYet = [];
        if (user && user.profile && user.profile.matched && filteredByCityAndActivity.length !== 0 && filteredByPreviousSwipes.length > 0) {
          for (let i = 0; i < filteredByCityAndActivity.length; i++) {
            let flag;
            for (let a = 0; a < user.profile.matched.length; a++) {
              if (Number(user.profile.matched[a].id) === Number(filteredByCityAndActivity[i].id)) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              filteredByNotMatchedYet.push(filteredByCityAndActivity[i])
            } else {
              flag = false;
            }
          }
          return filteredByNotMatchedYet;
        } else {
          return filteredByPreviousSwipes
        }
      }
    }
  };

  const filterByCity = (profiles: Profile[]): Profile[] | undefined => {
    if (user && user.profile && user.profile.cities && user.profile.cities[0] && user.profile.cities[0].name) {
      const res = profiles.filter((el): boolean | undefined => {
        if (user && user.profile && user.profile.cities && user.profile.cities[0].name && el && el.cities && el.cities.length > 0) {
          if (el.cities && el.cities[0] && el.cities[0].name && user && user.profile && user.profile.cities && user.profile.cities[0]) {
            return el.cities[0].name === user.profile.cities[0].name;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      })
      return res;
    }
  }

  const filterByActivity = (profiles: Profile[] | undefined): Profile[] | void => {
    if (profiles) {
      const res = profiles.filter((el): boolean | undefined => {
        if (user && user.profile && user.profile.categories && user.profile.categories.length > 0 && el.categories && el.categories.length > 0) {
          return el.categories[0].name === user.profile.categories[user.profile.categories.length - 1].name
        } else {
          return undefined;
        }
      })
      return res;
    }
  }

  const sendLikesToBackEnd = (currentDir: string[], profileId: number): void => {
    currentDir.forEach((el) => {
      if (String(el.match(/[^\s]+/)) === 'right') {
        const res: RegExpMatchArray | null = el.match(/\d+/g)
        res && dispatch(addLike({
          profileId: profileId,
          givenLikeId: +res
        }))
      }
    })
  }

  const filterNotMatchedYet = (obj: Profile[]): Profile[] => {
    const filteredByNotMatchedYet = [];
    if (user.profile && user.profile.matched && obj && obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        let flag;
        for (let a = 0; a < user.profile?.matched?.length; a++) {
          if (Number(user.profile?.matched[a].id) === Number(obj[i].id)) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          filteredByNotMatchedYet.push(obj[i])
        } else {
          flag = false;
        }
      }
    }
    return filteredByNotMatchedYet;
  }

  return (

    <div id="profile_body">
      <div id="sidebar-swipes">
        <div id="sidebar-swipes-title">Swipe by categories</div>
        <div id="sidebar-swipes-category-list">
          {categories.map((el, i) => {
            return <option onClick={(e) => { handleCategorySubmit(e) }} id="sidebar-swipe-element" key={i} value={el}>{el}</option>
          })
          }
        </div>
      </div>

      <div className="profile_page_content">
        <div className="profile_page_header_container">
          <div id="profile-infos-picture">
            {user && user.profile && user.profile.picture ? <div className="profile_page_image_container">
              <img className="profile_page_image" src={user.profile?.picture} alt="profile" />
            </div> : <></>}

            <div id="user-infos">
              <div className="user_first_name">{user.firstName}</div>
              <div id="user-age">{user.profile && user.profile.age} years old</div>
              <div id="selected-city">{user && user.profile && user.profile.cities && user.profile.cities[0] && user.profile.cities[0].name}</div>
              <Link to={{
                pathname: '/chats',
                state: {
                  matches: user.profile && user.profile.matched
                }
              }}>
                <Button id="chats-link-btn">Chat Room</Button>
              </Link>
            </div>
          </div>

          <div id="top_right_corner_btn">

            <Button variant="primary" onClick={handleShow} className="profile_update-button">Edit Profile</Button>
            <Button variant="primary" onClick={handleShowCity} className="city_add">Pick a city</Button>

          </div>
        </div>

        <div id="profile-page-body">

          <div id="my-matches-area">
            <div id="my-matches-title">My matches</div>
            <div id="my-matches-list">
              {user?.profile?.matched?.map((el: Profile, i: number) => {
                return (
                  <div id="match-container" key={i}>
                    <img src={el.picture} id="match-img" alt="profile pic" />
                    <div id="match-infos">
                      <div className="invitor-name" >{el.user?.firstName}</div>
                      <div className="invitor-city" >{el.location}</div>
                      <div id="match-description">{el.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div id="invitations-grid-area">
            <div className="invitations-container" id="invitations-sent">
              <div className="invitations-container-title">You have invited them</div>
              <div className="invitations-list">
                {user && user.profile && user.profile.likedProfile &&
                  user.profile.likedProfile[0] && user.profile.likedProfile[0].user
                  && filterNotMatchedYet(user.profile.likedProfile).map((el: Profile, i: number) => {
                    return (
                      <div id="invitor-area" key={i}>
                        <img className="invitor-img" src={el.picture} alt="invitor" />
                        <div id="invitor-details">
                          <div className="invitor-name" >{el.user?.firstName}</div>
                          <div className="invitor-city" >{el.location}</div>
                          <button id="invitor-view-profile-btn">View profile</button>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            <div className="invitations-container" id="invitations-received">
              <div className="invitations-container-title">They have invited you</div>
              <div className="invitations-list">
                {
                  user && user.profile && user.profile.receivedLike &&
                  user.profile.receivedLike[0] && user.profile.receivedLike[0].user
                  && filterNotMatchedYet(receivedLikes).map((el: Profile, i: number) => {
                    return (
                      <div id="invitor-area" key={i}>
                        <img className="invitor-img" src={el.picture} alt="invitor" />
                        <div id="invitor-details">
                          <div className="invitor-name" >{el.user?.firstName}</div>
                          <div className="invitor-city" >{el.location}</div>
                          <button id="invitor-view-profile-btn">View profile</button>
                        </div>
                        <div id="evaluate-invitation-btn">

                          <Button id="accept-invitation-btn" onClick={(e) => {
                            setReceivedLikes((prevList: Profile[]) => {
                              return prevList.filter((element: Profile) => {
                                return element.id !== el.id
                              })
                            })
                            dispatch(setDirection([`right id:${el.id}`]))
                            if (user && user.profile) {
                              sendLikesToBackEnd([`right id:${el.id}`], Number(user.profile.id))
                            }
                          }}>√</Button>

                          <Button id="reject-invitation-btn">X</Button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <div id="modal-background">
            <div id="edit-profile-modal-form">
              <Modal.Header>
                <Modal.Title id="edit-profile-title">Edit Your Profile</Modal.Title>
                <Modal.Body>

                  <form id="edit-profile-input-list">
                    <input className="edit-profile-input-field" name="picture" id="" placeholder="Picture" onChange={(e) => {
                      handleChange(e, setPicture)
                    }}></input>
                    <input className="edit-profile-input-field" name="description" id="" placeholder="Description" onChange={(e) => {
                      handleChange(e, setDescription)
                    }}></input>
                    <input className="edit-profile-input-field" name="age" id="" placeholder="Age" onChange={(e) => {
                      handleChange(e, setAge)
                    }}></input>
                    <input className="edit-profile-input-field" name="gender" id="" placeholder="Gender" onChange={(e) => {
                      handleChange(e, setGender)
                    }}></input>
                    <input className="edit-profile-input-field" name="location" id="" placeholder="Location" onChange={(e) => {
                      handleChange(e, setLocation)
                    }}></input>
                  </form>

                </Modal.Body>
                <Modal.Footer>

                  <Button id="edit-profile-submit-btn" variant="primary" onClick={(e) => {
                    handleSubmit(e)
                    handleClose()
                  }}>
                    Save Changes
                  </Button>
                  <div id="close-edit-profile-modal" onClick={handleClose}>Close</div>
                </Modal.Footer>
              </Modal.Header>
            </div>
          </div>
        </Modal>

        <div>
          <Modal show={showCityModal} onHide={handleCloseCity}>
            <div id="modal-background">
              <div id="edit-profile-modal-form">
                <Modal.Header>
                  <Modal.Title id="edit-profile-title">Add your city</Modal.Title>
                  <Modal.Body>
                    <form id="edit-profile-input-list">
                      <input className="edit-profile-input-field" name="city" id="" onChange={(e) => {
                        handleChange(e, setCity)
                      }}></input>
                    </form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button id="edit-profile-submit-btn" variant="primary" onClick={(e) => {
                      handleCitySubmit(e)
                      handleCloseCity()
                    }}>
                      Submit
                    </Button>
                    <div id="close-edit-profile-modal" onClick={handleCloseCity}>Close</div>
                  </Modal.Footer>
                </Modal.Header>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      <Link to={{
        pathname: '/swiping',
        state: {
          profiles: filterSwipedProfiles(profiles, currentDirection),
        }
      }}>
        <Button>Swiping</Button>
      </Link>

      <Link to="/matches">
        <Button>Matches</Button>
      </Link>

      <Link to={{
        pathname: '/chats',
        state: {
          matches: user.profile && user.profile.matched
        }
      }}>
        <Button>Chats</Button>
      </Link>

    </div>
  )
}