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
  console.log('------------------------->');
  console.log('INSIDE INVITATIONSRECEIVED-->')
  console.log('listA-->', listA);
  console.log('listB-->', listB);
  console.log('currentDirection-->', currentDirection);

  // first filter is rejected
  const receivedLikesFilteredByMatched = cb(listA, listB, criteria, propertyA, propertyB)
  console.log('receivedLikesFilteredByMatched-->', receivedLikesFilteredByMatched);
  const receivedLikesFilteredByMatchedAndCurrentDirection = cb(receivedLikesFilteredByMatched, currentDirection, '', 'id', /\d+/g)
  console.log('receivedLikesFilteredByMatchedAndCurrentDirection-->', receivedLikesFilteredByMatchedAndCurrentDirection);
  const filteredByRejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'left')
  console.log('filteredByRejectedProfiles-->', filteredByRejectedProfiles);
  console.log('receivedLikesFilteredByMatchedAndCurrentDirection-->', receivedLikesFilteredByMatchedAndCurrentDirection);
  const result = cb(receivedLikesFilteredByMatchedAndCurrentDirection, filteredByRejectedProfiles,  '', 'id', 'swipeId')
  const rejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'right')
  console.log('listB[swipes]-->', listB['swipes']);
  console.log('rejectedProfiles-->', rejectedProfiles);
  const final = cb(result, rejectedProfiles, '', 'id', 'swipeId')
  // let result;
  // if (receivedLikesFilteredByMatchedAndCurrentDirection) {
  //   if (receivedLikesFilteredByMatchedAndCurrentDirection.length > filteredByRejectedProfiles.length) {
  //     result = cb(receivedLikesFilteredByMatchedAndCurrentDirection, filteredByRejectedProfiles,  '', 'id', 'swipeId')
  //     console.log('IF-->');
  //     console.log('result-->', result);
  //   } else {
  //     console.log('ELSE-->');
  //     result = cb(filteredByRejectedProfiles, receivedLikesFilteredByMatchedAndCurrentDirection, '','swipeId', 'id')
  //     console.log('result-->', result);
  //   }
  // }

  // const initialFilter = cb(listA, listB, criteria, propertyA, propertyB)
  // console.log('1 --> initialFilter-->', initialFilter);
  // if (initialFilter && initialFilter.length === 0) {
  //   listToMap = undefined;
  // } else if (listB.swipes.length > 0) {
  //   console.log('INSIDE IF swipes length-->');
  //   console.log('listB.swipes-->', listB.swipes);

  //   // console.log('listB-->', listB);
  //   const filteredByRejectedProfiles = filterByCondition(listB, 'swipes', 'direction', 'left');
  //   console.log('filteredByRejectedProfiles-->', filteredByRejectedProfiles);
  //   listToMap = cb(listB, filteredByRejectedProfiles, 'receivedLike', propertyB, 'swipeId')
  //   console.log('listToMap-->', listToMap);

  // } else if (currentDirection.length > 0) {
  //   listToMap = cb(listA, currentDirection, '', 'id', /\d+/g)
  // } else {
  //   listToMap = initialFilter;
  // }


  return (
    <div className="invitations-list">
      {/* {console.log('listToMap-->', listToMap)} */}
      {/* {console.log('listB.swipes-->', listB.swipes)}
      {console.log('currentDirection-->', currentDirection)} */}
      {final ? final.map((el: Profile, i: number) => {
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