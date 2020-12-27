import React, { SetStateAction, Dispatch } from 'react';
import { useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Profile } from '../../types/user';
import { ButtonInvitations } from './buttonInvitations';
import { filterByCondition } from './helperFunctions';

interface CallBack {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (aList: any, bList: any, criteria: string, propertyA: string, propertyB: string | object): Profile[] | undefined   // eslint-disable-line @typescript-eslint/ban-types
}

export const InvitationsReceived = (props: {
  listA: Profile[], listB: Profile, criteria: string, propertyA: string,
  propertyB: string, cb: CallBack, setReceivedLikes: Dispatch<SetStateAction<Profile[]>>
}): JSX.Element => {
  const { listA, listB, criteria, propertyA, propertyB, cb, setReceivedLikes } = props;
  const currentDirection = useSelector((state: RootState) => state.direction)
  const receivedLikesFilteredByMatched = cb(listA, listB, criteria, propertyA, propertyB)
  const receivedLikesFilteredByMatchedAndCurrentDirection = cb(receivedLikesFilteredByMatched, currentDirection, '', 'id', /\d+/g)
  const filteredByRejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'left')
  const filteredByAlreadySwiped = cb(receivedLikesFilteredByMatchedAndCurrentDirection, filteredByRejectedProfiles, '', 'id', 'swipeId')
  const rejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'right')
  const listToMap = cb(filteredByAlreadySwiped, rejectedProfiles, '', 'id', 'swipeId')

  return (
    <div className="invitations-list">
      {listToMap ? listToMap.map((el: Profile, i: number) => {
        return (
          <div id="invitor-area" key={i}>
            <img className="invitor-img" src={el.picture} alt="invitor" />
            <div id="invitor-details">
              <div className="invitor-name" >{el.user?.firstName}</div>
              <div className="invitor-city" >{el.location}</div>
              <button id="invitor-view-profile-btn">View profile</button>
            </div>
            <ButtonInvitations el={el} setReceivedLikes={setReceivedLikes} />
          </div>
        )
      }) : <></>
      }
    </div>
  )
}