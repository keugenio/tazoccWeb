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
      <div>adminbob</div>
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