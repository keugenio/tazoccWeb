import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import { connect } from 'react-redux';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../gcal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setCalendarEvents } from '../store/store'
import "babel-polyfill";

moment.locale("en-US");
const localizer = momentLocalizer(moment);
const ls = require('local-storage');

const handleOnSelect = (event) => {
  const start = moment(event.start);
  const end = moment(event.end)
  let text = null
  if (end.diff(start, 'days') < 1){
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
      displayWaitingIcon:{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'#01579b'},
      displayEvents:{'display':'none'},
    }   
    this.updateCalendarData = this.updateCalendarData.bind(this)
  }

  async componentDidMount (props) {
    // turn off watiing Icon
    this.setState({displayWaitingIcon:{'display':'none'}})
    this.setState({displayEvents:{'display':'block'}})

    // download events from the Google Calendar and add any new events to the store and localStorage
    await getEvents((events) => {      
      this.props.dispatch(setCalendarEvents([...events]))          
    }, moment().valueOf())
    
  }

  async updateCalendarData (focusDate) {
      //get 3 months prev and next of focusDate
      // download events from the Google Calendar and add any new events to the store and localStorage
      await getEvents((events) => {      
        this.props.dispatch(setCalendarEvents([...events]))          
      },focusDate)      
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
              localizer={localizer}
              events={this.props.storeEvents}
              onSelectEvent={event => handleOnSelect(event)}
              onNavigate={(focusDate, flipUnit, prevOrNext) => this.updateCalendarData(focusDate)}
              />              
            </div>
          </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    storeEvents:state.events
  }
}

//export default TAZCalendar
export default connect(mapStateToProps)(TAZCalendar)

const containerStyle = {
  background:'rgba(255,255,255, .5)',
  minHeight:'90%',
  padding:'1.5rem'
}
