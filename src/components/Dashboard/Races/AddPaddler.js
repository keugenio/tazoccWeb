import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, InputGroup} from 'react-bootstrap'
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
      currentPaddler:{uid:-1},
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
    const paddler = this.props.paddlers.find(paddler=>paddler.uid == e.target.value)
    this.setState({currentPaddler:paddler, showAddPaddlerButton:true})
  }
  addCurrentPaddler = () => {
    // check to see if the paddler already signed up (enabled==false)
    // if so, update firestore, update store.
    
    dbRacesToPaddlers.where("paddlerID", "==", this.state.currentPaddler.uid).where('raceID', "==", this.props.raceID).where("enabled", "==", false)
      .get()
      .then((docs)=>{
        if (docs.docs.length<=0)
          // add paddler to race
          dbRacesToPaddlers.add({paddlerID: this.state.currentPaddler.uid, raceID: this.props.raceID, enabled:true})
           .then(doc=>{
            // update the store
              this.props.dispatch(addPaddlerToRace({raceToPaddlerID:doc.id, paddlerID:this.state.currentPaddler.uid, paddlerName:this.state.currentPaddler.name, timeTrial:0, sex:this.state.currentPaddler.sex, age:moment().diff(moment(this.state.currentPaddler.birthday), 'years')}))            
           })
        else {
          dbRacesToPaddlers.doc(docs.docs[0].id).update({enabled:true})
          const docID = docs.docs[0].id
          this.props.dispatch(addPaddlerToRace({raceToPaddlerID:docID, paddlerID:this.state.currentPaddler.uid, paddlerName:this.state.currentPaddler.name, timeTrial:0, sex:this.state.currentPaddler.sex, age:moment().diff(moment(this.state.currentPaddler.birthday), 'years')}))            
        }
        const currRace = this.props.races.find(race=>race.id == this.props.raceID)
        this.props.dispatch(updateRace({...currRace, paddlerCount: currRace.paddlerCount++}))
        // remove the add button
        this.setState({showAddPaddlerButton:false, currentPaddler:{uid:-1}})         
      })
  }
  render() {
    const sortedPaddlers = this.props.paddlers.sort((a,b)=>a.name<b.name?1:-1);
    return (
      <div className="d-flex flex-row justify-content-end addPaddler">
        <Form.Group className="d-flex justify-content-end my-auto border border-success p-3">
          <Form.Label className="my-auto">Add Paddler</Form.Label>
          <InputGroup>          
              <Form.Control as="select" onChange={this.handleChange} className="ml-2" value={this.state.currentPaddler.uid}>
                <option value={-1} disabled >select paddler</option>
                { sortedPaddlers.map((paddler, i)=>{
                  if (!this.props.paddlersForCurrentRace.find(p=>p.paddlerID == paddler.uid))
                    return (<option key={i} value={paddler.uid}>{paddler.name}</option>)
                })}          
              </Form.Control>
              <InputGroup.Append>
                {this.state.showAddPaddlerButton && (<Button onClick={this.addCurrentPaddler}>
                  <FontAwesomeIcon icon="plus-circle" className="my-auto" />
                </Button>)}
              </InputGroup.Append>
            </InputGroup>
        </Form.Group>
        <Form.Group className="border border-success ml-2 p-3 my-auto">
          <Button onClick={this.addNewPaddler} variant="warning" className="my-auto">
            Add New Paddler
          </Button>
        </Form.Group>
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
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(AddPaddler);