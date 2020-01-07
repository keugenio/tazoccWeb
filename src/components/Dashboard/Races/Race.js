import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import { dbRaces, dbRacesToPaddlers } from '../../Firebase';
import { updateRace, removeRaceForPaddler, deleteRace } from '../../../store/store';
import Calendar from 'rc-year-calendar';

import UserRaceInfo from './UserRaceInfo';
import AdminRaceInfo from './AdminRaceInfo';

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

    if ( attendance && attendance.length > 0 ) {
      attendance.forEach( practice => { 
        if (moment(practice).isBetween(moment(props.date).subtract(45, "days"), moment(props.date), "day", '[]')) {
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

  render(){   
    const dashboardPage =  this.props.currentPage == '/dashboard';
    const adminPage = this.props.currentPage == '/admin';
    const {raceID, name, host, location, date, longCourseReq, shortCourseReq, changeRequirement, internalInfo, info} = this.props                       
    return (
      <div>

      { dashboardPage &&  (<UserRaceInfo raceID={this.props.raceID} paddlerID={this.props.user.uid} attendance={this.state.attendance}/>)}

      { adminPage && (<AdminRaceInfo raceID={raceID} name={name} host={host} location={location} internalInfo={internalInfo} info={info} date={date} longCourseReq={longCourseReq} shortCourseReq={shortCourseReq} changeRequirement={changeRequirement} currentPage = {this.props.currentPage} attendance={this.state.attendance}/>)}
      
           
    </div>
    )
  }

}
const MapStateToProps = ({user}) =>({
  user
})

export default connect(MapStateToProps)(Race);