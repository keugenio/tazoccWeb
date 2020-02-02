import React from 'react';
import { connect } from 'react-redux';
import { Card, Spinner } from 'react-bootstrap';
import PaddlerBio from '../Dashboard/PaddlerBio';
import SCORA_INFO from '../Dashboard/SCORA_INFO';
import My_Races from '../Dashboard/My_Races';
import LoadingIcon from '../LoadingIcon';
import bgImage from '../../bgImages/bg_tribal.png';
class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pageReady:false
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { racesPaddlerSignedUpFor, races } = props
    const availableRaces=[];

    if (props.loggedIn) {  
      racesPaddlerSignedUpFor.forEach(signedUpRace =>{
        const raceInfo = races.find(race=>race.raceID==signedUpRace.raceID);
        const userRaceInfo = {...raceInfo, ...signedUpRace };
    
        availableRaces.push(userRaceInfo)
      })
      const { scoraSmartWaiver, scoraWaiver, huliDrill, scoraID, uid} = props.user
      return {...state, scoraSmartWaiver, scoraWaiver, huliDrill, scoraID, availableRaces, paddlerID:uid, pageReady:true}
    }
    else {
      return null}

  }

  render () {
    return (
      <div>
        {this.state.pageReady && this.props.loggedIn && <DashboardStats 
          availableRaces={this.props.racesPaddlerSignedUpFor} currentPage={this.props.path}/>}
        {this.state.pageReady && !this.props.loggedIn && <NotLoggedIn />}
      </div>
     )
  }
}

const DashboardStats = ({availableRaces, currentPage, pageReady}) => (
  <div className="dashboardContainer">
    <img src={bgImage} className="fullsize-bg-image"></img>
    <div className="dashboardStats">
      <Card className="dashboard bg-white-1">
        <Card.Body>
          <PaddlerBio />
          <My_Races availableRaces={availableRaces} currentPage={currentPage}/>                      
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