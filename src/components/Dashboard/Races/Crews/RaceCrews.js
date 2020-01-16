import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Col, Button, Modal, Form, FormControl} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbCrews } from '../../../Firebase';
import moment from 'moment';
import { updateCrew } from '../../../../store/store';

function mapStateToProps({crews, user, paddlers}) {
  return { crews, user, paddlers };
}

const RaceCrews = (props)=> {
  const [showModal, setShowModal] = useState(false);
  const [crewID, setCrewID] = useState('');
  const [crewPaddlers, setCrewPaddlers] = useState([]);

  const setFields = (crewID, paddlers) => {
    setShowModal(true);
    setCrewID(crewID);

    setCrewPaddlers(paddlers)
  }
  const addPaddlerToCrew = (e) => {
    setShowModal(false)
    const currPaddler = props.paddlers.find(paddler=>paddler.uid==e.target.value)
    // add user to firestore
    const updatedPaddlers = [...crewPaddlers.filter(paddler=>paddler.uid!=e.target.value), {paddlerID:currPaddler.uid, paddlerName:currPaddler.name, age:moment().diff(moment(currPaddler.birthday), 'years')}]
    dbCrews.doc(crewID).update({
      paddlers:[...updatedPaddlers]
    })

    // update store
    const currCrew = props.crews.find(crew=>crew.crewID==crewID)
    props.dispatch(updateCrew({...currCrew, paddlers:[...updatedPaddlers]}))
  }
  const removePaddlerFromCrew = (crewID, paddlerID) => {
    
    const currCrew = props.crews.find(crew=> crew.crewID == crewID)
    const filteredPaddlers = currCrew.paddlers.filter(paddler=> paddler.paddlerID!= paddlerID)
    //remove from firestore
    dbCrews.doc(crewID).update({
      paddlers:filteredPaddlers
    })
    //remove from store
    props.dispatch(updateCrew({...currCrew, paddlers:[...filteredPaddlers]}))
  }

  const sortedPaddlers = props.paddlers.sort((a,b)=>(a.name.toUpperCase() < b.name.toUpperCase() ) ? -1: 1);
  return (
    <div>
      {props.crews.map((raceCrew, i)=>(
        <Col key={i} lg={3} sm={12} className="border border-success py-4">
          <Card>
            <Card.Title className="d-flex justify-content-start bg-info text-white">
              <span>{raceCrew.division}</span>
              {props.user.role=="superAdmin" && (<Button variant="muted" className="ml-auto" onClick={()=>{setFields(raceCrew.crewID, raceCrew.paddlers)}}><FontAwesomeIcon icon="edit" /></Button>  )}
            </Card.Title>
            <Card.Body>
              <ListGroup>
              {raceCrew.paddlers.map((paddler, j)=>(
                <ListGroupItem key={j} style={{textTransform:'capitalize'}}>
                {`${paddler.paddlerName} | ${paddler.age}`}
                <Button className="bg-transparent border-0" onClick = {()=>removePaddlerFromCrew(raceCrew.crewID, paddler.paddlerID)}><FontAwesomeIcon icon="minus-circle" className="ml-2 text-danger"/></Button> 
                </ListGroupItem>
              ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      ))}
      <Modal show={showModal} onHide={()=>setShowModal(false)} animation={false} size={'lg'} centered  className="addPaddlerToCrewModal">
        <Modal.Header className="bg-info" closeButton>
          <Modal.Title>Add Paddler</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl as="select" onChange={(e)=>addPaddlerToCrew(e)} value={-1}>
            <option value={-1} disabled >select paddler</option>
            {sortedPaddlers.map((paddler, i)=>(
              <option key={i} value={paddler.uid}  style={{textTransform:'capitalize'}}>{`${paddler.name} | ${moment().diff(moment(paddler.birthday),"years")}`}</option>
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