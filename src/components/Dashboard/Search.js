import React, { useState } from 'react'
import { connect } from 'react-redux'

const Search = (props) => {
  const [paddler, setPaddler] = useState('')

  return (
    <select onChange={setPaddler(value)}>
      <option value="paddler1ID">paddler 1</option>
      <option value="paddler2ID">paddler 2</option>
      <option value="paddler3ID">paddler 3</option>
      <option value="paddler4ID">paddler 4</option>
    </select>
  )
}
const MapStateToProps = ({paddlers}) =>{
  paddlers
}

export default connect(MapStateToProps)(Search)
