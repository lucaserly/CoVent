import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Button } from 'react-bootstrap';
import { addLike } from '../../utils/systemFunction';
import { Link } from 'react-router-dom';
import { getAllProfiles, getUserById } from './../../utils/userDatabaseFetch';
import './profilePage.css';
import { User, Profile } from '../../types/user';
import { initialUserState, initialProfileState } from './../../redux/userState/userReducer';
import { CategoriesList } from './categoriesList';
import { MyMatches } from './myMatches';
import { InvitationsSent } from './invitationsSent';
import { InvitationsReceived } from './invitationsReceived';
import { ModalAddCity } from './modalAddCity';
import { ModalEditProfile } from './modalEditProfile';
import { filterByCriteria, filterByMultipleCriterias } from './helperFunctions';
import { setUser } from '../../redux/userState/userActions';


export const ProfilePage = (): JSX.Element => {

  const user = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [receivedLikes, setReceivedLikes] = useState<Profile[]>([initialProfileState]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [updatedUser, setUpdatedUser] = useState<User>(initialUserState)

  useEffect(() => {
    console.log('PROFILE USEFFECT-->');
    if (user.id && user.profile.id) {
      console.log('currentDirection-->', currentDirection);
      sendLikesToBackEnd(currentDirection, user.profile.id)
      getUserById(user.id.toString())
        .then((user) => {
          dispatch(setUser(user[0]))
          setReceivedLikes(user[0].profile.receivedLike)
        })
    }
    getAllProfiles()
      .then((list) => {
        const filteredList = list.filter((el) => el.id !== user.id)
        // console.log('USE EFFECT-->');
        // console.log('filteredList-->', filteredList);
        setProfiles(filteredList)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDirection]);

  const handleShow = () => setShow(true);
  const handleShowCity = () => setShowCityModal(true);

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
  };

  const filterSwipedProfiles = (profiles: Profile[], currentDir: string[]): Profile[] | undefined => {
    // console.log('INSIDE FILTER SWIPED PROFILES-->');
    // console.log('PARAMETER 1 profiles-->', profiles);
    // console.log('PARAMETER 2 currentDir-->', currentDir);

    const filteredByCity = filterByCriteria(profiles, user.profile, 'cities', 'name');
    // console.log('1 --> filteredByCity-->', filteredByCity);

    const filteredByCityAndActivity = filterByCriteria(filteredByCity, user.profile, 'categories', 'name');
    // console.log('2 --> filteredByCityAndActivity-->', filteredByCityAndActivity);
    if (filteredByCityAndActivity) {
      // console.log('INSIDE FIRST IF-->');

      const filteredByCityActivitySelf = filteredByCityAndActivity.filter((el: Profile) => el.id !== user.id)
      // console.log('3 --> filteredByCityActivitySelf-->', filteredByCityActivitySelf);
      const filteredByPreviousSwipes = user.profile.swipes.length > 0 ? filterByMultipleCriterias(filteredByCityActivitySelf, user.profile, 'swipes', 'id', 'swipeId') : filteredByCityActivitySelf;
      // console.log('4 --> filteredByPreviousSwipes-->', filteredByPreviousSwipes);
      // console.log('user.profile.swipes-->', user.profile.swipes);

      if (filteredByPreviousSwipes && filteredByPreviousSwipes.length > 0 && currentDir.length > 0) {
        // console.log('filterByMultipleCriterias(filteredByPreviousSwipes, currentDir, id)-->', filterByMultipleCriterias(filteredByPreviousSwipes, currentDir, '', 'id', /\d+/g));
        // console.log('filteredByPreviousSwipes-->', filteredByPreviousSwipes);
        // console.log('currentDir-->', currentDir);
        const filteredByCityActivitySelfPreviousSwipeCurrentDirection = filterByMultipleCriterias(filteredByPreviousSwipes, currentDir, '', 'id', /\d+/g)
        // console.log('filteredByCityActivitySelfPreviousSwipeCurrentDirection-->', filteredByCityActivitySelfPreviousSwipeCurrentDirection);
        return filteredByCityActivitySelfPreviousSwipeCurrentDirection
      } else {
        if (user.profile.matched && user.profile.matched.length > 0 && filteredByCityAndActivity.length !== 0 && filteredByPreviousSwipes && filteredByPreviousSwipes.length > 0) {
          return filterByMultipleCriterias(filteredByCityAndActivity, user.profile, 'matched', 'id', 'id')
        } else {
          // console.log('filteredByPreviousSwipes-->', filteredByPreviousSwipes);

          return filteredByPreviousSwipes
        }
      }
    } else {
      return [];
    }
  };

  return (
    <div id="profile_body">
      {/* {console.log('receivedLikes-->', receivedLikes)}
      {console.log('currentDirection-->', currentDirection)} */}
      {/* {console.log('profiles-->', profiles)}
      {console.log('currentDirection-->', currentDirection)} */}
      {/* {console.log('filterSwipedProfiles(profiles, currentDirection)-->', filterSwipedProfiles(profiles, currentDirection))} */}
      <CategoriesList />
      <div className="profile_page_content">
        <div className="profile_page_header_container">
          <div id="profile-infos-picture">
            {user.profile.picture ? <div className="profile_page_image_container">
              <img className="profile_page_image" src={user.profile.picture} alt="profile" />
            </div> : <></>}
            <div id="user-infos">
              <div className="user_first_name">{user.firstName}</div>
              <div id="user-age">{user.profile.age} years old</div>
              <div id="selected-city">{user.profile.cities.length > 0 && user.profile.cities[0].name}</div>
              <div id="selected-city">{user.profile.categories.length > 0 && user.profile.categories[0].name}</div>
              <Link to={{ pathname: '/chats', state: { matches: user.profile.matched } }}>
                <Button id="chats-link-btn">Chat Room</Button>
              </Link>
              <Link to="/matches">
                <Button id="chats-link-btn">Matches</Button>
              </Link>
              <Link to={{ pathname: '/swiping', state: { profiles: filterSwipedProfiles(profiles, currentDirection) } }}>
                <Button id="chats-link-btn">Swiping</Button>
              </Link>
            </div>
          </div>

          <div id="top_right_corner_btn">
            <Button variant="primary" onClick={handleShow} className="profile_update-button">Edit Profile</Button>
            <Button variant="primary" onClick={handleShowCity} className="city_add">Pick a city</Button>
          </div>
        </div>
        <div id="profile-page-body">


          {/* FOR TOMORROW I GOTTA FIX THE FACK THAT WHEN I SWIPE AND UPDATE CURRENT DIRECTION AND USE LOCAL UPDATEDUSER IT DOESN'T RERENDER
          SO I WAS THINKING TO CHECK CURRENTDIRECTION IN MYMATCHES + INVITATIONS COMPONENTS SO TO RERENDER
          I NEED UPDATEDUSER IN ORDER TO GET MOST UPDATED MATCHES WHEN TWO USERS ARE SIMUNTANEOUSLY LOGGED
          IN OTHERWISE THE USER HAS TO LOG OUT AND LOG BACK IN TO GET UPDATED INFORMATION */}

          {/* CURRENTDIRECTION WAS IMPLEMENTED WITH REDUX BECAUSE I COULDN'T PASS IT DOWN VIA LINK TO SWIPE COMPONENET WITH USESTATE */}

          {/* AS SOON AS I SWIPE I WOULD CHECK IN INVITATIONSRECEIVED COMPONENET THE CURRENTDIRECTION LENGTH AND ADD THE  */}


          {/* I COULD USE CONTEXT TO PASS DOWN ALL THE PROPS TO INVITATIONSSENT AND INVITATIONSRECEIVED */}
          {/* REFACTOR EVERYTHING WITH CONTEXT */}

          {/* WHENEVER I GO INTO PROFILE I NEED UPDATED LIKEDPROFILES + RECEIVEDLIKES + MATCHES */}

          <MyMatches matches={user.profile.matched} />
          <div id="invitations-grid-area">
            <div className="invitations-container" id="invitations-sent">
              <div className="invitations-container-title">You have invited them</div>
              <InvitationsSent listA={user.profile.likedProfile} listB={user.profile} criteria={'matched'} propertyA={'id'} propertyB={'id'} cb={filterByMultipleCriterias} />
            </div>
            <div className="invitations-container" id="invitations-received">
              <div className="invitations-container-title">They have invited you</div>
              <InvitationsReceived listA={receivedLikes} listB={user.profile} criteria={'matched'} propertyA={'id'} propertyB={'id'} cb={filterByMultipleCriterias} setReceivedLikes={setReceivedLikes}
                sendLikesToBackEnd={sendLikesToBackEnd} />
            </div>
          </div>
        </div>
        <ModalAddCity showCityModal={showCityModal} setShowCityModal={setShowCityModal} />
        <ModalEditProfile show={show} setShow={setShow} />
      </div>
    </div>
  )
};