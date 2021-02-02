import React, {useEffect} from 'react'
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
      {hand}
    </div>
  )
}

const styles = {
  selected: {
    fontWeight:'bold'
  }
}

export default createSelectable(HandSelector)