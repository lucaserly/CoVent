import React, { ReactElement, useState, useEffect, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types/combinedStoreTypes';
import { addLike } from '../../utils/systemFunction';
import { ProfileNew } from '../../types/userLucasTypes';
import { getAllProfiles } from '../../utils/userDatabaseFetch'; 

export const LikeProfile = ({city} : any): any => {

    const currentUser = useSelector((state: RootState) => state.user)
    const [users, setUsers] = useState<ProfileNew[]>([]);
    const dispatch = useDispatch();
    let renderUserWithCities;
    let renderAllUsers;

    useEffect(() => {
        getAllProfiles()
          .then((list) => {
            const filteredList = list.filter((el) => {
              return el.id !== currentUser.id})
            setUsers(filteredList)
          })
      }, [city]);

    const handleLike = (e: FormEvent, id: number) => {
        e.preventDefault()
        if (currentUser.profile) {
            const like: any = {
            profileId: currentUser.profile.id,
            givenLikeId: id,
            }
            dispatch(addLike(like))
        }
    }

    if (users[0] && users[0].cities) {
        renderUserWithCities = (
        users.filter(user => user.cities && user.cities.length
            && user.cities[0].name.toLowerCase().includes(city)).map((el, i) => {
            if (el && el.id) {
                return (
                    <div key={i} className="image_container">
                        <img src={el.picture} className="searchbar_image" alt="profile pic" />
                        <div id="lp-profile-description">
                            <div id="user-description-text">{el.description}</div>
                            <button id="invitation-btn" onClick={(e) => { handleLike(e, Number(el.id)) }}>Interested</button>
                        </div>
                    </div> 
                )
            }
            })
        )
    }

    if (users[0]) {
        renderAllUsers = (
        users.map((el, i) => {
            if (el.user) {
            const temp = el.user.firstName?.charAt(0).toUpperCase() + el.user.firstName?.slice(1);

            return <div key={i} id="user-box">

                <div className="image_container">
                <img src={el.picture} className="searchbar_image" alt="profile pic" />
                <div id="user-name">{temp}</div>
                </div>

                <div id="lp-profile-description">
                <div id="user-description-text">{el.description}</div>
                <button id="invitation-btn" onClick={(e) => { handleLike(e, Number(el.id)) }}>Interested</button>
                </div>

            </div>

            }
        })
        )
    }
    return (
        <div className="container">
            {city ? renderUserWithCities : renderAllUsers }
        </div>
    )
}
