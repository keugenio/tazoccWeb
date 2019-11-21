import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../gcal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      displayWaitingIcon:{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'#01579b'},
      displayEvents:{'display':'none'},
    }   
  }
  componentDidMount () {
    getEvents((events) => {
      this.setState({events})
      this.setState({displayWaitingIcon:{'display':'none'}})
      this.setState({displayEvents:{'display':'block'}})
    })
  }

  render(){
    return(
      <React.Fragment> 
          <div style={containerStyle}>
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
const containerStyle = {
  background:'rgba(255,255,255, .5)',
  minHeight:'90%'
}
