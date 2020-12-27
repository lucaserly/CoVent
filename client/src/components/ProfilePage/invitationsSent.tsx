import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { Profile } from '../../types/user';
import { filterByCondition } from './helperFunctions';

interface CallBack {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (aList: any, bList: any, criteria: string, propertyA: string, propertyB: string | object): Profile[] | undefined   // eslint-disable-line @typescript-eslint/ban-types
}

export const InvitationsSent = (props: {
  listA: Profile[], listB: Profile, criteria: string, propertyA: string,
  propertyB: string, cb: CallBack
}): JSX.Element => {
  const currentDirection = useSelector((state: RootState) => state.direction)

  const { listA, listB, criteria, propertyA, propertyB, cb } = props;

  // let listToRender;
  // console.log('currentDirection-->', currentDirection);
  // if (currentDirection.length > 0) {
  //   const filteredByCurrentDirection = filterByCondition(listB, 'swipes', 'direction', 'rigth')
  //   // console.log('filteredByCurrentDirection-->', filteredByCurrentDirection);
  //   // cb(listB, filteredByRejectedProfiles, criteria, propertyA, 'swipeId')
  //   // listTorender = cb(listB, filteredByCurrentDirection, criteria, propertyA, 'sweipedId')
  // }


  // const render = currentDirection.length > 0 ? filterByCondition(listB, 'swipes', 'direction', 'rigth') : cb(listA, listB, criteria, propertyA, propertyB);
  const render = cb(listA, listB, criteria, propertyA, propertyB);
  return (
    <div className="invitations-list">
      {render ? render.map((el: Profile, i: number) => {
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
      }) : <> </>
      }
    </div>
  )
}