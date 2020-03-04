import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import PaddlerBio from '../Dashboard/PaddlerBio';
import My_Races from '../Dashboard/My_Races';
import bgImage from '../../bgImages/bg_tribal.png';
import DatePicker from './Datepicker';
import moment from 'moment';
import { dbAttendance, dbAllPaddlers } from '../Firebase';
import { addPaddlerToAllPaddlers } from '../../store/store';
import Attendance from './Attendance';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daysThatHadPractices:[],
      pageReady:true
    }
  }

 async componentDidMount(){
    let daysThatHadPractices =
    await dbAttendance.get()
    .then((snapShot)=>{
      let practices=[];
      snapShot.docs.forEach(doc=>{
        practices.push(new Date(doc.id))
      })
      return practices
    })
    await dbAllPaddlers.get()
    .then(paddlers=>{
      paddlers.forEach(paddler=>{
        dbAllPaddlers.doc(paddler.id).get().then(doc=>{
          this.props.dispatch(addPaddlerToAllPaddlers(doc.data()))
        })
      })
      this.setState({loading:false})     
    })

    this.setState({daysThatHadPractices:[...daysThatHadPractices], pageReady:true});
  }

  render () {    
    return (
      <div>
        {this.state.pageReady && this.props.loggedIn && 
          <DashboardStats 
            availableRaces={this.props.racesPaddlerSignedUpFor}
            currentPage={this.props.path}
            daysThatHadPractices = {this.state.daysThatHadPractices}
          />}
        {this.state.pageReady && !this.props.loggedIn && <NotLoggedIn />}
      </div>
     )
  }
}

const DashboardStats = ({availableRaces, currentPage, daysThatHadPractices}) => (
  <div className="dashboardContainer">
    <img src={bgImage} className="fullsize-bg-image"></img>
    <div className="dashboardStats">
      <Card className="dashboard bg-white-1">
        <Card.Body>
          <PaddlerBio />
          <My_Races availableRaces={availableRaces} currentPage={currentPage}/>  
          <Attendance />
        </Card.Body>
      </Card>
    </div>
  </div>
)
const NotLoggedIn = () => (
  <React.Fragment>
    <Card className="dashboard">
      <Card.Title>Please Login to view this page</Card.Title>            
    </Card>
  </React.Fragment>  
)
const MapStateToProps = ({user, races, racesPaddlerSignedUpFor})=>({
  loggedIn: (user.paddlerID) ? true : false,
  user,
  racesPaddlerSignedUpFor,
  races
})
export default connect(MapStateToProps)(Dashboard)