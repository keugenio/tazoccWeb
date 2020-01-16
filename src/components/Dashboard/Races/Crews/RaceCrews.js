import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Col, Button, Modal, Form, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbCrews } from '../../../Firebase';

function mapStateToProps({crews, user, paddlers}) {
  return { crews, user, paddlers };
}

const RaceCrews = (props)=> {
  const [showModal, setShowModal] = useState(false);
  const [crewID, setCrewID] = useState('');
  const [division, setDivision] = useState('');
  const [crewPaddlers, setCrewPaddlers] = useState([]);
  const [race, setRace] =  useState({});

  const setFields = (crewID, paddlers, race, division) => {
    setShowModal(true);
    setCrewID(crewID);
    setRace(race);
    setDivision(division);
    setCrewPaddlers(paddlers)
  }
  const addPaddlerToCrew = (e) => {
    setShowModal(false)
    const currPaddler = props.paddlers.find(paddler=>paddler.uid==e.target.value)
    // add user to firestore
    dbCrews.doc(crewID).update({
      paddlers:[...crewPaddlers, {paddlerID:currPaddler.uid, paddlerName:currPaddler.name}]
    })
    
    // update store
  }

  return (
    <div>
      {props.crews.map((raceCrew, i)=>(
        <Col key={i} lg={3} sm={12} className="border border-success py-4">
          <Card>
            <Card.Title className="d-flex justify-content-start bg-info text-white">
              <span>{raceCrew.division}</span>
              {props.user.role=="superAdmin" && (<Button variant="muted" className="ml-auto" onClick={()=>{setFields(raceCrew.crewID, raceCrew.paddlers, raceCrew.race, raceCrew.division)}}><FontAwesomeIcon icon="edit" /></Button>  )}
            </Card.Title>
            <Card.Body>
              <ListGroup>
              {raceCrew.paddlers.map((paddler, j)=>(
                <ListGroupItem key={j}>{paddler.paddlerName}</ListGroupItem>
              ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      ))}
      <Modal show={showModal} onHide={()=>setShowModal(false)} animation={false} size={'lg'} centered  >
        <Modal.Header className="bg-info" closeButton>
          <Modal.Title>Add Paddler</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl as="select" onChange={(e)=>addPaddlerToCrew(e)} value={-1}>
            <option value={-1} disabled >select paddler</option>
            {props.paddlers.map((paddler, i)=>(
              <option key={i} value={paddler.uid}>{paddler.name}</option>
            ))}
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowModal(false)} className="btn-lg">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

}

export default connect(
  mapStateToProps,
)(RaceCrews);