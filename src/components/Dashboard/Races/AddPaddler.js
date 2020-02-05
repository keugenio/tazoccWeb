import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, InputGroup, Col, Row} from 'react-bootstrap'
import { dbRacesToPaddlers } from '../../Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addPaddlerToRace, updateRace } from '../../../store/store';
import AddNoLoginPaddlerForm from './AddNoLoginPaddlerForm';
import moment from 'moment';

function mapStateToProps({races, paddlers, paddlersForCurrentRace}) {
  return {
    races, paddlers, paddlersForCurrentRace
  };
}

class AddPaddler extends Component {
  constructor(props){
    super(props)
    this.state={
      showAddNewPaddlerModal:false,
      currentPaddler:{paddlerID:-1},
      showAddPaddlerButton:false
    }
  }
  addNewPaddler = () =>{
    this.setState({showAddNewPaddlerModal:true})
  }
  handleCloseModal = () => {
    this.setState({showAddNewPaddlerModal:false})
  }
  handleChange = (e) => {
    const paddler = this.props.paddlers.find(paddler=>paddler.paddlerID == e.target.value)
    this.setState({currentPaddler:paddler, showAddPaddlerButton:true})
  }
  addCurrentPaddler = () => {
    // check to see if the paddler already signed up (enabled==false)
    // if disabled, update firestore, update store. else add to firestore, update store
    
    dbRacesToPaddlers.where("paddlerID", "==", this.state.currentPaddler.paddlerID).where('raceID', "==", this.props.raceID).where("enabled", "==", false)
      .get()
      .then((docs)=>{
        if (docs.docs.length<=0)
          // add paddler to race
          dbRacesToPaddlers.add({paddlerID: this.state.currentPaddler.paddlerID, raceID: this.props.raceID, enabled:true})
           .then(doc=>{
            // update the store
              this.props.dispatch(addPaddlerToRace({raceToPaddlerID:doc.id, paddlerID:this.state.currentPaddler.paddlerID, paddlerName:this.state.currentPaddler.paddlerName, timeTrial:0, sex:this.state.currentPaddler.sex, age:moment().diff(moment(this.state.currentPaddler.birthday), 'years')}))            
              this.setState({showAddPaddlerButton:false, currentPaddler:{paddlerID:-1}})
           })
        else {
          dbRacesToPaddlers.doc(docs.docs[0].id).update({enabled:true})
          const docID = docs.docs[0].id;
          this.props.dispatch(addPaddlerToRace({raceToPaddlerID:docID, paddlerID:this.state.currentPaddler.paddlerID, paddlerName:this.state.currentPaddler.paddlerName, timeTrial:0, sex:this.state.currentPaddler.sex, age:moment().diff(moment(this.state.currentPaddler.birthday), 'years')}))            
          this.setState({showAddPaddlerButton:false, currentPaddler:{paddlerID:-1}})
        }
        const currRace = this.props.races.find(race=>race.raceID == this.props.raceID)
        this.props.dispatch(updateRace({...currRace, paddlerCount: currRace.paddlerCount+1}))
        // remove the add button
                 
      })
  }
  render() {
    const sortedPaddlers = this.props.paddlers.sort((a,b)=>a.paddlerName.toLowerCase()<b.paddlerName.toLowerCase()?1:-1);
    return (
      <Row className="d-flex row justify-content-end addPaddler">
        <Col>
          <Form.Group className="d-flex justify-content-end my-auto border border-success p-3 row w-100 mx-auto">
            <Col sm={12} className="d-flex justify-content-end addPaddlerLabel">
              <Form.Label className="my-auto">Add Paddler</Form.Label>
            </Col>
            <Col sm={12}>
              <InputGroup>          
                <Form.Control as="select" onChange={this.handleChange} value={this.state.currentPaddler.paddlerID}>
                  <option value={-1} disabled >select paddler</option>
                  { sortedPaddlers.map((paddler, i)=>{
                    if (!this.props.paddlersForCurrentRace.find(p=>p.paddlerID == paddler.paddlerID))
                      return (<option key={i} value={paddler.paddlerID}>{paddler.paddlerName}</option>)
                  })}          
                </Form.Control>
                <InputGroup.Append>
                  {this.state.showAddPaddlerButton && (<Button onClick={this.addCurrentPaddler}>
                    <FontAwesomeIcon icon="plus-circle" className="my-auto" />
                  </Button>)}
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="d-flex w-100 border border-success p-3 my-auto justify-content-center">
            <Button onClick={this.addNewPaddler} variant="warning" className="my-auto">
              Add New Paddler
            </Button>
          </Form.Group>
        </Col>
        <Modal centered show={this.state.showAddNewPaddlerModal} onHide={this.handleCloseModal} className="addRaceToPaddler float-right">
            <Modal.Header className="bg-success" closeButton>
              <Modal.Title style={{fontSize:'2rem'}}>New Paddler Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddNoLoginPaddlerForm raceID={this.props.raceID} handleCloseModal={this.handleCloseModal}/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
                Close
              </Button>
            </Modal.Footer>
        </Modal>
      </Row>
    );
  }
}

export default connect(
  mapStateToProps,
)(AddPaddler);