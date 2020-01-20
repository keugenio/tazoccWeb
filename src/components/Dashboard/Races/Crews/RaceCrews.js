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
  const [availableDivisions, setAvailableDivisions] = useState([]);
  
  const ageIsCorrectDivision = (age, crewID) => {
    const currCrew = props.crews.find(crew=>crew.crewID == crewID)
    switch(currCrew.division){
      case "Open Men":
        return (age>=18);
        break;
      case "Masters Men":
        return (age>=40);
        break;
      case "Sr Masters Men":
        return (age>=50);
        break; 
      case "Golden Masters Men":
        return (age>=60);
        break;
      case "Open Women":
          return (age>=18);
          break;
      case "Masters Women":
          return (age>=40);
          break;
      case "Sr Masters Women":
        return (age>=50);
        break; 
      case "Golden Masters Women":
        return (age>=60);
        break;  
      case "Keiki":
        return (age<18);
        break;                          
      default: // everything else is coed so age doesn't matter
        return true
    }
  }
  const sexIsCorrectDivision = (sex, crewID) => {
    const currCrew = props.crews.find(crew=>crew.crewID == crewID)
    switch(currCrew.division){
      case "Novice Women":
      case "Open Women":
      case "Masters Women":
      case "Sr Masters Women":
      case "Golden Masters Women":  
      case "Keiki":
        return (sex=="female" || sex=="wahine");
        break;
      case "Open Men":
      case "Masters Men":
      case "Sr Masters Men":
      case "Golden Masters Men":
        return (sex=="male" || sex=="kane");
        break;                            
      default: // everything else is coed so sex doesn't matter
        return true
    }
  }

  const setFields = (crewID, paddlers) => {
    setShowModal(true);
    setCrewID(crewID);
    setCrewPaddlers(paddlers)
    const fp = [];
    props.paddlersForCurrentRace.map((paddler)=>{
      if (
        ageIsCorrectDivision(paddler.age, crewID) && 
        sexIsCorrectDivision(paddler.sex, crewID) ){ 
        fp.push(paddler)
      }
    })
    const sorted = fp.sort((a,b)=>(a.paddlerName.toUpperCase() < b.paddlerName.toUpperCase() ) ? -1: 1);
    setSortedPaddlers([...sorted])
  }
  const addPaddlerToCrew = (e) => {
    setShowModal(false)
    //const currPaddler = props.paddlers.find(paddler=>paddler.uid==e.target.value)
    const currPaddler = props.paddlersForCurrentRace.find(paddler=>paddler.paddlerID==e.target.value)
    // add user to firestore
    const updatedPaddlers = [...crewPaddlers.filter(paddler=>paddler.paddlerID!=e.target.value), {paddlerID:currPaddler.paddlerID, paddlerName:currPaddler.paddlerName, age:currPaddler.age, timeTrial:(currPaddler.timeTrial ? currPaddler.timeTrial : 0)}]
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
  const setAllAvailableDivisions = () => {
    const availableDivisions = [];
    const divisions = [
      {name:"Novice Men",sex:"male", lowerAge:18, upperAge:100, novice:true},{name:"Novice Women", sex:"female", lowerAge:18, upperAge:100, novice:true},{name:"Novice Coed", sex:"coed", lowerAge:18, upperAge:100, novice:true},
      {name:"Open Men", lowerAge: 18 , upperAge:100, sex:"male"},{name:"Masters Men", lowerAge:40 , upperAge:49, sex:"male"},{name:"Sr Masters Men", lowerAge: 50, upperAge:59, sex:"male"},{name:"Golden Masters Men", lowerAge: 60, upperAge:100, sex:"male"},
      {name:"Open Women", lowerAge: 18 , upperAge:100, sex:"female"},{name:"Masters Women", lowerAge:40 , upperAge:49, sex:"female"},{name:"Sr Masters Women", lowerAge: 50, upperAge:59, sex:"female"},{name:"Golden Masters Women", lowerAge: 60, upperAge:100, sex:"female"},
      {name:"Open Coed", lowerAge: 18 , upperAge:100, sex:"coed"},{name:"Masters Coed", lowerAge:40 , upperAge:49, sex:"coed"},{name:"Sr Masters Coed", lowerAge: 50, upperAge:59, sex:"coed"},{name:"Golden Masters Coed", lowerAge: 60, upperAge:100, sex:"coed"},
      {name:"keiki", sex:"coed", lowerAge:10, upperAge:17}]

    // for all divisions and for all avaialble paddlers, if age and race match division, set the available divisions
    props.paddlersForCurrentRace.map(paddler=>{
      divisions.map((division, i)=>{
        const currPaddler = props.paddlers.find(p=>p.uid==paddler.paddlerID)
        if ((paddler.age>=division.lowerAge && paddler.age<=division.upperAge && ((currPaddler.novice == division.novice) || currPaddler.novice))){
          // double check here for dupes
          if (!availableDivisions.some(d=>d.name==division.name)){
            if (paddler.sex == division.sex || division.sex=="coed"){
              availableDivisions.push({name:division.name, order:i })
            }
          }
        }
      })
    })
    //sort according novice, men, women coeds then keikis
    const orderedDivisions = availableDivisions.sort((a,b)=>a.order < b.order? -1:1);
    setAvailableDivisions([...orderedDivisions]);
    setShowAddCrewModal(true);
  }

  return (
    <div>
      <Row className="d-flex justify-content-end">
        <Button className="border-0 bg-transparent text-warning" onClick={()=>setAllAvailableDivisions()}><FontAwesomeIcon icon="plus-circle" className="fa-3x"/></Button>
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
              <option key={i} value={paddler.paddlerID}  style={{textTransform:'capitalize'}}>{`${paddler.paddlerName} | ${paddler.age}`}</option>
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
            { availableDivisions.map((division, i)=>(
              <option key={i} value={division.name}>{division.name}</option>
            )) }
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShowAddCrewModal(false);setCrewID('')}} className="btn-lg">
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