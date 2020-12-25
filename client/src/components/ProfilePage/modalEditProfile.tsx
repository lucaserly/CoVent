import React, { FormEvent, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { User } from '../../types/user';
import { profileUpdate } from '../../utils/systemFunction';


export const ModalEditProfile = (props: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {

  const { show, setShow } = props;
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [picture, setPicture] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  const handleClose = () => setShow(false);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>, cb: React.Dispatch<React.SetStateAction<string>>) => {
    cb(ev.target.value)
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newUs: User = {
      ...user, profile: {
        age: age !== "" ? age : user.profile.age,
        categories: user.profile.categories,
        cities: user.profile.cities,
        description: description !== "" ? description : user.profile.description,
        gender: gender !== "" ? gender : user.profile.gender,
        hasNewMatch: user.profile.hasNewMatch,
        id: user.profile.id,
        likedProfile: user.profile.likedProfile,
        location: location !== "" ? location : user.profile.location,
        matched: user.profile.matched,
        picture: picture !== "" ? picture : user.profile.picture,
        receivedLike: user.profile.receivedLike,
        userId: user.id,
        swipes: user.profile.swipes,
        matches: user.profile.matches
      }
    }
    dispatch(profileUpdate(newUs))
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <div id="modal-background">
        <div id="edit-profile-modal-form">
          <Modal.Header>
            <Modal.Title id="edit-profile-title">Edit Your Profile</Modal.Title>
            <Modal.Body>
              <form id="edit-profile-input-list">
                <input className="edit-profile-input-field" name="picture" id="" placeholder="Picture" onChange={(e) => {
                  handleChange(e, setPicture)
                }}></input>
                <input className="edit-profile-input-field" name="description" id="" placeholder="Description" onChange={(e) => {
                  handleChange(e, setDescription)
                }}></input>
                <input className="edit-profile-input-field" name="age" id="" placeholder="Age" onChange={(e) => {
                  handleChange(e, setAge)
                }}></input>
                <input className="edit-profile-input-field" name="gender" id="" placeholder="Gender" onChange={(e) => {
                  handleChange(e, setGender)
                }}></input>
                <input className="edit-profile-input-field" name="location" id="" placeholder="Location" onChange={(e) => {
                  handleChange(e, setLocation)
                }}></input>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button id="edit-profile-submit-btn" variant="primary" onClick={(e) => {
                handleSubmit(e)
                handleClose()
              }}>
                Save Changes
                  </Button>
              <div id="close-edit-profile-modal" onClick={handleClose}>Close</div>
            </Modal.Footer>
          </Modal.Header>
        </div>
      </div>
    </Modal>
  )
}