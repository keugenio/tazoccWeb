import React from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row, CardDeck } from 'react-bootstrap';
import { dbRaces, dbRacesToPaddlers } from '../../components/Firebase';
import { addRace, addRaceToPaddler } from '../../store/store';
import AddRaceToPaddler from './AddRaceToPaddler';
import Race from './Races/Race';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: this.props.userID,
      userRaces:this.props.racesPaddlerSignedUpFor,
      availableRaces:[],
      races:this.props.races
    }
  }
  getRacesAndUpdateStore = () => {
     dbRaces.get().then(docs=>{
      docs.docs.forEach(doc => {
        // the id and the actually data are in different brances so get those and add to a new object
        // then add that new race object to the store individally.
        const raceData = doc.data();
        const newRaceData = {...raceData, id:doc.id}
        this.props.dispatch(addRace(newRaceData));
      });
    })    
  }
  addRacesToPaddler = (userID) => {
    if (userID)
      dbRacesToPaddlers.where("paddlerID", "==", userID)
      .then((querySnapshot)=>{
        querySnapshot.map((race)=>{
          this.props.dispatch(addRaceToPaddler(race.id))
        })
      })
  }
  async componentDidMount() {
    //if no races in the store, load races from firestore into store
    if (this.props.races.length<=0){
     this.getRacesAndUpdateStore()
    }
    
  }

  render () {
    const {loggedIn, userName, userID, races, racesPaddlerSignedUpFor} = this.props;
    
    const racesPaddlerSignedUpForInfo = [];
    races.forEach((race)=>{
      if (racesPaddlerSignedUpFor.includes(race.id))
      racesPaddlerSignedUpForInfo.push(race)
    })
    
    if (loggedIn){   
      
      return (
        <React.Fragment>
          <div className="dashboardStats">
            <Card className="dashboard">
              <Card.Title>Hello {userName}! {}</Card.Title>
              <Card.Body>

                <Card bg="info" text="dark" style={{fontSize:'2rem'}} >
                  <Card.Header className="display-4">SCORA Info for {userName}</Card.Header>
                  <Card.Body>
                  <Row>
                    <Col lg={3} xs={12}><p>SCORA ID: n/a</p>
                    </Col>
                    <Col lg={3} xs={12}><p>SCORA Waiver: no</p>
                    </Col>
                    <Col lg={3} xs={12}><p>Smart Waiver: no</p>
                    </Col>
                    <Col lg={3} xs={12}><p>huli drill: yes</p>
                    </Col>                  
                  </Row>
                  </Card.Body>
                </Card>

                <Card text="dark" style={{fontSize:'2rem'}} >
                    <Card.Title className="text-white bg-primary display-4 d-flex justify-content-between">My Races<AddRaceToPaddler /></Card.Title>
                    <Card.Body>
                      <CardDeck>
                        { racesPaddlerSignedUpForInfo.map((race,i)=>{
                            const {id, name, host, location, date, longCourseReq, shortCourseReq, changeRequirement, info} = race
                            return (
                              <Race key={i} id={id} name={name} host={host} location={location} info={info} date={date} longCourseReq={longCourseReq} shortCourseReq={shortCourseReq} changeRequirement={changeRequirement} />
                            )
                          })
                        }
                      </CardDeck>
                    </Card.Body>
                </Card>              
              
              </Card.Body>
            </Card>)
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
  loggedIn: user.userID || false,
  userName: user.userName || '',
  userID: user.userID || '',
  racesPaddlerSignedUpFor,
  races
})
export default connect(MapStateToProps)(Dashboard)