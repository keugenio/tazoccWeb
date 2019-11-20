import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../gcal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventInformation from './EventInformation';
import ScoraRaces from '../data/scora_races';

moment.locale("en-US");
const localizer = momentLocalizer(moment);

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
        <img src="/images/bg_home.jpg" className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">Team Arizona Calendar of Events</p></div>
        <div className="d-flex">
        <div className="col-md-8">
          <div className="container p-4" style={containerStyle}>
            <div style={this.state.displayWaitingIcon}>
              <FontAwesomeIcon icon="sync" spin={true} size="6x" />
            </div>
            <div style={this.state.displayEvents}>
              <Calendar
              style={calendarStyle}
              localizer={localizer}
              events={this.state.events}
              onSelectEvent={event => handleOnSelect(event)}
              />              
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-warning" data-toggle="modal" data-target="#SCORAModal">SCORA Races</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4" style={containerStyle}>
            <div className="mt-4 containerTitle"><p className="text-dark">typical events and races we do throughout the year</p></div>
            <div className="events" style={cardDeckStyle}>
              <EventInformation/>
            </div>
          </div>        
        </div>
        </div>  
        
        <div className="modal fade" id="SCORAModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">SCORA Races</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
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

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>        
      </React.Fragment>
    )
  }
}

export default TAZCalendar

const calendarStyle = {
  height:'50vh',
  margin:'4rem'
}
const waitingIconStyle = {
  display:'flex',
  'justify-content':'center',
  'align-items':'center'
}
const cardDeckStyle = {
  display:'flex',
  flexWrap:'wrap'
}
const containerStyle = {
  marginTop:'10rem',
  background:'rgba(255,255,255, .5)'
}
