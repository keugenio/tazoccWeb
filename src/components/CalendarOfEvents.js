import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../gcal';
import Swal from 'sweetalert2';
import EventInformation from './EventInformation';
import ScoraRaces from '../data/scora_races';
import Calendar from './Calendar';
import {Tabs, Tab, Alert, Row, Col, Container} from 'react-bootstrap';
import bgImage from '../bgImages/bg_calendar.jpg';

const handleOnSelect = (event) => {
  const start = moment(event.start);
  const end = moment(event.end)
  let text = null
  if (end.diff(start, 'days') < 1){
    console.log(start, end, end.diff(start, 'days'));
    text = moment(event.start).format("LLLL") + ' to ' + moment(event.end).format("h:mm A")
  }
  else 
    text = moment(event.start).format("LL") + ' to ' + moment(event.end).format("LL")
  Swal.fire({
    title: event.title,
    text: text,
    confirmButtonText: 'OK'
  })
}

class TAZCalendar extends React.Component{
  constructor () {
    super()
    this.state = {
      events: [],
      ScoraRaces:[],
      displayWaitingIcon:{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'#01579b'},
      displayEvents:{'display':'none'},
    }   
  }
  componentDidMount () {
    getEvents((events) => {
      this.setState({ScoraRaces})
      this.setState({events})
      this.setState({displayWaitingIcon:{'display':'none'}})
      this.setState({displayEvents:{'display':'block'}})
    })
  }

  render(){
    return(
      <React.Fragment> 
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">Team Arizona Calendar of Events</p></div>
        <Container fluid={true} className="eventCalendar">
          <Row>
            <Col xl={6} xs={12} className="my-auto d-flex">
                
                  <Calendar />             
               
            </Col>
            <Col xl={6} xs={12} className="moreEventInfo">
              <div className="eventInfo">
                <Tabs defaultActiveKey="events" id="practiceTabInfo">
                  <Tab eventKey="scora" title="SCORA Races">
                    <Alert variant="success">
                      <hr></hr>
                      <div className="table-responsive scoraEvents">
                        <table className="table table-striped table-danger">
                          <thead>
                            <tr>
                              <td>Date</td>
                              <td>Race</td>
                              <td>Location</td>
                              <td>Host</td>                                          
                            </tr>
                          </thead>
                          <tbody>
                          { this.state.ScoraRaces.map((race, i) => (
                            <tr key={i}>
                              <td>{race.date}</td>
                              <td>{race.race}</td>
                              <td>{race.location}</td>
                              <td>{race.host}</td>                                           
                            </tr>
                            )
                          )}                  
                          </tbody>
                        </table>
                      </div>                 
                    </Alert>               
                  </Tab>
                  <Tab eventKey="events" title="Events">
                    <div className="p-4" style={containerStyle}>
                      <div className="mt-4 containerTitle"><p className="text-dark">typical events and races we do throughout the year</p></div>
                      <div className="events" style={cardDeckStyle}>
                        <EventInformation/>
                      </div>
                    </div>            
                  </Tab>     
                </Tabs> 
              </div>     
            </Col>
          </Row>          
        </Container>
      </React.Fragment>
    )
  }
}

export default TAZCalendar

const cardDeckStyle = {
  display:'flex',
  flexWrap:'wrap'
}
const containerStyle = {
  background:'rgba(255,255,255, .5)'
}
