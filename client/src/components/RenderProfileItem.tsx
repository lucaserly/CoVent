import React from 'react'
import { useSelector } from 'react-redux'
import './RenderProfileItem.css'

export const RenderProfileItem = ({fake}: any) => {

  return (
    <>
      <div id="renderedProfileItem">Hello {fake}</div>
    </>
  )
}