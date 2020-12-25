import React from 'react';
import { useDispatch } from "react-redux";
import TinderCard from 'react-tinder-card';
import { setDirection } from '../../redux/directionState/directionActions';
import { Profile } from './../../types/user';
import { SwipeInterface } from './../../types/component';
import './swiping.css'

export const Swiping = (prop: SwipeInterface): JSX.Element => {
  const dispatch = useDispatch();
  const profiles = prop.location.state.profiles

  return (
    <>
      <div className="cards__container">
        {profiles.map((el: Profile): JSX.Element | void => {
          if (el.user) {
            return <TinderCard
              dispat={dispatch}
              setDir={setDirection}
              id={el.id}
              className="swipe"
              key={el.user.firstName}
              preventSwipe={['up', 'down']}
            >
              <div
                style={{ backgroundImage: `url(${el.picture})` }}
                className="card"
              >
                <h3>{el.user.firstName}</h3>
              </div>
            </TinderCard>
          } else {
            return undefined;
          }
        }
        )}
      </div>
    </>
  )
}