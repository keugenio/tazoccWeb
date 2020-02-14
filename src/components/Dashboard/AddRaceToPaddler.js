import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, CardDeck, Card, Col, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { dbRacesToPaddlers } from '../../components/Firebase';
import { addRaceToPaddler,addTimeTrial } from '../../store/store'

function mapStateToProps({user, races, racesPaddlerSignedUpFor}) {
  return {
    user, races, racesPaddlerSignedUpFor
  };
}

class AddRaceToPaddler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal:false,
      availableRaces:null
    }
  }
  static getDerivedStateFromProps(props, state) {
    const {races, racesPaddlerSignedUpFor} = props;
    const availableRaces = [];
    races.forEach((race)=>{
      if (!racesPaddlerSignedUpFor.find(paddlerRace=>paddlerRace.raceID == race.raceID))
        availableRaces.push(race)
    })
    return {availableRaces:[...availableRaces]}
  }

  handleCloseModal = () => {
    this.setState({showModal:false})
  }

  addRaceToPaddler = (raceID) => {
    const {paddlerID} = this.props.user
    
    dbRacesToPaddlers.where("paddlerID", "==", paddlerID).where("raceID", "==", raceID)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.docs.length==0){
        const newRaceSignUp = {
          paddlerID:paddlerID,
          raceID:raceID,
          changeRequirement:false,
          enabled:true,
          timeTrial:0
        }
        dbRacesToPaddlers.add(newRaceSignUp)
      }
      else{
        dbRacesToPaddlers.doc(querySnapshot.docs[0].id)
        .update({
          enabled:true
        })  
        dbRacesToPaddlers.doc(querySnapshot.docs[0].id)
        .get()
        .then((doc)=>{
          const raceToPaddler = doc.data()
          this.props.dispatch(addTimeTrial({
            raceID: raceToPaddler.raceID,
            paddlerID: raceToPaddler.paddlerID,
            timeTrial:raceToPaddler.timeTrial
          }))
          
        })
      }      
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    this.props.dispatch(addRaceToPaddler({
      paddlerID:paddlerID,
      raceID:raceID,
      changeRequirement:false,
      enabled:true,
      timeTrial:0
    }))
    // check the amount of races left to add for user.  close the modal if no more races to add
    const availRaces = this.props.races.length - this.props.racesPaddlerSignedUpFor.length - 1
    if (availRaces == 0)
      this.setState({showModal:false})
  }
  render() {
    // parse all races so only available races to add are shown
    const {races, racesPaddlerSignedUpFor} = this.props;
    const availableRaces = [];
    races.forEach((race)=>{
      if (!racesPaddlerSignedUpFor.find(paddlerRace=>paddlerRace.raceID == race.raceID))
        availableRaces.push(race)
    })
   
    return (
      <div className="addRaceToPaddler">
      <Button variant="primary" onClick={()=>{this.setState({showModal:true})}} className="border-primary">
        <FontAwesomeIcon icon="plus-circle" className="fa-2x text-white bg-primary"/>
      </Button>
        <Modal centered show={this.state.showModal && (availableRaces.length>0)} onHide={this.handleCloseModal} className="addRaceToPaddler">
          <Modal.Header className="bg-primary" closeButton>
            <Modal.Title>Add a Race to your profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <CardDeck>
                {this.state.availableRaces.map((race, i)=>(
                  <Col lg={4} xs={12} key={i} >
                    <Card key={race.raceID} className="raceCard">
                      <Card.Body>
                        <Card.Title>{race.name}</Card.Title>
                        {race.host && race.location && (<Card.Subtitle className="mb-2 text-muted">hosted by: {race.host} , {race.location}</Card.Subtitle>)}
                          <ListGroup variant="flush">
                            {race.date && (<ListGroup.Item>{moment(race.date).format('ddd, MMM-DD-YYYY')}</ListGroup.Item>)}
                            {race.longCourseReq && (<ListGroup.Item>Long Course Req: {race.longCourseReq}</ListGroup.Item>)}
                            {race.shortCourseReq && (<ListGroup.Item>Short Course Req: {race.shortCourseReq}</ListGroup.Item>)}
                            {race.changeRequirement && (<ListGroup.Item>Change Requirement: Yes</ListGroup.Item>)}
                            {race.info && (<ListGroup.Item>More Info: {race.info}</ListGroup.Item>)}
                          </ListGroup>
                          <div className="d-flex justify-content-end w-75 mx-auto mt-3">
                            <Button variant="success" className="w-100" onClick={()=>{this.addRaceToPaddler(race.raceID)}}>
                              <FontAwesomeIcon icon="plus" className="fa-3x text-white"/>
                            </Button>
                          </div>
                      </Card.Body>
                    </Card>        
                  </Col>
                ))}
              </CardDeck>       
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
)(AddRaceToPaddler);