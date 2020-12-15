import React, { ReactElement, useState, useEffect, FormEvent } from 'react';
import './searchbar.css'

export const Searchbar = ({city, setCity} : any): ReactElement => {


  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setCity(ev.target.value.toLowerCase());
  }

  return (
    <div>
      <div id="searchbar_area">
        <form>
          <input id="main-searchbar" type="text" placeholder="Browse all cities..." value={city} onChange={handleChange} />
        </form>
        <button id="search-btn">Go</button>
      </div>
    </div>
  )
};