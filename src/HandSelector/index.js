import React from 'react'
import './index.css'
import { createSelectable } from 'react-selectable-fast'

let HandSelector = ({
  selectableRef, 
  isSelected, 
  isSelecting,
  hand,
}) => {

  return (
    <div
      ref={selectableRef}
      id='hand-selector' 
      style={isSelecting || isSelected ? styles.selected : null}
    >
      <span 
        style={{fontSize:'12.5px'}}
      >{hand}</span>
    </div>
  )
}

const styles = {
  selected: {
    // fontWeight:'bold',
    color: 'black',
    backgroundColor:'#a8e3b9',
  }
}

export default createSelectable(HandSelector)