import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, CardDeck, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { dbRacesToPaddlers } from '../../components/Firebase';

function mapStateToProps({user, races, racesToPaddlers}) {
  return {
    user, races
  };
}

class AddRaceToPaddler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal:false
    }
  }

  handleCloseModal = () => {
    this.setState({showModal:false})
  }

  addRaceToPaddler = (id) => {
    const {userID} = this.props.user
    dbRacesToPaddlers.where("paddlerID", "==", userID).where("raceID", "==", id)
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.docs.length==0)
        dbRacesToPaddlers.add({
          paddlerID:userID,
          raceID:id
        })
      else
        console.log('dupe');
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    // refresh the available race list
  }
  render() {
    const {races} = this.props;

    return (
      <div className="addRaceToPaddler">
      <Button variant="primary" onClick={()=>{this.setState({showModal:true})}} className="border-primary">
        <FontAwesomeIcon icon="plus-circle" className="fa-4x text-warning bg-primary"/>
      </Button>
        <Modal show={this.state.showModal} onHide={this.handleCloseModal} animation={false} className="addRaceToPaddler">
          <Modal.Header closeButton>
            <Modal.Title>Add a Race to your profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <CardDeck>
                {races.map(race=>(
                  <Card key={race.id} className="raceCard">
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
                          <Button variant="success" className="w-100" onClick={()=>{this.addRaceToPaddler(race.id)}}>
                            <FontAwesomeIcon icon="plus" className="fa-3x text-white"/>
                          </Button>
                        </div>
                    </Card.Body>
                  </Card>        
                ))}
              </CardDeck>       
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSaveNewRace} className="btn-lg">
              Save Changes
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