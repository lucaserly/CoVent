import React, { FormEvent } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { addCategoryToProfile } from '../../utils/systemFunction';

const categories = [
  'Athletics',
  'Ball Sports',
  'Beach Sports',
  'Body & Mind',
  'Cars',
  'City',
  'Climbing',
  'Combat Sports',
  'Cycling',
  'Dancing',
  'Equestrianism',
  'Fitness',
  'For Fun',
  'Games',
  'Hiking',
  'Ice',
  'Motorcycles',
  'Multi-Sport',
  'Nature',
  'Party',
  'Photography',
  'Piloting',
  'Pool',
  'Racket Sports',
  'Rowing',
  'Shooting',
  'Sky',
  'Slacklining',
  'Snow',
  'Strength',
  'Traveling',
  'Underwater',
  'Water',
  'Wind'
]

export const Categories = (): JSX.Element => {
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch();

  const handleCategorySubmit = (ev: FormEvent): void => {
    const target = ev.target as HTMLInputElement
    if (user.profile.id) {
      const categoryToSend = {
        profileId: user.profile.id,
        name: target.value
      }
      dispatch(addCategoryToProfile(categoryToSend, user))
    }
  };

  return (
    <div id="sidebar-swipes">
      <div id="sidebar-swipes-title">Swipe by categories</div>
      <div id="sidebar-swipes-category-list">
        {categories.map((el, i) => {
          return <option onClick={(e) => { handleCategorySubmit(e) }}
            id="sidebar-swipe-element" key={i} value={el}>{el}
          </option>
        })
        }
      </div>
    </div>
  )
}