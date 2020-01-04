import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dbRaces, dbRacesToPaddlers } from '../../Firebase';
import { updateRace, removeRaceForPaddler, deleteRace } from '../../../store/store';
import Calendar from 'rc-year-calendar';
import events from '../../eventDescriptions';

class Race extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      raceID: props.raceID,
      name:props.name,
      host:props.host || '',
      location: props.location || '',
      info:props.info || '',
      date:props.date || 0,
      longCourseReq:props.longCourseReq || 0,
      shortCourseReq:props.shortCourseReq || 0,
      changeRequirement:props.changeRequirement || false,
      internalInfo:props.internalInfo || -1,
      showPaddlerReqs: (props.paddlerID == props.user.userID),
      showRaceReqs: (props.paddlerID != props.user.userID),
      showChangeReq: (props.changeRequirementForRace || false),
      showModal: false,
      showInternalInfoModal: false,
      attendance:[]
    }
  }
  
  static getDerivedStateFromProps(props, state) {
    const {attendance} = props.user
    let attendanceDates = []

    if ( attendance.length > 0 ) {
      attendance.forEach( practice => {
        if (moment(practice).toDate() >= moment(props.date).subtract(45,"days").toDate() &&
            moment(practice).toDate()< moment(props.date).toDate() ) {
              attendanceDates.push({
                startDate:moment(practice).toDate(),
                endDate:moment(practice).toDate(),
                color:'#FF8800'
              })
            }
      })
    }
    return {...state, attendance: attendanceDates }
  }

  toggleEdit = () => {
    const { name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, raceID } = this.props
    this.setState({ name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, raceID, editable:true });
  }
  toggleCancel = () => {
  // hide editable fields
  this.setState({editable:false})  
  }
  toggleSave = () => {    
    dbRaces.doc(this.state.raceID).set( {
      name:this.state.name,
      host:this.state.host,
      location: this.state.location,
      info:this.state.info,
      date:this.state.date,
      longCourseReq:this.state.longCourseReq,
      shortCourseReq:this.state.shortCourseReq,
      changeRequirement:this.state.changeRequirement,
      internalInfo:this.state.internalInfo
    })
    .then(() => { 
      this.setState({editable:false}) 
    })
    // udpate this race in the store to the new values
    const updatedRace = {id:this.state.raceID, name:this.state.name, date:this.state.date, location:this.state.location, host:this.state.host, longCourseReq: this.state.longCourseReq, shortCourseReq:this.state.shortCourseReq, changeReq:this.state.changeReq, info:this.state.info}
    this.props.dispatch(updateRace(updatedRace))

  }
  handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    
    this.setState({ [e.target.name]: e.target.value })
  }
  handleChangeCalendar = (date) => {
    this.setState({ date: date.valueOf() })
  }
  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked })
  }
  handleRemoveRace = () => {
    const {raceID, paddlerID} = this.props;
    
    // query firestore then delete from the array it returned and finally update state
    dbRacesToPaddlers.where("raceID", "==", raceID).where("paddlerID", "==", paddlerID)
    .get()
    .then(docs=>{      
      dbRacesToPaddlers.doc(docs.docs[0].id).update({enabled:false})
      this.props.dispatch(removeRaceForPaddler(raceID))
    })
    .catch(error=>{
      console.log('error in deletion:', error);
      
    })
  }
  handleDeleteRace = () => {
    const closeCard = this.toggleCancel
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      
      if (result.value) {
        //delete race from db and from store                
        this.props.dispatch(deleteRace(this.state.raceID))
        dbRaces.doc(this.state.raceID).delete();
        closeCard()
      }
    })
    .then(()=>{
      Swal.fire(
        'Deleted!',
        `${this.state.name} has been deleted`,
        'success'
      )

    })
    .catch(error=>{
      Swal.fire({
        icon: 'error',
        title: 'race not deleted',
        text: error,
      })
      
    })
  }
  handleShowModal = (modalName) => {
    if (modalName == 'practices')
      this.setState({showModal:true})
    else
      this.setState({showInternalInfoModal:true})
  }
  handleCloseModal = () => {
    this.setState({showModal:false, showInternalInfoModal:false})
  } 

  render(){    
    return (
      <div>
      { this.state.editable && (
        <Card border="warning" className="text-dark box-shadow-primary raceInfo">
          <Card.Title className="bg-warning text-dark d-flex justify-content-between">
            <div>
              Edit {this.state.name}
            </div>
            <div>
              {this.state.showRaceReqs && (<Button variant="danger" onClick={this.handleDeleteRace} className="mr-1"><FontAwesomeIcon icon="minus-circle"></FontAwesomeIcon></Button>)}
              {this.state.editable && (<Button onClick={this.toggleSave} className="btn-success mr-1" ><FontAwesomeIcon icon="save" /></Button>)}
              {this.state.editable && (<Button onClick={this.toggleCancel} className="btn-dark" >x</Button>)} 
            </div>
          </Card.Title>
          <Card.Body>
            <ul>
              <li>Name: <input type="text" value={this.state.name} name="name" placeholder="race name" onChange={this.handleChange}/></li>
              <li>Host: <input type="text" value={this.state.host} name="host" placeholder="race host" onChange={this.handleChange}/></li>
              <li>Location: <input type="text" value={this.state.location} name="location" placeholder="race location" onChange={this.handleChange}/></li>
              <li>Date:
                <DatePicker
                    value={(this.state.date > 0) || moment().valueOf()}
                    selected={this.state.date}
                    onChange={this.handleChangeCalendar}
                  />
              </li>
              <li>Long Course Req: <input type="text" name="longCourseReq" placeholder="long course requirement" value={this.state.longCourseReq} onChange={this.handleChange}/></li>
              {!this.state.changeRequirement && (<li>Short Course Req: <input type="text" name="shortCourseReq" placeholder="short course requirement" value={this.state.shortCourseReq} onChange={this.handleChange}/></li>)}
              <li>Change Req: <input type="checkbox" name="changeRequirement" placeholder="change requirement" defaultChecked={this.state.changeRequirement}  onChange={this.handleChangeChecked}/></li>
              <li>Race Desc: 
                <select name="internalInfo" onChange={this.handleChange} defaultValue={'none'}>
                  <option value={-1} >none</option>
                  { events.map((race, i)=> (
                      <option key={i} value={i}>{race.title}</option>
                  ))}
                </select></li>
              <li>More info:<textarea name="info" rows="3" value={this.state.info}  placeholder="add more info" onChange={this.handleChange}/></li>
            </ul>
          </Card.Body>
        </Card>
      )}
      {!this.state.editable && (
        <Card border="info" className="text-dark border-1 m-3 box-shadow-primary raceInfo bg-white-3">
          <Card.Title className="bg-info text-light d-flex justify-content-between">
            <span>{this.props.name}</span>
            {this.props.user.role && (this.props.user.role == "admin" || this.props.user.role== "superAdmin") && (<Button onClick={this.toggleEdit}><FontAwesomeIcon icon="edit"/></Button>)}
          </Card.Title>
          <Card.Body>
            <ul>
              <li><b className="mr-3" >Location:</b>  {this.props.location}</li>
              {(this.props.host) && (<li><b className="mr-3" >Host:</b>  {this.props.host}</li>)}
              {(this.props.date>0) && (<li><b className="mr-3" >Date:</b> {moment(this.props.date).format('dddd MMM D, YYYY')}</li>)}
              
              { /* if showing on the admin page, show the races requirements that need to be earned */ }              
              {this.state.showRaceReqs && this.props.longCourseReq>0 && (<li><b className="mr-3" >Long Course Req:</b>  {this.props.longCourseReq}</li>)}
              {!this.state.changeRequirement && this.state.showRaceReqs && this.props.shortCourseReq>0 && (<li><b className="mr-3" >Short Course Req:</b>  {this.props.shortCourseReq}</li>)}
              {this.state.showRaceReqs && (<li><b className="mr-3" >Change Req:</b> {this.state.changeRequirement ? ('yes'):('no')}</li>)}
              {this.state.showRaceReqs && this.state.internalInfo>=0 && (<li><b className="mr-3" >Race Desc:</b> <Button onClick={()=>{this.handleShowModal("internalInfo")}}>more</Button></li>)}

              { /* if showing on the dashboard, show the paddler's requirements that they have currently earned */}              
              {this.state.showPaddlerReqs && (<li><b className="mr-3" >Long Course Time:</b>  {this.props.longCourseReq}</li>)}
              {this.state.showPaddlerReqs && (<li><b className="mr-3" >Short Course Time:</b>  {this.props.shortCourseReq}</li>)}
              {this.state.showChangeReq && this.state.showPaddlerReqs && (<li><b className="mr-3" >Able to do a change?</b> {this.props.changeRequirement? ('yes'):('no')}</li>)}              
              {this.state.internalInfo && this.state.showPaddlerReqs && this.state.internalInfo >=0 && (<li><b className="mr-3">Race Desc:</b> <Button onClick={()=>{this.handleShowModal("internalInfo")}}>more</Button></li>)}
              {this.props.info!='' && (<li><b className="mr-3" >more info:</b>  {this.props.info}</li>)}         
              {this.state.showPaddlerReqs && 
                ( <li>
                    <Button variant="dark" onClick={()=>this.handleShowModal('practices')} className="text-white border-0">
                      {this.state.attendance.length} practices attended
                    </Button>
                  </li>
                )}
            </ul>
            {!this.state.showRaceReqs && (<div className="d-flex w-100">
              <Button variant="danger" className="mx-auto" onClick={this.handleRemoveRace}><FontAwesomeIcon icon="minus-circle" className="fa-2x"></FontAwesomeIcon></Button>
            </div>)}
          </Card.Body>
        </Card>         
      )}

      <Modal show={this.state.showModal} onHide={this.handleCloseModal} animation={false} size="lg" centered className="addRaceModal">
        <Modal.Header closeButton>
          <Modal.Title>Practices for Race Name {this.state.name} </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bigCalendar">
            <p>Race Date: {moment(this.state.date).format("MM-DD-YYYY")}</p>
            <p>{this.state.attendance.length} attended practices</p>
            
            <Calendar
              year = {moment(this.state.date).format('YYYY')}
              minDate = {moment(this.state.date).subtract(45, "days").toDate()}
              maxDate = {moment(this.state.date).toDate()}
              dataSource={this.state.attendance}
              style={'background'}
            />
            
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
            Close
          </Button>
        </Modal.Footer>
      </Modal>      
      {this.state.internalInfo>=0 && (<Modal show={this.state.showInternalInfoModal} onHide={this.handleCloseModal} animation={false} size="lg" centered className="addRaceModal">
          <Modal.Header closeButton />
          <Modal.Title className="pl-4"> {events[this.state.internalInfo].title}</Modal.Title>
          <Modal.Body>
            <Card>
              <Card.Img variant="top" src={events[this.state.internalInfo].img}></Card.Img>
              <Card.Body>
                <table style={tableStyle}>
                  <tbody>           
                    <tr>
                      <td><label style={labelStyle}>Description:</label></td>
                      <td>{events[this.state.internalInfo].description}</td>
                    </tr>
                    <tr>
                      <td><label style={labelStyle}>Date:</label></td>
                      <td>{events[this.state.internalInfo].date}</td>
                    </tr>
                      <tr>
                      <td><label style={labelStyle}>Location:</label></td>
                      <td>{events[this.state.internalInfo].location}</td>
                    </tr>
                    <tr>
                      <td><label style={labelStyle}>More:</label></td>
                      <td>{events[this.state.internalInfo].more}</td>
                    </tr>              
                  </tbody>
                </table>           
              </Card.Body>
            </Card>
          </Modal.Body>
             
      </Modal>)}
    </div>
    )
  }

}
const MapStateToProps = ({user}) =>({
  user
})
const labelStyle = {
  marginRight:'1rem',
  fontWeight:600
}
const buttonStyle = {
  maxWidth:'90%'
}
const tableStyle = {
  fontSize:'1.5rem'
}
export default connect(MapStateToProps)(Race);