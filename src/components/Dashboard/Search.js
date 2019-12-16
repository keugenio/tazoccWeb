import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { setSelectedPaddler, editSelectedPaddler } from '../../store/store';
import "babel-polyfill";

class Search extends React.Component {
  componentDidMount(props) {
    this.props.dispatch(editSelectedPaddler(true))
  }
  setPaddler = (e) => {
    const selectedPaddler = this.props.paddlers.find(paddler => paddler.uid === e.target.value)
    this.props.dispatch(setSelectedPaddler(selectedPaddler))
  }

  render(){
      return (
        <Form.Group>
          <Form.Control as="select" size="lg" onChange={this.setPaddler} style={formStyle} disabled={!this.props.selectedPaddlerEditable}>
            <option disabled value='0'>-- select Paddler --</option>
            { this.props.paddlers.map((paddler, i)=>(
                <option key={i} value={paddler.uid}>{paddler.name}</option>
              ))
            }
          </Form.Control>
        </Form.Group>
  )}
}
const MapStateToProps = ({paddlers, selectedPaddlerEditable}) =>({
  paddlers,selectedPaddlerEditable
})

export default connect(MapStateToProps)(Search)

const formStyle = {
  fontSize: '1.5rem'
}