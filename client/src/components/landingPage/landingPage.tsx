import React, { ReactElement, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../types/combinedStoreTypes';
import { TopBarLandingPage } from './topBarLandingPage/topBarLandingPage';
import { Searchbar } from './searchbar/searchbar';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { LikeProfile } from './likeProfile';
import { Profile } from '../../types/user';
import './landingPage.css';

export const LandingPage = (): ReactElement => {
  const currentUser = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const [city, setCity] = useState <string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);

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

  return (
    <>
      <div className="landing_page_container">
        <TopBarLandingPage />
      </div>
      <Searchbar city = {city} setCity= {setCity} />
      <LikeProfile city= {city} />

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