import React, { } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import TinderCard from 'react-tinder-card';
import './swiping.css'
import { setDirection } from '../../redux/directionState/directionActions';

export const Swiping = (prop: any): any => {
  const dispatch = useDispatch();
  const profiles = prop.location.state.profiles

  return (
    <>
      <div className="cards__container">
        {profiles && profiles.map((el: any) => {
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
        }
        )}
      </div>
    </>
  )
}