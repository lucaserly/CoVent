import React from 'react';
import { FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { User } from "../../types/userTypes";
import { Button, Modal } from 'react-bootstrap';
import { profileUpdate, addCityToProfile, addCategoryToProfile } from '../../utils/systemFunction';
import { ProfileNew, CityAdd } from "../../types/userLucasTypes";
import './profilePage.css';
import { Link } from 'react-router-dom';
import { getAllProfiles } from './../../utils/userDatabaseFetch';
import { addLike } from './../../utils/systemFunction';
import { setUser } from '../../redux/userState/userActions';

export const ProfilePage = () => {

  console.log('INSIDE PROFILE-->');
  const user = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const currentUser = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch();

  const initialState = {
    picture: '',
    description: '',
    age: '',
    gender: '',
    location: '',
  }

  const initialStateCity: CityAdd = {
    profileId: 0,
    name: ''
  }


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
    'Fishing: Catch & Release',
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
    'Radio-controlled Piloting',
    'Rowing',
    'Shooting',
    'Sky',
    'Slacklining',
    'Snow',
    'Strength',
    'Traveling',
    'Underwater',
    'Water',
    'Wildlife Viewing',
    'Wind'
  ]

  const [show, setShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [picture, setPicture] = useState('')
  const [description, setDescription] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [profiles, setProfiles] = useState<ProfileNew[]>([]);

  useEffect(() => {
    getAllProfiles()
      .then((list) => {
        console.log('USE EFFECT-->');
        console.log('list-->', list);

        const filteredList = list.filter((el) => el.id !== user.id)
        console.log('filteredList-->', filteredList);
        setProfiles(filteredList)
        // filterProfilesToShowExceptSwipedOnes(user, list)
        if (currentDirection.length && user.profile && user.profile.id) {
          sendLikesToBackEnd(currentDirection, user.profile.id)
        }
      })
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseCity = () => setShowCityModal(false);
  const handleShowCity = () => setShowCityModal(true);
  const handleShowCategory = () => setShowCategoryModal(true);
  const handleCloseCategory = () => setShowCategoryModal(false);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>, cb: any) => {
    cb(ev.target.value)
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (user && user.profile) {
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
        }
      }
      dispatch(profileUpdate(newUs))
    }
  };

  const handleCitySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (user.profile && user.profile.id) {
      const cityObj: CityAdd = {
        profileId: user.profile.id,
        name: city
      }
      dispatch(addCityToProfile(cityObj, user))
    }
  };

  const handleCategorySubmit = (ev: any): any => {
    console.log('e.target.value-->', ev.target.value);
    setCategory(ev.target.value)
    const categoryToSend = {
      profileId: user.profile && user.profile.id,
      name: ev.target.value
    }
    console.log('categoryToSend-->', categoryToSend);
    dispatch(addCategoryToProfile(categoryToSend, user))
  };

  const filterSwipedProfiles = (profiles: ProfileNew[], currentDir: string[]): any => {

    console.log('filterSwipedProfiles PROFILES FUNCTION-->');
    console.log('profiles-->', profiles);

    // filter profiles according to selected city from user
    const filteredByCity = filterByCity(profiles);
    // filter the above list based on selected activity from user
    const filteredByCityAndActivity = filterByActivity(filteredByCity)

    // remove yourself from the list
    if (filteredByCityAndActivity) {
      const filteredByCityActivitySelf = filteredByCityAndActivity.filter((el: any) => el.id !== user.id)

      console.log('INSIDE FILTERBYCITY AND ACTIVITY-->');
      console.log('filteredByCityActivitySelf-->', filteredByCityActivitySelf);


      let filteredByPreviousSwipes = [];

      if (user.profile && user.profile.swipes && user.profile.swipes.length > 0) {
        console.log('user.profile.swipes-->', user.profile.swipes);
        console.log('user.profile.swipes.length-->', user.profile.swipes.length);
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

      console.log('filteredByPreviousSwipes-->', filteredByPreviousSwipes);

      if (filteredByPreviousSwipes.length > 0) {
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
        console.log('filterSwipedProfiles result -->', result);

        return result;

      }
      else {
        return filteredByPreviousSwipes
      }
    }
  };

  const filterByCity = (profiles: ProfileNew[]): any => {
    console.log('filterByCity-->');
    console.log('profiles-->', profiles);
    console.log('user-->', user);

    // console.log('user.profile.cities-->', user.profile);
    if (user && user.profile && user.profile.cities && user.profile.cities[0] && user.profile.cities[0].name) {
      console.log('profiles-->', profiles);
      // console.log('profiles.cities-->', profiles.cities);
      const res = profiles.filter((el) => {
        console.log('el-->', el);
        if (user && user.profile && user.profile.cities && user.profile.cities[0].name && el && el.cities && el.cities.length > 0) {
          console.log('INSIDE IF STATEMENT FILTER BY CITY-->');
          if (el.cities && el.cities[0] && el.cities[0].name && user && user.profile && user.profile.cities && user.profile.cities[0]) {
            return el.cities[0].name === user.profile.cities[0].name;
          }
          // console.log('el.cities[0].name-->', el.cities[0].name);
          // console.log('el.cities[0].name === user.profile.ciities[0].name-->', el.cities[0].name === user.profile.cities[0].name);

          // console.log('user.profile.cities[0].name-->', user.profile.cities[0].name);
        }
      })
      console.log('filterByCity res -->', res);
      return res;
    }
  }

  const filterByActivity = (profiles: ProfileNew[]): any => {
    console.log('filterByActivity-->',);
    // console.log('profiles-->', profiles);
    if (profiles) {
      const res = profiles.filter((el) => {
        if (user && user.profile && user.profile.categories && user.profile.categories.length > 0 && el.categories && el.categories.length > 0) {
          // console.log('el.categories-->', el.categories);
          // console.log('el.categories[el.categories.length - 1].name-->', el.categories[el.categories.length - 1].name);
          // console.log('user.profile.categories[categories.length - 1].name-->', user.profile.categories[user.profile.categories.length - 1].name);
          return el.categories[0].name === user.profile.categories[user.profile.categories.length - 1].name
        }
      })
      console.log('res from filter by activity-->', res);
      return res;
    }
  }

  const sendLikesToBackEnd = (currentDir: string[], profileId: number): void => {
    currentDir.forEach((el) => {
      // console.log('el profilePage.tsx, line 174 el: ', el);
      if (String(el.match(/[^\s]+/)) === 'right') {
        dispatch(addLike({
          profileId: profileId,
          givenLikeId: el.match(/\d+/g)
        }))
      }
    })
  }

  const hideAcceptedLike = (user: any): User => {
    const newUser = { ...currentUser }
    if (newUser.profile && newUser.profile.matched &&  newUser.profile.receivedLike) {

     newUser.profile.matched.push(user)

     const arr = newUser.profile.receivedLike.filter(profile => profile.id !== user.id)
     newUser.profile.receivedLike= arr
    }
    console.log(newUser , 'newUSer------------')
    return newUser

  }

  // const filterProfilesToShowExceptSwipedOnes = (user: User, list: ProfileNew[]): void => {
  //   console.log('user profilePage.tsx, line 188 user: ', user);
  //   console.log('list profilePage.tsx, line 189 list: ', list);
  //   // create table in back end where you keep track of swiped profiles
  //   // user has many swipes ->  a swipe belongs to one user
  // }

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
            <div className="profile_page_image_container">
              <img className="profile_page_image" src={user.profile?.picture} alt="profile" />
            </div>

            <div id="user-infos">
              <div className="user_first_name">{user.firstName}</div>
              <div id="user-age">{user.profile && user.profile.age} years old</div>
              <div id="selected-city">{user && user.profile && user.profile.cities && user.profile.cities[0] && user.profile.cities[0].name}</div>
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
              {currentUser.profile && currentUser.profile.matched && currentUser.profile.matched.map((el, i) => {
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
                  && user.profile.likedProfile.map((el, i) => {
                    return (
                      <div id="invitor-area" key={i}>
                        <img className="invitor-img" src={el.picture} />
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
                  && user.profile.receivedLike.map((el, i) => {
                    if (el.user && el.user.id) {

                      return (
                        <div id="invitor-area" key={i}>
                          <img className="invitor-img" src={el.picture} />
                          <div id="invitor-details">
                            <div className="invitor-name" >{el.user?.firstName}</div>
                            <div className="invitor-city" >{el.location}</div>
                            <button id="invitor-view-profile-btn">View profile</button>
                          </div>
                          <div id="evaluate-invitation-btn">
                            <Button id="accept-invitation-btn" onClick={() => {
                              console.log('click')
                              dispatch(setUser(hideAcceptedLike(el.user)))}}>√</Button>
                            <Button id="reject-invitation-btn">X</Button>
                          </div>
                        </div>
                      )
                    }
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


        {/* REUSED IDs FROM THE OTHER MODAL BELOW */}
        {/* NEED CHANGE */}


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

      {/* <div id="select-category-area">
      <select id="mySelect" onChange={(e) => { handleCategorySubmit(e) }}>
          {categories.map((el, i) => {
            return <option key={i} value={el}>{el}</option>
          })
          }
        </select>
      </div> */}

      {/* {console.log('user', user)} */}
      {user.profile && user.profile.swipes && console.log('user.profile.swipes-->', user.profile.swipes)}
      {console.log('currentDirection', currentDirection)}

      {/* {user.profile && user.profile.id && currentDirection && currentDirection.length && sendLikesToBackEnd(currentDirection, user.profile.id)} */}

      <Link to={{
        pathname: '/swiping',
        state: {
          profiles: filterSwipedProfiles(profiles, currentDirection)
        }
      }}>
        <Button>Swiping</Button>
      </Link>

      <Link to="/matches">
        <Button>Matches</Button>
      </Link>

      {console.log('user.profile-->', user.profile)}
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