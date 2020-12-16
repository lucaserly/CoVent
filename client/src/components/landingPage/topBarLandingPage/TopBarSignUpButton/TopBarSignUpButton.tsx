import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../types/combinedStoreTypes'
import './TopBarSignUpButton.css'

interface TopBarSignUpButtonProp {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const TopBarSignUpButton = ({ setShowModal }: TopBarSignUpButtonProp): JSX.Element => {
  const userIsLoggedIn = useSelector((state: RootState) => state.system.loggedIn)
  const showSignUp = userIsLoggedIn || null

  return (
    <div>
      <div className="top_bar_sign_up_button_container">
        {showSignUp ??
          <>
            <button className="top_bar_sign_up_button" onClick={ () => {setShowModal(true)}}>Sign Up</button>
          </>
        }
      </div>
    </div>
  )
}