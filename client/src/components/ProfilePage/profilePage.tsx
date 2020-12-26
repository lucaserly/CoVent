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
    if (user.id) {
      getUserById(user.id.toString())
        .then((user) => {
          setUpdatedUser(user[0])
        })
    }
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

  const filterSwipedProfiles = (profiles: Profile[], currentDir: string[]): Profile[] | void => {
    const filteredByCity = filterByCriteria(profiles, user.profile, 'cities', 'name');
    const filteredByCityAndActivity = filterByCriteria(filteredByCity, user.profile, 'categories', 'name');
    if (filteredByCityAndActivity) {
      const filteredByCityActivitySelf = filteredByCityAndActivity.filter((el: Profile) => el.id !== user.id)
      const filteredByPreviousSwipes = user.profile.swipes.length > 0 ? filterByMultipleCriterias(filteredByCityActivitySelf, user.profile, 'swipes', 'id', 'swipeId') : filteredByCityActivitySelf;
      if (filteredByPreviousSwipes && filteredByPreviousSwipes.length > 0 && (user.profile.swipes.length > 0 || currentDir.length > 0)) {
        return filterByMultipleCriterias(filteredByPreviousSwipes, currentDir, '', 'id', /\d+/g)
      } else {
        if (user.profile.matched && user.profile.matched.length > 0 && filteredByCityAndActivity.length !== 0 && filteredByPreviousSwipes && filteredByPreviousSwipes.length > 0) {
          return filterByMultipleCriterias(filteredByCityAndActivity, user.profile, 'matched', 'id', 'id')
        } else {
          return filteredByPreviousSwipes
        }
      }
    }
  };

  return (
    <div id="profile_body">
      {/* {console.log('receivedLikes-->', receivedLikes)}
      {console.log('currentDirection-->', currentDirection)} */}
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
          <MyMatches matches={updatedUser.profile.matched} />
          <div id="invitations-grid-area">
            <div className="invitations-container" id="invitations-sent">
              <div className="invitations-container-title">You have invited them</div>
              <InvitationsSent listA={updatedUser.profile.likedProfile} listB={updatedUser.profile} criteria={'matched'} propertyA={'id'} propertyB={'id'} cb={filterByMultipleCriterias} />
            </div>
            <div className="invitations-container" id="invitations-received">
              <div className="invitations-container-title">They have invited you</div>
              <InvitationsReceived listA={updatedUser.profile.receivedLike} listB={updatedUser.profile} criteria={'matched'} propertyA={'id'} propertyB={'id'} cb={filterByMultipleCriterias} setReceivedLikes={setReceivedLikes}
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