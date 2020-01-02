import React from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, CardDeck, Form } from 'react-bootstrap';
import firebase, { dbRaces, dbRacesToPaddlers, dB } from '../../components/Firebase';
import { addRace} from '../../store/store';
import AddRaceToPaddler from './AddRaceToPaddler';
import Race from './Races/Race';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scoraID:'',
      availableRaces:[],
      scoraWaiver:false,
      scoraSmartWaiver:false,
      huliDrill:false
    }
  }
  getRacesAndUpdateStore = () => {
     dbRaces.get().then(docs=>{
      docs.docs.forEach(doc => {
        // the id and the actual data are in different brances so get those and add to a new object
        // then add that new race object to the store individally.
        const raceData = doc.data();
        const newRaceData = {...raceData, id:doc.id}
        this.props.dispatch(addRace(newRaceData));
      });
    })    
  }

  static getDerivedStateFromProps(props, state) {
    const { racesPaddlerSignedUpFor, races } = props
    const availableRaces=[];
    if (props.loggedIn) {  
      racesPaddlerSignedUpFor.forEach(signedUpRace =>{
        const { changeRequirement, longCourseReq, shortCourseReq, raceID, paddlerID, changeRequirementForRace } = signedUpRace
        const raceInfo = races.find(race=>race.id==raceID);
        const {name, date, host, info, internalInfo, location} = raceInfo;
        const userRaceInfo = {name, date, host, info, internalInfo, location, changeRequirement, changeRequirementForRace, longCourseReq, shortCourseReq, raceID, paddlerID };;
    
        availableRaces.push(userRaceInfo)
      })
      const { scoraSmartWaiver, scoraWaiver, huliDrill, scoraID } = props.user
      return {...state, scoraSmartWaiver, scoraWaiver, huliDrill, scoraID, availableRaces}
    }
    else 
      return null
  }

  componentDidMount() {
    //if no races in the store, load races from firestore into store
    if (this.props.races.length<=0){
      this.getRacesAndUpdateStore()
    }

  }

  render () {
    const {loggedIn, user} = this.props;
    const {userName} = user;

    if (loggedIn){   
      return (
        <React.Fragment>
          <div className="dashboardStats">
            <Card className="dashboard">
              <Card.Body>
                <Card bg="info" text="dark" style={{fontSize:'2rem'}} >
                  <Card.Header className="display-4">SCORA Info for {userName}</Card.Header>
                  <Card.Body>
                  <Row>
                    <Col lg={3} xs={12}><p>SCORA ID: {this.state.scoraID} </p>
                    </Col>
                    <Col lg={3} xs={12}>
                      <Form.Check
                        type='checkbox'
                        checked = {this.state.scoraWaiver || false}
                        disabled
                        className="form-check-input"
                        label= "SCORA Waiver"
                      /> 
                    </Col>
                    <Col lg={3} xs={12}>
                      <Form.Check
                        type='checkbox'
                        checked = {this.state.scoraSmartWaiver || false}
                        disabled
                        className="form-check-input"
                        label= "Smart Waiver"
                      />                   
                    </Col>
                    <Col lg={3} xs={12}>
                      <Form.Check
                        type='checkbox'
                        checked = {this.state.huliDrill || false}
                        disabled
                        className="form-check-input"
                        label="Huli Drill"
                      />                    
                    </Col>                  
                  </Row>
                  </Card.Body>
                </Card>

                <Card text="dark" style={{fontSize:'2rem'}} >
                    <Card.Title className="text-white bg-primary display-4 d-flex justify-content-between">My Races<AddRaceToPaddler /></Card.Title>
                    <Card.Body>
                      <CardDeck>
                      
                      { this.state.availableRaces.map((race)=>{
                        const { paddlerID, changeRequirement,changeRequirementForRace, date, host, info, internalInfo, location, longCourseReq, name, raceID, shortCourseReq } = race;
                        
                        return (
                          <Race 
                            key={raceID}
                            paddlerID={paddlerID}
                            changeRequirement={changeRequirement}
                            date={date}
                            host={host}
                            info={info}
                            internalInfo={internalInfo}
                            location={location}
                            longCourseReq={longCourseReq}
                            name={name}
                            raceID={raceID}
                            shortCourseReq={shortCourseReq}
                            changeRequirementForRace={changeRequirementForRace}/>
                        )
                    })}
                    
                      </CardDeck>
                    </Card.Body>
                </Card>              
              
              </Card.Body>
            </Card>
          </div>
        </React.Fragment>  
      )

    }  
    else 
        return (
          <React.Fragment>
          <Card className="dashboard">
            <Card.Title>Please Login to view this page</Card.Title>            
          </Card>)
        </React.Fragment>            
        )
  }
}

const MapStateToProps = ({user, races, racesPaddlerSignedUpFor})=>({
  loggedIn: (user.userID) ? true : false,
  user,
  racesPaddlerSignedUpFor,
  races
})
export default connect(MapStateToProps)(Dashboard)