import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Button } from 'react-bootstrap';
import { addLike } from '../../utils/systemFunction';
import { Link } from 'react-router-dom';
import { getAllProfiles } from './../../utils/userDatabaseFetch';
import './profilePage.css';
import { Profile } from '../../types/user';
import { initialProfileState } from './../../redux/userState/userReducer';
import { CategoriesList } from './categoriesList';
import { MyMatches } from './myMatches';
import { InvitationsSent } from './invitationsSent';
import { InvitationsReceived } from './invitationsReceived';
import { ModalAddCity } from './modalAddCity';
import { ModalEditProfile } from './modalEditProfile';

export const ProfilePage = (): JSX.Element => {

  const user = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
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

  const handleShow = () => setShow(true);
  const handleShowCity = () => setShowCityModal(true);

  const filterSwipedProfiles = (profiles: Profile[], currentDir: string[]): Profile[] | void => {
    const filteredByCity = filterByCriteria(profiles, user.profile, 'cities', 'name');
    const filteredByCityAndActivity = filterByCriteria(filteredByCity, user.profile, 'categories', 'name');

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

      if (filteredByPreviousSwipes.length > 0 && (user.profile.swipes.length > 0 || currentDir.length > 0)) {
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
        if (user.profile.matched && user.profile.matched.length > 0 && filteredByCityAndActivity.length !== 0 && filteredByPreviousSwipes.length > 0) {
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

  const filterByCriteria = (a: any, b: any, criteria: string, property: string): Profile[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const res = a.filter((el: any): boolean => {                                                // eslint-disable-line @typescript-eslint/no-explicit-any
      return el[criteria][0][property] === b[criteria][0][property]
    })
    return res
  };

  const filterNotMatchedYet = (obj: Profile[]): Profile[] => {
    const filteredByNotMatchedYet = [];
    if (user.profile.matched && obj.length > 0) {
      for (let i = 0; i < obj.length; i++) {
        let flag;
        for (let a = 0; a < user.profile.matched.length; a++) {
          if (Number(user.profile.matched[a].id) === Number(obj[i].id)) {
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
  };

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



  return (

    <div id="profile_body">
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

              <Link to={{
                pathname: '/chats',
                state: {
                  matches: user.profile.matched
                }
              }}>
                <Button id="chats-link-btn">Chat Room</Button>
              </Link>

              <Link to="/matches">
                <Button id="chats-link-btn">Matches</Button>
              </Link>

              <Link to={{
                pathname: '/swiping',
                state: {
                  profiles: filterSwipedProfiles(profiles, currentDirection),
                }
              }}>
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
          <MyMatches />
          <div id="invitations-grid-area">
            <div className="invitations-container" id="invitations-sent">
              <div className="invitations-container-title">You have invited them</div>
              <InvitationsSent list={user.profile.likedProfile} cb={filterNotMatchedYet} />
            </div>
            <div className="invitations-container" id="invitations-received">
              <div className="invitations-container-title">They have invited you</div>
              <InvitationsReceived list={receivedLikes} cb={filterNotMatchedYet} setReceivedLikes={setReceivedLikes}
                sendLikesToBackEnd={sendLikesToBackEnd} />
            </div>
          </div>
        </div>
        <ModalAddCity showCityModal={showCityModal} setShowCityModal={setShowCityModal} />
        <ModalEditProfile show={show} setShow={setShow} />
      </div>
    </div>
  )
}