import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dbRaces, dbRacesToPaddlers } from '../../Firebase';
import { updateRace, removeRaceForPaddler, deleteRace } from '../../../store/store';

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
      showPaddlerReqs: (props.paddlerID == props.user.userID),
      showRaceReqs: (props.paddlerID != props.user.userID),
      showChangeReq: (props.changeRequirementForRace || false)
    }
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
    })
    .then(() => { 
      this.setState({editable:false}) 
    })
    // udpate this race in the store to the new values
    const updatedRace = {id:this.state.raceID, name:this.state.name, date:this.state.date, location:this.state.location, host:this.state.host, longCourseReq: this.state.longCourseReq, shortCourseReq:this.state.shortCourseReq, changeReq:this.state.changeReq, info:this.state.info}
    this.props.dispatch(updateRace(updatedRace))

  }
  handleChange = (e) => {
    
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
              <li>More info:<textarea name="info" rows="3" value={this.state.info}  placeholder="add more info" onChange={this.handleChange}/></li>
            </ul>
          </Card.Body>
        </Card>
      )}
      {!this.state.editable && (
        <Card border="info" className="text-dark border-1 m-3 box-shadow-primary raceInfo">
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

              { /* if showing on the dashboard, show the paddler's requirements that they have currently earned */}              
              {this.state.showPaddlerReqs && (<li><b className="mr-3" >Long Course Time:</b>  {this.props.longCourseReq}</li>)}
              {this.state.showPaddlerReqs && (<li><b className="mr-3" >Short Course Time:</b>  {this.props.shortCourseReq}</li>)}
              {this.state.showChangeReq && this.state.showPaddlerReqs && (<li><b className="mr-3" >Able to do a change?</b> {this.props.changeRequirement? ('yes'):('no')}</li>)}              

              {this.props.info!='' && (<li><b className="mr-3" >more info:</b>  {this.props.info}</li>)}         
            </ul>
            {!this.state.showRaceReqs && (<div className="d-flex w-100">
              <Button variant="danger" className="mx-auto" onClick={this.handleRemoveRace}><FontAwesomeIcon icon="minus-circle" className="fa-2x"></FontAwesomeIcon></Button>
            </div>)}
          </Card.Body>
        </Card>         
      )}
    </div>
    )
  }

}
const MapStateToProps = ({user}) =>({
  user
})
export default connect(MapStateToProps)(Race);