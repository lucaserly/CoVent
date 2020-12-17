import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Profile } from './../../types/user';

export const Matches = (): JSX.Element => {
  const currentUser = useSelector((state: RootState) => state.user)

  return (  
    <>
      { 
        currentUser.profile?.matched ?
          currentUser.profile.matched.map((el: Profile, i: number) =>
            <div key={i} className="image_container">
              <img src={el.picture} className="searchbar_image" alt="profile pic" />
            </div>
          ) 
        : null
      }
    </>
  )
}