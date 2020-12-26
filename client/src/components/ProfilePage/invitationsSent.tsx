import React from 'react';
import { Profile } from '../../types/user';

interface CallBack {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (aList: any, bList: any, criteria: string, propertyA: string, propertyB: string | object): Profile[]   // eslint-disable-line @typescript-eslint/ban-types
}

export const InvitationsSent = (props: { listA: Profile[], listB: Profile, criteria: string, propertyA: string,
  propertyB: string, cb: CallBack }): JSX.Element => {
  const { listA, listB, criteria, propertyA, propertyB, cb } = props;
  return (
    <div className="invitations-list">
      {cb(listA, listB, criteria, propertyA, propertyB).map((el: Profile, i: number) => {
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