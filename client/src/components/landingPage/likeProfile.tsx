import React, { ReactElement, useState, useEffect, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types/combinedStoreTypes';
import { addLike } from '../../utils/systemFunction';
import { Profile } from '../../types/user';
import { getAllProfiles } from '../../utils/userDatabaseFetch'; 

export const LikeProfile = ({city} : any): JSX.Element => {
    const currentUser = useSelector((state: RootState) => state.user)
    const currentDirection = useSelector((state: RootState) => state.direction)
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const dispatch = useDispatch();
    let usersList;

    useEffect(() => {
        getAllProfiles()
          .then((list) => {
            usersList = list.filter((el) => el.id !== currentUser.id) 
                setProfiles(usersList)
                    if (currentDirection.length && currentUser.profile && currentUser.profile.id) {
                        sendLikesToBackEnd(currentDirection, currentUser.profile.id)
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
          })
    }, [city]);

    const sendLikesToBackEnd = (currentDir: string[], profileId: number): void => {
        currentDir.forEach((el: string) => {
        if (String(el.match(/[^\s]+/)) === 'right') {
            const res: RegExpMatchArray | null = el.match(/\d+/g)
            res && dispatch(addLike({
            profileId: profileId,
            givenLikeId: +res
            }))
        }
        })
    }

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

    if (profiles[0] && profiles[0].cities) {
        usersList = profiles.filter(user => user.cities && user.cities.length
        && user.cities[0].name.toLowerCase().includes(city));
    }
    else if (profiles[0]) { 
        usersList = profiles; 
    }

    return (
        <div className="container">
            {
                usersList 
                    ? usersList.map((profile, i) => {
                        if (profile.user) {
                            const uppercaseInitial = profile.user.firstName?.charAt(0).toUpperCase() + profile.user.firstName?.slice(1);
                            return (
                                <div id="user-box">
                                    <div key={i} className="image_container">
                                        <img src={profile.picture} className="searchbar_image" alt="profile pic" />
                                        <div id="user-name">{uppercaseInitial}</div>
                                    </div>
                    
                                    <div id="lp-profile-description">
                                        <div id="user-description-text">{profile.description}</div>
                                        <button id="invitation-btn" onClick={(e) => { handleLike(e, Number(profile.id)) }}>Interested</button>
                                    </div>
                                </div>
                            )
                        }})
                    : null
            }
        </div>
    )
    // if (usersList) {
    //     return <div className="container"> {
    //         usersList.map((el, i) => {
    //             if (el.user && el) {
    //                 const uppercaseInitial = el.user.firstName?.charAt(0).toUpperCase() + el.user.firstName?.slice(1);
    //                 return (
    //                     <div id="user-box">
    //                         <div key={i} className="image_container">
    //                             <img src={el.picture} className="searchbar_image" alt="profile pic" />
    //                             <div id="user-name">{uppercaseInitial}</div>
    //                         </div>
            
    //                         <div id="lp-profile-description">
    //                             <div id="user-description-text">{el.description}</div>
    //                             <button id="invitation-btn" onClick={(e) => { handleLike(e, Number(el.id)) }}>Interested</button>
    //                         </div>
    //                     </div>
    //                 )
    //             } else { return <></> }
    //         })
    //     } </div>
    // }
    // else {
    //     return null;
    // }
}
