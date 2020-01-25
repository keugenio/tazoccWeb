import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { setSelectedPaddler, editSelectedPaddler } from '../../store/store';

class Search extends React.Component {
  componentDidMount() {
    this.props.dispatch(editSelectedPaddler(true))
  }
  setPaddler = (e) => {
    const selectedPaddler = this.props.paddlers.find(paddler => paddler.paddlerID === e.target.value)
    this.props.dispatch(setSelectedPaddler(selectedPaddler))
  }

  render(){
      return (
        <Form.Group>
          <Form.Control as="select" size="lg" value="0" onChange={this.setPaddler} style={formStyle} disabled={!this.props.selectedPaddlerEditable}>
            <option disabled value='0' >-- select Paddler --</option>
            { this.props.paddlers.map((paddler, i)=>(
                <option key={i} value={paddler.paddlerID}>{paddler.paddlerName}</option>
              ))
            }
          </Form.Control>
        </Form.Group>
  )}
}
const MapStateToProps = ({paddlers, selectedPaddlerEditable}) =>({
  paddlers:paddlers.sort((a,b)=>(a.paddlerName.toLowerCase()<b.paddlerName.toLowerCase()?-1:1)),selectedPaddlerEditable
})

const formStyle = {
  fontSize: '1.5rem'
}
export default connect(MapStateToProps)(Search)

