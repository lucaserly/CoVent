import './SignUpForm.css'
import React, { FormEvent, useState } from 'react';
import { setUser } from "../../redux/userState/userActions"
import { useDispatch, useSelector } from "react-redux";
import { User, Credentials } from '../../types/user';
import { RootState } from '../../types/combinedStoreTypes';

interface SignUpFormProp {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    setShowDescriptionModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const SignUpForm = ({ setShowModal, setShowDescriptionModal }: SignUpFormProp): JSX.Element => {

    const dispatch = useDispatch();
    const [userCredentials, setUserCredentials] = useState<Credentials>({ email: '', password: '', firstName: '', lastName: '' });
    const currentUser = useSelector((state: RootState) => state.user)

    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = ev.target;
        setUserCredentials(prevState => ({ ...prevState, [name]: value }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const newUser: User = {
            ...currentUser,
            ...userCredentials
        }

        dispatch(setUser(newUser));
        setShowModal(false);
        setShowDescriptionModal(true);
    }

    return (
        <div id="modal-main">
            <form id="modal" onSubmit={handleSubmit}>
                <div id="welcome-title">Welcome to CoVent</div>
                <div id="welcome-subtitle">Please register to join our international community</div>

                <input
                    className="registration-input"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                >
                </input>

                <input
                    className="registration-input"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                >
                </input>

                <input
                    className="registration-input"
                    name="firstName"
                    placeholder="First name"
                    onChange={handleChange}
                >
                </input>

                <input
                    className="registration-input" id="registration-last-item"
                    name="lastName"
                    placeholder="Last name"
                    onChange={handleChange}
                >
                </input>

                <button id="submitSignUp">Submit</button>
                <div id="toggleToSignIn">Already have an account? <span>Sign in</span></div>
                <div id="close-modal" onClick={() => { setShowModal(false) }}>close</div>
            </form>
        </div>
    )
}

export default SignUpForm;

