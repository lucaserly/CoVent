import React from 'react';
// import { useSelector } from "react-redux";
// import { RootState } from '../../types/combinedStoreTypes';
import { Profile } from '../../types/user';

export const MyMatches = (props: { matches: Profile[] | undefined }): JSX.Element => {
  // const user = useSelector((state: RootState) => state.user)
  const { matches } = props;
  return (
    <div id="my-matches-area">
      <div id="my-matches-title">My matches</div>
      <div id="my-matches-list">
        {matches && matches.map((el: Profile, i: number) => {
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
  )
}