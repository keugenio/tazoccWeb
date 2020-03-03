import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRacesToPaddlers, dbAllPaddlers } from '../../Firebase';
import { Button, Modal } from 'react-bootstrap';
import { addPaddlerToRace, clearPaddlersToRace } from '../../../store/store';
import moment from 'moment';

function mapStateToProps({paddlers, paddlersForCurrentRace}) {
  return {
    paddlers, paddlersForCurrentRace
  };
}

class WhosAttending extends Component {
  constructor(props) {
    super(props)
    this.state={
      paddlers:[],
      showModal:false
    }
  }
  showAttendees = async () => {
    this.setState({showModal:true});
    await dbRacesToPaddlers.where("raceID", "==", this.props.raceID)
      .get()
      .then((querySnapshot)=>{
        this.props.dispatch(clearPaddlersToRace());
        querySnapshot.forEach((race)=>{
          const raceToPaddlerInfo = race.data();
          if (raceToPaddlerInfo.enabled){
            const aRacer = this.props.paddlers.find(paddler=>paddler.paddlerID==raceToPaddlerInfo.paddlerID)
              if (aRacer){                
                const paddler = {raceToPaddlerID: race.id, paddlerID:aRacer.paddlerID, paddlerName:aRacer.paddlerName, timeTrial:raceToPaddlerInfo.timeTrial, age:moment().diff(moment(aRacer.birthday), 'years'), sex:aRacer.sex, novice:aRacer.novice}
                this.props.dispatch(addPaddlerToRace(paddler))                     
              }}
        })
    })
  }

  render() {
    return (
      <div className="ml-4">
        <Button onClick={()=>this.showAttendees()}> Attendees</Button>
        <Modal
          className="whosAttending"
          centered
          size="lg"
          show={this.state.showModal}
          onHide={() => {this.setState({showModal:false})}}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Who's Attending
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.paddlersForCurrentRace.map(paddler=>(
              <span className="comma">{paddler.paddlerName}</span>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(WhosAttending);