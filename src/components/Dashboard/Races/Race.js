import React from 'react';
import { dbRacesToPaddlers, dbCrews } from '../../Firebase';
import { connect } from 'react-redux';
import moment from 'moment';
import { addTimeTrial, clearTimeTrials, addCrewTimeTrial, clearCrewTimeTrials } from '../../../store/store';

import UserRaceInfo from './UserRaceInfo';
import AdminRaceInfo from './AdminRaceInfo';

class Race extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      attendance:[]
    }
  }
  
  static getDerivedStateFromProps(props, state) {
    const {attendance} = props.user
    let attendanceDates = []

    if ( attendance && attendance.length > 0 ) {
      attendance.forEach( practice => { 
        if (moment(practice).isBetween(moment(props.race.date).subtract(45, "days"), moment(props.race.date), "day", '[]')) {
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

  componentDidMount(){
    // get all timeTrials for this race and load into store
    dbRacesToPaddlers.where("raceID", "==", this.props.race.raceID).get()
    .then(querySnapShot=>{
      querySnapShot.forEach(docs=>{
        dbRacesToPaddlers.doc(docs.id).get()
          .then((doc)=>{
            const race=doc.data();
            if (race.enabled){
              this.props.dispatch(addTimeTrial({raceID:race.raceID, paddlerID:race.paddlerID, timeTrial:(race.timeTrial? race.timeTrial:0)}))
            }
          })
      })      
    })
    // get all crew time trials for this race and load into store
    dbCrews.where("race.raceID", "==", this.props.race.raceID).get()
    .then(querySnapShot=>{
      querySnapShot.forEach(docs=>{
        dbCrews.doc(docs.id).get()
          .then((doc)=>{
            const crew=doc.data();
            // only get crews where the current paddler is a part of
            if (crew.paddlers.some(paddler=>paddler.paddlerID == this.props.race.paddlerID)){
              crew.paddlers.forEach(paddler=>{
                this.props.dispatch(addCrewTimeTrial({
                  crewID:crew.crewID,
                  division:crew.division, 
                  raceID:crew.race.raceID, 
                  paddlerID:paddler.paddlerID, 
                  timeTrial:paddler.timeTrial}))
              })
            }
          })
      })      
    })    

  }
  componentWillUnmount(){
    this.props.dispatch(clearTimeTrials())
    this.props.dispatch(clearCrewTimeTrials())
  }
  render(){   
    const dashboardPage = this.props.currentPage  == '/dashboard';
    const adminPage = this.props.currentPage == '/admin';
    const {raceID, paddlerID} = this.props.race;                     

    return (
      <div>
        { dashboardPage &&  (<UserRaceInfo raceID={raceID} paddlerID={paddlerID} attendance={[...this.state.attendance]}/>)}
        { adminPage && (<AdminRaceInfo raceID={raceID} name={name} host={host} location={location} internalInfo={internalInfo} info={info} date={date} longCourseReq={longCourseReq} shortCourseReq={shortCourseReq} changeRequirement={changeRequirement} currentPage = {this.props.currentPage} attendance={[...this.state.attendance]} paddlerCount={paddlerCount}/>)}           
      </div>
    )
  }

}
const MapStateToProps = ({user}) =>({
  user
})

export default connect(MapStateToProps)(Race);