import React from 'react';
import { Profile } from '../../types/user';

interface CallBack {
  (obj: Profile[]): Profile[]
}

export const InvitationsSent = (props: { list: Profile[], cb: CallBack }): JSX.Element => {
  const { list, cb } = props;
  return (
    <div className="invitations-list">
      {cb(list).map((el: Profile, i: number) => {
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
  )
}