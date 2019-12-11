import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { setSelectedPaddler } from '../../store/store';
import "babel-polyfill";

const Search = (props) => {
   const setPaddler = (e) => {
     const selectedPaddler = props.paddlers.find(paddler => paddler.uid === e.target.value)
    props.dispatch(setSelectedPaddler(selectedPaddler))
  }

  return (
        <Form.Group controlId="exampleForm.ControlSelect2" >
          <Form.Control as="select" multiple size="lg" onChange={setPaddler} style={formStyle}>
            <option disabled value='0'>-- select Paddler --</option>
            { props.paddlers.map((paddler, i)=>(
                <option key={i} value={paddler.uid}>{paddler.name}</option>
              ))
            }
          </Form.Control>
        </Form.Group>
  )
}
const MapStateToProps = ({paddlers}) =>({
  paddlers
})

export default connect(MapStateToProps)(Search)

const formStyle = {
  fontSize: '1.5rem'
}