import React, { FormEvent, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { CityAdd } from '../../types/user';
import { addCityToProfile } from '../../utils/systemFunction';

export const ModalAddCity = (props: { showCityModal: boolean, setShowCityModal: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {

  const { showCityModal, setShowCityModal } = props;
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleCloseCity = () => setShowCityModal(false);
  const [city, setCity] = useState('');

    const firstLetterUpper = (str: string): string => {
      const arr = str.split('')
      arr[0] = arr[0].toUpperCase()
      return arr.join('')
    };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>, cb: React.Dispatch<React.SetStateAction<string>>) => {
    cb(ev.target.value)
  };

  const handleCitySubmit = (e: FormEvent) => {
    e.preventDefault()
    if (user.profile.id) {
      const cityObj: CityAdd = {
        profileId: user.profile.id,
        name: firstLetterUpper(city)
      }
      dispatch(addCityToProfile(cityObj, user))
    }
  };

  return (
    <div>
      <Modal show={showCityModal} onHide={handleCloseCity}>
        <div id="modal-background">
          <div id="edit-profile-modal-form">
            <Modal.Header>
              <Modal.Title id="edit-profile-title">Add your city</Modal.Title>
              <Modal.Body>
                <form id="edit-profile-input-list">
                  <input className="edit-profile-input-field" name="city" id="" onChange={(e) => {
                    handleChange(e, setCity)
                  }}></input>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button id="edit-profile-submit-btn" variant="primary" onClick={(e) => {
                  handleCitySubmit(e)
                  handleCloseCity()
                }}>
                  Submit
                    </Button>
                <div id="close-edit-profile-modal" onClick={handleCloseCity}>Close</div>
              </Modal.Footer>
            </Modal.Header>
          </div>
        </div>
      </Modal>
    </div>
  )
}