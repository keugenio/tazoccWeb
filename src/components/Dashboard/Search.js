import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setSelectedPaddler } from '../../store/store';

const Search = (props) => {
  const setPaddler = (e) => {
    console.log(e.target.value);
  }

  return (
    <select onChange={setPaddler}>
    { props.paddlers.map((paddler)=>(
        <option key={paddler.uid} value={paddler.uid}>{paddler.name}</option>
      ))
    }
    </select>
  )
}
const MapStateToProps = ({paddlers}) =>({
  paddlers
})

export default connect(MapStateToProps)(Search)
