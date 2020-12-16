import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../types/combinedStoreTypes'
import './TopBarNewMatchesButton.css'

export const TopBarNewMatchesButton = () => {
  const userIsLoggedIn = useSelector((state: RootState) => state.system.loggedIn)
  const userHasNewMatches = useSelector((state: RootState) => state.user.profile?.hasNewMatch)
  const changeOnNewMatches = userHasNewMatches ? 'hasNewMatches' : 'noNewMatches'

  return (<div
    className="top_bar_new_matches_button_container" >
    {userIsLoggedIn && <button
      className={changeOnNewMatches}>Matches</button>}
  </div>)
}