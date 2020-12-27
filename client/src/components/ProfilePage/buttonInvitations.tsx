import React, { Dispatch, SetStateAction } from 'react';
import { Profile } from '../../types/user';
import { Button } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { setDirection } from '../../redux/directionState/directionActions';

export const ButtonInvitations = (props: { el: Profile, setReceivedLikes: Dispatch<SetStateAction<Profile[]>> }): JSX.Element => {

  const { el, setReceivedLikes } = props;
  const dispatch = useDispatch();

  return (
    <div id="evaluate-invitation-btn">
      <Button id="accept-invitation-btn" onClick={(e) => {
        dispatch(setDirection([`right id:${el.id}`]))
        setReceivedLikes((prevList: Profile[]) => {
          return prevList.filter((element: Profile) => {
            return element.id !== el.id
          })
        })
      }}>√</Button>
      <Button id="reject-invitation-btn" onClick={(e) => {
        setReceivedLikes((prevList: Profile[]) => {
          return prevList.filter((element: Profile) => {
            return element.id !== el.id
          })
        })
        dispatch(setDirection([`left id:${el.id}`]))
      }}>X</Button>
    </div>
  )
}

