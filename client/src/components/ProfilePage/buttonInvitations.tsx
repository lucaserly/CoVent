import React, { Dispatch, SetStateAction } from 'react';
import { Profile } from '../../types/user';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { setDirection } from '../../redux/directionState/directionActions';

interface SendLikesToBackEnd {
  (currentDir: string[], profileId: number): void
}

export const ButtonInvitations = (props: { el: Profile, setReceivedLikes: Dispatch<SetStateAction<Profile[]>>, sendLikesToBackEnd: SendLikesToBackEnd }): JSX.Element => {

  const { el, setReceivedLikes, sendLikesToBackEnd } = props;
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user)

  return (
    <div id="evaluate-invitation-btn">
      <Button id="accept-invitation-btn" onClick={(e) => {
        setReceivedLikes((prevList: Profile[]) => {
          return prevList.filter((element: Profile) => {
            return element.id !== el.id
          })
        })
        dispatch(setDirection([`right id:${el.id}`]))
        if (user && user.profile) {
          sendLikesToBackEnd([`right id:${el.id}`], Number(user.profile.id))
        }
      }}>√</Button>
      <Button id="reject-invitation-btn">X</Button>
    </div>
  )
}

