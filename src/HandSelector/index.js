import React from 'react'
import './index.css'
import { TSelectableItemProps, createSelectable } from 'react-selectable-fast'

class HandSelector extends React.Component<TSelectableItemProps> {
  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      fontStyle: ''
    }
    this.handleClick = this.handleClick.bind(this)
  }

  // handle button clicks
  handleClick() {
    // update own state
    this.setState(prevState => {
      return {
        selected: !prevState.selected,
        fontStyle: !this.state.selected ? 'bold' : ''
      }
    })
  }

  /* TESTING */
  test() {
    console.log(this.state.selected)
  }

  // rendering 
  render() {
    const { selectableRef, isSelected, isSelecting } = this.props
    return (
      <div
        ref={selectableRef}
        id='hand-selector' 
        style={{fontWeight: this.state.fontStyle}} 
        // draggable='true'
        onClick={e => {
          this.handleClick();
          this.test();
          // this.props.updateParent(); 
          e.preventDefault(); 
        }}
        onDragOver={() => {
          this.handleClick();
          this.props.isSelecting();
        }}
        >
          {this.props.hand}
      </div>
    )
  }
}

export default createSelectable(HandSelector)