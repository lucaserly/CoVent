import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../types/combinedStoreTypes';
import { TopBarLandingPage } from './topBarLandingPage/topBarLandingPage';
import { Searchbar } from './searchbar/searchbar';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getAllProfiles } from './../../utils/userDatabaseFetch';
import { Profile } from '../../types/user';
import { addLike } from './../../utils/systemFunction';
import './landingPage.css';

export const LandingPage = (): ReactElement => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    getAllProfiles()
      .then((list) => {
        const filteredList = list.filter((el) => el.id !== currentUser.id)
        setProfiles(filteredList)
        if (currentUser.profile.id) {
          sendLikesToBackEnd(currentDirection, currentUser.profile.id)
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterSwipedProfiles = (profiles: Profile[], currentDir: string[]): Profile[] => {
    const result = [];
    for (let i = 0; i < profiles.length; i++) {
      let flag;
      for (let a = 0; a < currentDir.length; a++) {
        if (Number(currentDir[a].match(/\d+/g)) === profiles[i].id) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(profiles[i]);
      } else {
        flag = false;
      }
    }
    return result;
  };

  const sendLikesToBackEnd = (currentDir: string[], profileId: number): void => {
    currentDir.forEach((el: string) => {
      if (String(el.match(/[^\s]+/)) === 'right') {
        const res: RegExpMatchArray | null = el.match(/\d+/g)
        res && dispatch(addLike({
          profileId: profileId,
          givenLikeId: +res
        }))
      }
    })
  }

  return (
    <>
      <div className="landing_page_container">
        <TopBarLandingPage />
      </div>
      <Searchbar key={Math.random()} />
      {currentUser.id ?
        <>
          <Link to={{
            pathname: '/swiping',
            state: {
              profiles: currentDirection.length === 0 ? profiles : filterSwipedProfiles(profiles, currentDirection)
            }
          }}>
            <Button id="swiping-btn">Swipe all</Button>
          </Link>
        </> : null
      }
    </>
  )
};