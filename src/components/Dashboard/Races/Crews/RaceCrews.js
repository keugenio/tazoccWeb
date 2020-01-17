import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Col, Button, Modal, Row, FormControl, InputGroup} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbCrews } from '../../../Firebase';
import moment from 'moment';
import { updateCrew, addCrew, deleteCrew } from '../../../../store/store';
import uuid from 'uuid';
import Swal from 'sweetalert2';
import "babel-polyfill";

function mapStateToProps({crews, user, paddlers}) {
  return { crews, user, paddlers };
}

const RaceCrews = (props)=> {
  const [showModal, setShowModal] = useState(false);
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [crewID, setCrewID] = useState('');
  const [crewPaddlers, setCrewPaddlers] = useState([]);
  const [sortedPaddlers, setSortedPaddlers] = useState([]);

  const ageIsCorrectDivision = (age, crewID) => {
    const currCrew = props.crews.find(crew=>crew.crewID == crewID)
    switch(currCrew.division){
      case "Open Men":
          return (age>=18)
      case "Masters Men":
          return (age>=40)
      case "Sr Masters Men":
        return (age>=50) 
      case "Golden Masters Men":
        return (age>=60)
      case "Open Women":
          return (age>=18)
      case "Masters Women":
          return (age>=40)
      case "Sr Masters Women":
        return (age>=50) 
      case "Golden Masters Women":
        return (age>=60)  
      case "Keiki":
        return (age<18)                          
      default:
        return false
    }
  }
  const sexIsCorrectDivision = (sex, crewID) => {
    const currCrew = props.crews.find(crew=>crew.crewID == crewID)
    switch(currCrew.division){
      case "Open Men":
      case "Masters Men":
      case "Sr Masters Men":
      case "Golden Masters Men":
        return (sex=="male" || sex=="kane")
      case "Open Women":
      case "Masters Women":
      case "Sr Masters Women":
      case "Golden Masters Women":  
      case "Keiki":
        return (sex=="female" || sex=="wahine")                          
      default:
        return false
    }
  }

  const setFields = (crewID, paddlers) => {
    setShowModal(true);
    setCrewID(crewID);
    setCrewPaddlers(paddlers)
    const fp = [];
    props.paddlers.map((paddler)=>{
      if (
        !paddlers.some(p=>p.paddlerID == paddler.uid) && 
        ageIsCorrectDivision(moment().diff(moment(paddler.birthday), "years"), crewID) && 
        sexIsCorrectDivision(paddler.sex, crewID) )
        fp.push(paddler)
    })
    const sorted = fp.sort((a,b)=>(a.name.toUpperCase() < b.name.toUpperCase() ) ? -1: 1);
    setSortedPaddlers([...sorted])
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
  const addNewCrew = async (e) => {
    setShowAddCrewModal(false)
    const newCrew = {crewID:uuid(), race:{raceID:props.raceID, raceName:props.raceName}, paddlers:[], division:e.target.value}

    //create a new crew on firebase
    await dbCrews.doc(newCrew.crewID).set(newCrew)
    // update store
    props.dispatch(addCrew(newCrew))
  }
  const removeCrew = async (crewID) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        // delete from firestore
         dbCrews.doc(crewID).delete()
        .then(()=>{
          props.dispatch(deleteCrew(crewID))
        })
        .then(()=>{
          Swal.fire(
            'Deleted!',
            'crew has been deleted.',
            'success'
          )           
        })
        .catch((error)=>{
          Swal.fire(
            'Error!',
            error,
            'error'
          )                    
        })
      }

    })    
    
  }

  // const sortedPaddlers = props.paddlers.sort((a,b)=>(a.name.toUpperCase() < b.name.toUpperCase() ) ? -1: 1);
  return (
    <div>
      <Row className="d-flex justify-content-end">
        <Button className="border-0 bg-transparent text-warning" onClick={()=>setShowAddCrewModal(true)}><FontAwesomeIcon icon="plus-circle" className="fa-3x"/></Button>
      </Row>
      <Row>
        {props.crews.map((raceCrew, i)=>(
          <Col key={i} lg={3} sm={12} className="border border-success py-4">
            <Card>
              <Card.Title className="d-flex justify-content-start bg-info text-white">
                <span>{raceCrew.division}</span>
                {props.user.role=="superAdmin" && (<div className="ml-auto d-flex">
                  <Button className="bg-transparent text-danger" onClick={()=>{removeCrew(raceCrew.crewID)}}><FontAwesomeIcon icon="minus-circle" className="fa fa-2x" /></Button>
                  <Button className="bg-transparent text-muted"  onClick={()=>{setFields(raceCrew.crewID, raceCrew.paddlers)}}><FontAwesomeIcon icon="edit" className="fa fa-2x" /></Button>
                </div>)}
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
      </Row>
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
      <Modal show={showAddCrewModal} onHide={()=>{setShowAddCrewModal(false);setCrewID('')}} animation={false} size={'lg'} centered  className="addPaddlerToCrewModal">
        <Modal.Header className="bg-info" closeButton>
          <Modal.Title>Select Division</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl as="select" onChange={addNewCrew} value={-1}>
            <option value={-1} disabled >select division</option>
            <option value={"Novice Men"} >Novice Men</option>
            <option value={"Novice Women"} >Novice Women</option> 
            <option value={"Novice Coed"} >Novice Coed</option>            
            <option value={"Short Course Men"} >Short Course Men</option>
            <option value={"Short Course Women"} >Short Course Women</option>
            <option value={"Open Men"} >Open Men</option>
            <option value={"Masters Men"} >Masters Men</option>
            <option value={"Sr Masters Men"} >Sr Masters Men</option>
            <option value={"Golden Masters Men"} >Golden Masters Men</option>
            <option value={"Open Women"} >Open Women</option>
            <option value={"Masters Women"} >Masters Women</option>
            <option value={"Sr Masters Women"} >Sr Masters Women</option>
            <option value={"Golden Masters Women"} >Golden Masters Women</option>            
            <option value={"Open Coed"} >Open Coed</option>
            <option value={"Masters Coed"} >Masters Coed</option>
            <option value={"Sr Masters Coed"} >Sr Masters Coed</option>
            <option value={"Golden Masters Coed"} >Golden Masters Coed</option>
            <option value={"Keiki"} >Keiki</option>
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{()=>{setShowAddCrewModal(false);setCrewID('')}}} className="btn-lg">
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