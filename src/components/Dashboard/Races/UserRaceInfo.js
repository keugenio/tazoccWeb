import React, {useState} from 'react';
import { connect } from 'react-redux';
import { Card , Table, Button, Modal} from 'react-bootstrap';
import moment from 'moment';
import events from '../../eventDescriptions';
import { dbRacesToPaddlers } from '../../Firebase';
import { removeRaceForPaddler } from '../../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import Calendar from 'rc-year-calendar';
import TimeTrials from './TimeTrials/TimeTrials';
import CrewTrials from './TimeTrials/CrewTrials';
import WhosAttending from './WhosAttending';

import "babel-polyfill";

function mapStateToProps({races, user, racesPaddlerSignedUpFor, paddlers}) {
  return {
    races, paddler:user, racesPaddlerSignedUpFor, paddlers
  };
}

const UserRaceInfo = (props) => {
  const { races, paddler, racesPaddlerSignedUpFor, attendance, raceID, paddlerID } = props
  const [showInternalInfoModal, setShowInternalInfoModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const race = races.find(race=>race.raceID == props.raceID);
  const internalInfo = race.internalInfo || -1;
  const currRace = racesPaddlerSignedUpFor.find(race=>race.raceID == props.raceID)
  const timeTrial =  currRace ? currRace.timeTrial : null;
  
  const openModal = (modalName) => {
    if (modalName == "internalInfo")
      setShowInternalInfoModal(true);
    else
      setShowAttendanceModal(true);
  }
  const closeModal =() =>{
    setShowInternalInfoModal(false);
    setShowAttendanceModal(false);
  }
  const handleRemoveRace = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are deleting this race from your profile!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        // query firestore then disable it and finally update state
        dbRacesToPaddlers.where("raceID", "==", raceID).where("paddlerID", "==", paddlerID)
        .get()
        .then(docs=>{      
          dbRacesToPaddlers.doc(docs.docs[0].id).update({enabled:false})
          props.dispatch(removeRaceForPaddler(raceID))
        })
        .then(()=>{
          Swal.fire(
            'Deleted!',
            'Your race has been deleted.',
            'success'
          )
        })
        .catch(error=>{
          console.log('error in deletion:', error);
        })
      }
    })
  }

  return (
    <div>
      <Card text="dark" >
        <Card.Title className="d-flex justify-content-between">
          <h2>{race.name} <span className="text-muted">{race.id}</span></h2>
          <Button onClick={handleRemoveRace} variant="danger">
            <FontAwesomeIcon icon="minus-circle"/>
          </Button>
        </Card.Title>
        <Card.Body>
          <Table>
            <tbody>
              <tr>
                <td>Race Location:</td>
                <td>{race.location}</td>
              </tr>
              <tr>
                <td>Host</td>
                <td>{race.host}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{moment(race.date).format("ddd MMM DD, YYYY")}</td>
              </tr>
              <tr>
                <td>Long Course Req</td>
                <td>{race.longCourseReq}</td>
              </tr>
              <tr>
                <td>Short Course Req</td>
                <td>{race.shortCourseReq}</td>                
              </tr>
              <tr>
                <td className="text-danger font-weight-bold">Time Trial</td>
                <td className="text-danger font-weight-bold"> {timeTrial ? `${timeTrial} m` : 'no trial yet'}</td>
              </tr>
              <tr>
                <td>Ranking for Race</td>
                <td> <TimeTrials paddler={{...props.paddler, timeTrial}} raceID={props.raceID}/></td>
              </tr>
              <tr>
                <td>Crew Rank</td>
                <td><CrewTrials paddler={{...props.paddler, timeTrial}} raceID={props.raceID}/></td>
              </tr>                          

              <tr>
                <td>Change Req</td>
                <td>{race.changeRequirement ? ('yes'):('no')}</td>
                <td className="text-danger">{paddler.changeReq}</td>
              </tr>
              {(internalInfo>=0) && (<tr>
                <td>Race Description</td>
                <td><Button onClick={()=>{openModal('internalInfo')}} >More</Button></td>
              </tr>)}  
              <tr>
                <td>more info</td>
                <td>{race.info}</td>
              </tr>
              <tr>
                <td className="d-flex">
                  <Button variant="dark" onClick={()=>openModal('practices')} className="text-white border-0">
                    {attendance.length} practices attended
                  </Button>
                  <WhosAttending raceID={race.raceID} />
                </td>
              </tr>

            </tbody>           
          </Table>
        </Card.Body>
      </Card>
      {(internalInfo >= 0) && (<Modal show={showInternalInfoModal} onHide={closeModal} animation={false} size="lg" centered  className="moreRaceInfo">
        <Modal.Header closeButton />
        <Modal.Title className="pl-4"> {events[internalInfo].title}</Modal.Title>
        <Modal.Body>
          <Card>
            <Card.Img variant="top" src={events[internalInfo].img}></Card.Img>
            <Card.Body>
              <table className="moreRaceInfo">
                <tbody>           
                  <tr>
                    <td><label>Description:</label></td>
                    <td>{events[internalInfo].description}</td>
                  </tr>
                  <tr>
                    <td><label>Date:</label></td>
                    <td>{events[internalInfo].date}</td>
                  </tr>
                    <tr>
                    <td><label>Location:</label></td>
                    <td>{events[internalInfo].location}</td>
                  </tr>
                  <tr>
                    <td><label>More:</label></td>
                    <td>{events[internalInfo].more}</td>
                  </tr>              
                </tbody>
              </table>           
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>)} 

      <Modal show={showAttendanceModal} onHide={closeModal} animation={false} size="lg" centered  className="bigCalendar">
        <Modal.Header closeButton>
          <Modal.Title>Practices for Race Name {race.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Race Date: {moment(race.date).format("MM-DD-YYYY")}</p>
              <p>{attendance.length} attended practices</p>
            
            <Calendar
              year = {moment(race.date).format('YYYY')}
              minDate = {moment(race.date).subtract(45, "days").toDate()}
              maxDate = {moment(race.date).toDate()}
              dataSource={props.attendance}
              style={'background'}
            />
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} className="btn-lg">
            Close
          </Button>
        </Modal.Footer>
      </Modal>           
    </div>
  );

}

export default connect(
  mapStateToProps,
)(UserRaceInfo);