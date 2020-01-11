import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, Modal, Badge } from 'react-bootstrap';
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import { dbRaces, dbRacesToPaddlers } from '../../Firebase';
import events from '../../eventDescriptions';
import { deleteRace, updateRace } from '../../../store/store';
import Swal from 'sweetalert2';
import Calendar from 'rc-year-calendar';
import RaceDashBoard from './RaceDashBoard';

class AdminRaceInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      raceID: null,
      name: '',
      host: '',
      location: '',
      info: '',
      date: moment(),
      longCourseReq: '',
      shortCourseReq: '',
      changeRequirement: false,
      internalInfo: -1,      
      attendance: [],      
      showInternalInfoModal: false,
      showAttendanceModal: false,
      showRaceDashboardModal:false,
      paddlerCount:0
    }  
  }

  static getDerivedStateFromProps(props, state) {
    const raceInfo = props.races.find(race=>race.id==props.raceID)
    return{paddlerCount:raceInfo.paddlerCount}
  }
  toggleEdit = () => {
    const  { raceID, name, host, location, info, internalInfo, date, longCourseReq, shortCourseReq, changeRequirement } = this.props
    this.setState({...this.state, raceID, name:(name||''), host:(host||''), location:(location||''), info:(info||''), internalInfo:(internalInfo || -1), date, longCourseReq:(longCourseReq||''), shortCourseReq:(shortCourseReq||''), changeRequirement, editable:true})
  }  
  toggleCancel = () => {    
    const  { name, host, location, info, internalInfo, date, longCourseReq, shortCourseReq, changeRequirement, raceID } = this.props
    this.setState({...this.state, name, host, location, info, internalInfo, date, longCourseReq, shortCourseReq, changeRequirement, raceID, editable:false})
  }
  toggleSave = () => {
    const longCourseReq=this.state.longCourseReq || null;
    dbRaces.doc(this.state.raceID).update( {
      name:this.state.name,
      host:this.state.host,
      location: this.state.location,
      info:this.state.info,
      date:this.state.date,
      longCourseReq,
      shortCourseReq:this.state.shortCourseReq,
      changeRequirement:this.state.changeRequirement,
      internalInfo: this.state.internalInfo
    })
    .then(() => { 
      this.setState({editable:false}) 
    })
    .then(()=>{
      // udpate this race in the store to the new values
      const {raceID, name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, internalInfo} = this.state;
      //const updatedRace = {id:this.state.raceID, name:this.state.name, date:this.state.date, location:this.state.location, host:this.state.host, longCourseReq: this.state.longCourseReq, shortCourseReq:this.state.shortCourseReq, changeReq:this.state.changeReq, info:this.state.info}
      this.props.dispatch(updateRace({id:raceID, name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, internalInfo}))
    })
  }  
  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked })
  }
  handleChange = (e) => {    
    this.setState({[e.target.name]: e.target.value })   
  }  
  handleChangeCalendar = date => {
    this.setState({date:date.valueOf()});
  }   
  handleShowModal = (modalName) => {
    switch (modalName) {
      case 'attendance':
        this.setState({showAttendanceModal: true})
        break;
      case 'internalInfo':
        this.setState({showInternalInfoModal: true})
        break;
      case 'raceDashboard':
        this.setState({showRaceDashboardModal: true})        
      default:
        break;
    }
    this.setState({showModal:true})
  }
  handleCloseModal = () => {
    this.setState({showAttendanceModal:false, showInternalInfoModal:false, showRaceDashboardModal:false})
  }
  handleRemoveRace = () => {
    const {raceID} = this.state;

    Swal.fire({
      title: 'Are you sure?',
      text: "You are deleting this race and data from every paddler who signed up for it!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value){
        // disable race in firestore
        dbRaces.doc(raceID).update({
          enabled:false
        })
    
        // disable all records where paddlers have signedup for this race
        dbRacesToPaddlers.where("raceID", "==", raceID)
        .get()
        .then(docs=>{     
          docs.docs.forEach(doc=>{
            dbRacesToPaddlers.doc(doc.id).update({enabled:false})
          })       
          
        })
        .then(()=>{
            // delete the race from the store
            this.props.dispatch(deleteRace(raceID))
        })
        .catch(error=>{
          console.log('error in deletion:', error);
        })
      }
    })
  }

  render() {
    return (
      <div>
        { this.state.editable && (
          <Card border="warning" className="text-dark box-shadow-primary raceInfo">
            <Card.Title className="bg-warning text-dark d-flex justify-content-between">
              <div>
                Edit {this.state.name}
              </div>
              <div>
                <Button onClick={this.toggleSave} className="btn-success mr-1" ><FontAwesomeIcon icon="save" /></Button>
                <Button onClick={this.toggleCancel} className="btn-dark">X</Button> 
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
                <li>Long Course Req: <input type="text" name="longCourseReq" value={this.state.longCourseReq} onChange={this.handleChange}/></li>
                {!this.state.changeRequirement && (<li>Short Course Req: <input type="text" name="shortCourseReq" value={this.state.shortCourseReq} onChange={this.handleChange}/></li>)}
                <li>Change Req: <input type="checkbox" name="changeRequirement" defaultChecked={this.state.changeRequirement}  onChange={this.handleChangeChecked}/></li>
                <li>Race Desc: 
                  <select name="internalInfo" onChange={this.handleChange} defaultValue={this.state.internalInfo}>
                    <option value={-1} >none</option>
                    { events.map((race, i)=> (
                        <option key={i} value={i}>{race.title}</option>
                    ))}
                  </select>
                </li>
                <li>More info:<textarea name="info" rows="3" value={this.state.info}  placeholder="add more info" onChange={this.handleChange}/></li>
              </ul>
            </Card.Body>
          </Card>
        )}
        {!this.state.editable && (
          <Card border="info" className="text-dark border-1 m-3 box-shadow-primary raceInfo bg-white-3">
            <Card.Title className="bg-info text-dark d-flex justify-content-start ">
              <div className="mr-auto">{this.props.name}</div>
              <div>
                <Button className="bg-transparent border-0 text-danger" onClick={this.handleRemoveRace}><FontAwesomeIcon icon="minus-circle" className="fa-2x"></FontAwesomeIcon></Button>            
                <Button className="bg-transparent border-0 text-muted" onClick={this.toggleEdit}><FontAwesomeIcon icon="edit"  className="fa-2x"/></Button>
              </div>
            </Card.Title>
            <Card.Body>
              <div className="border border-success p-3">
                  <div><b>Location:</b>  {this.props.location}</div>
                  <div><b>Host:</b>  {this.props.host}</div>
                  <div><b>Date:</b> {moment(this.props.date).format('dddd MMM D, YYYY')}</div>         
                  {this.props.longCourseReq && (<div><b>Long Course Req: </b>{this.props.longCourseReq} </div>)}
                  {this.props.shortCourseReq &&(<div><b>Short Course Req:</b>{this.props.shortCourseReq}</div>)}
                  <div><b>Change Req:</b> {this.props.changeRequirement ? ('yes'):('no')}</div>
                  { this.props.internalInfo && this.props.internadivnfo>=0 && (<div><b>Race Desc:</b> <Button onClick={()=>{this.handleShowModal("internalInfo")}}>more</Button></div>)}
                  <div><b>More Info:</b>  {this.props.info}</div>
                  {this.props.attendance.length>0 && (<div><b className="mr-2">practice attendances:</b><Button onClick={()=>{this.handleShowModal("attendance")}}>show</Button></div>)}
              </div>
              <div className="d-flex p-3">
                <Button variant="success" onClick={()=>{this.handleShowModal("raceDashboard")}} className="mx-auto btnDashboard">
                Race Dashboard
                <Badge variant="warning" className="ml-3">{this.state.paddlerCount}</Badge>
                </Button>
              </div>
            </Card.Body>
          </Card>         
        )}    
        {this.props.internalInfo && this.props.internalInfo>=0 && (
          <Modal show={this.state.showInternalInfoModal} onHide={this.handleCloseModal} animation={false} size="lg" centered >
              <Modal.Header closeButton />
              <Modal.Title className="pl-4"> {events[this.props.internalInfo].title}</Modal.Title>
              <Modal.Body>
                <Card>
                  <Card.Img variant="top" src={events[this.props.internalInfo].img}></Card.Img>
                  <Card.Body>
                    <table style={tableStyle}>
                      <tbody>           
                        <tr>
                          <td><label style={labelStyle}>Description:</label></td>
                          <td>{events[this.props.internalInfo].description}</td>
                        </tr>
                        <tr>
                          <td><label style={labelStyle}>Date:</label></td>
                          <td>{events[this.props.internalInfo].date}</td>
                        </tr>
                          <tr>
                          <td><label style={labelStyle}>Location:</label></td>
                          <td>{events[this.props.internalInfo].location}</td>
                        </tr>
                        <tr>
                          <td><label style={labelStyle}>More:</label></td>
                          <td>{events[this.props.internalInfo].more}</td>
                        </tr>              
                      </tbody>
                    </table>           
                  </Card.Body>
                </Card>
              </Modal.Body>
                
          </Modal>
        )}          
        {this.props.attendance.length>0 && (
          <Modal show={this.state.showAttendanceModal} onHide={this.handleCloseModal} animation={false} size="lg" centered >
            <Modal.Header closeButton>
              <Modal.Title>Practices for Race Name {this.state.name} </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bigCalendar">
                <p>Race Date: {moment(this.props.date).format("MM-DD-YYYY")}</p>
                <p>{this.props.attendance.length} attended practices</p>
                
                <Calendar
                  year = {moment(this.props.date).format('YYYY')}
                  minDate = {moment(this.props.date).subtract(45, "days").toDate()}
                  maxDate = {moment(this.props.date).toDate()}
                  dataSource={this.props.attendance}
                  style={'background'}
                  value={moment(this.props.date).valueOf()}
                />
                
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
                Close
              </Button>
            </Modal.Footer>
          </Modal>          
        )}
        <Modal show={this.state.showRaceDashboardModal} onHide={this.handleCloseModal} animation={false} centered className="raceDashboard" >
          <Modal.Header className="bg-info" closeButton>
            <Modal.Title>Dashboard for {this.props.name} - {moment(this.props.date).format("MMMM DD, YYYY")} </Modal.Title>
          </Modal.Header>
          <Modal.Body className="">
            <RaceDashBoard raceID={this.props.raceID} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
const labelStyle = {
  marginRight:'1rem',
  fontWeight:600
}
const tableStyle = {
  fontSize:'1.5rem'
}
const MapStateToProps = ({ races }) => ({
  races
})
export default connect(MapStateToProps)(AdminRaceInfo);