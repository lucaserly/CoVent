import './DescriptionForm.css'
import React from "react";
import { RootState } from '../../types/combinedStoreTypes'
import { FormEvent, useState } from 'react'
import { setUser } from "../../redux/userState/userActions";
import { useDispatch, useSelector } from "react-redux";
import { Profile, User } from "../../types/userTypes"
import { userSignUp } from '../../utils/systemFunction';

export const DescriptionForm = ({ setShowDescriptionModal }: any): JSX.Element => {
    const currentUser = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch();
    const [newUserDescription, setNewUserDescription] = useState<Profile>({ gender: '', age: '', location: '' });

    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = ev.target;
        setNewUserDescription(prevState => ({ ...prevState, [name]: value }));
    }

    function handleDescription(e: FormEvent) {
        e.preventDefault()
        const newUser: User = 
        {
            ...currentUser, 
            profile:
                { ...currentUser.profile, ...newUserDescription }
        }
        dispatch(userSignUp(newUser))
        dispatch(setUser(newUser));
        setShowDescriptionModal(false);
    }

    return (
        <div id="modal-main">
            <div>Please complete your profile information:</div>
            <form id="modal" onSubmit={handleDescription}>
                <input
                    name="gender"
                    id=""
                    placeholder="Gender"
                    onChange={handleChange}
                >
                </input>

                <input
                    name="age"
                    id=""
                    placeholder="Age"
                    onChange={handleChange}
                >
                </input>

                <input
                    name="location"
                    id=""
                    placeholder="Location"
                    onChange={handleChange}
                >
                </input>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default DescriptionForm;