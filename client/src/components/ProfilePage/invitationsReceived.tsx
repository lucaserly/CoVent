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

interface SendLikesToBackEnd {
  (currentDir: string[], profileId: number): void
}

export const InvitationsReceived = (props: {
  listA: Profile[], listB: Profile, criteria: string, propertyA: string,
  propertyB: string, cb: CallBack, setReceivedLikes: Dispatch<SetStateAction<Profile[]>>,
  sendLikesToBackEnd: SendLikesToBackEnd
}): JSX.Element => {
  const { listA, listB, criteria, propertyA, propertyB, cb, setReceivedLikes, sendLikesToBackEnd } = props;
  const currentDirection = useSelector((state: RootState) => state.direction)
  let listToMap;
  // console.log('listA-->', listA);
  // console.log('cb(listA, listB, criteria, propertyA, propertyB)-->', cb(listA, listB, criteria, propertyA, propertyB));


  const initialFilter = cb(listA, listB, criteria, propertyA, propertyB)
  // console.log('initialFilter-->', initialFilter);
  if (initialFilter && initialFilter.length === 0) {
    listToMap = undefined;
  } else if (listB.swipes.length > 0) {
    // console.log('INSIDE IF INVITATIONSRECEIVED-->');
    // console.log('listB-->', listB);
    const filteredByRejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'left');
    // console.log('filteredByRejectedProfiles-->', filteredByRejectedProfiles);
    listToMap = cb(listB, filteredByRejectedProfiles, criteria, propertyA, 'swipeId')
  } else if (currentDirection.length > 0) {
    listToMap = cb(listA, currentDirection, '', 'id', /\d+/g)
  } else {
    listToMap = initialFilter;
  }


  return (
    <div className="invitations-list">
      {/* {console.log('listToMap-->', listToMap)} */}
      {/* {console.log('listB.swipes-->', listB.swipes)}
      {console.log('currentDirection-->', currentDirection)} */}
      {listToMap ? listToMap.map((el: Profile, i: number) => {
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
      }) : <></>
      }
    </div>
  )
}