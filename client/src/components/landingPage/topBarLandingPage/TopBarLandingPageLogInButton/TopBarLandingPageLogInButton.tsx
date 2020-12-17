import './TopBarLandingPageLogInButton.css'
import React, { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../types/combinedStoreTypes'
import { userLogOut, addSwipeToProfile } from '../../../../utils/systemFunction'

const USER_LOGGED_IN_TEXT = 'Log In'
const USER_LOGGED_OUT_TEXT = 'Log Out'

interface TopBarSignInButtonProp {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const TopBarLandingPageLogInButton = ({ setShowModal }: TopBarSignInButtonProp): ReactElement => {
  const dispatch = useDispatch()
  const userLoggedIn = useSelector((state: RootState) => state.system.loggedIn)
  const currentDirection = useSelector((state: RootState) => state.direction)
  const currentUser = useSelector((state: RootState) => state.user)

  function handleLogOut() {
    currentDirection.forEach((el) => {
      if (currentUser.profile && currentUser.profile.id) {
        const swipeValue = el.match(/\d+/g)
        if (swipeValue) {
          const swipeToSend = {
            profileId: currentUser.profile.id,
            swipeId: Number(swipeValue[0])
          }
          addSwipeToProfile(swipeToSend)
        }
      }
    })
    dispatch(userLogOut())
  }

  function displayModal() {
    setShowModal(true);
  }

  return (
    <div className="log_in_button_container">
      {userLoggedIn
        ? <div id="logout-div" onClick={handleLogOut}>{USER_LOGGED_OUT_TEXT}</div>
        : <button id="login-btn" onClick={displayModal}>{USER_LOGGED_IN_TEXT}</button>
      }
    </div>
  )
}

