import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../types/combinedStoreTypes'
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './TopBarNewMatchesButton.css'

export const TopBarNewMatchesButton = (): ReactElement => {
  const userIsLoggedIn = useSelector((state: RootState) => state.system.loggedIn)
  const userHasNewMatches = useSelector((state: RootState) => state.user.profile?.hasNewMatch)
  const changeOnNewMatches = userHasNewMatches ? 'hasNewMatches' : 'noNewMatches'

  return (<div
    className="top_bar_new_matches_button_container" >
    {userIsLoggedIn && 
        <Link to="/matches">
          <Button className={changeOnNewMatches}>Matches</Button>
      </Link>}
  </div>)
}
