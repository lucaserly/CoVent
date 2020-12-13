import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import TinderCard from 'react-tinder-card';
import { ProfileNew } from './../../types/userLucasTypes';
import { getAllProfiles } from './../../utils/userDatabaseFetch';
import './swiping.css'

import { setDirection } from '../../redux/directionState/directionActions';

export const Swiping = (prop: any): any => {

  const currentUser = useSelector((state: RootState) => state.user)
  const currentDirection = useSelector((state: RootState) => state.direction)
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