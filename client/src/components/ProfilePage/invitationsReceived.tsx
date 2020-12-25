import React, { SetStateAction, Dispatch } from 'react';
import { Profile } from '../../types/user';
import { ButtonInvitations } from './buttonInvitations';

interface CallBack {
  (obj: Profile[]): Profile[]
}

interface SendLikesToBackEnd {
  (currentDir: string[], profileId: number): void
}

export const InvitationsReceived = (props: {
  list: Profile[], cb: CallBack, setReceivedLikes: Dispatch<SetStateAction<Profile[]>>,
  sendLikesToBackEnd: SendLikesToBackEnd
}): JSX.Element => {
  const { list, cb, setReceivedLikes, sendLikesToBackEnd } = props;
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
            <ButtonInvitations el={el} setReceivedLikes={setReceivedLikes} sendLikesToBackEnd={sendLikesToBackEnd} />
          </div>
        )
      })
      }
    </div>
  )
}