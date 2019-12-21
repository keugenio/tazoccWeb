import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dbRaces } from '../../Firebase';
import { updateRace } from '../../../store/store';

class Race extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name:props.name,
      host:props.host || '',
      location: props.location || '',
      info:props.info || '',
      date:props.date || 0,
      longCourseReq:props.longCourseReq || 0,
      shortCourseReq:props.shortCourseReq || 0,
      changeRequirement:props.changeRequirement || false,
      editable:false
    }
  }
  toggleEdit = () => {
    const { name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, id } = this.props
    this.setState({ name, host, location, info, date, longCourseReq, shortCourseReq, changeRequirement, id, editable:true });
  }
  toggleCancel = () => {
  // hide editable fields
  this.setState({editable:false})  
  }
  toggleSave = () => {    
    dbRaces.doc(this.state.id).set( {
      name:this.state.name,
      host:this.state.host,
      location: this.state.location,
      info:this.state.info,
      date:this.state.date,
      longCourseReq:this.state.longCourseReq,
      shortCourseReq:this.state.shortCourseReq,
      changeRequirement:this.state.changeRequirement,
    })
    .then(() => { 
      this.setState({editable:false}) 
    })
    // udpate this race in the store to the new values
    const updatedRace = {id:this.state.id, name:this.state.name, date:this.state.date, location:this.state.location, host:this.state.host, longCourseReq: this.state.longCourseReq, shortCourseReq:this.state.shortCourseReq, changeReq:this.state.changeReq, info:this.state.info}
    this.props.dispatch(updateRace(updatedRace))

  }

  handleChange = (e) => {

    this.setState({ [e.target.name]: e.target.value })
  }
  handleChangeCalendar = (date) => {
    this.setState({ date: date.valueOf() })
  }
  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked })
  }

  render(){
    return (
      <div>
      { this.state.editable && (

        <Card border="warning" className="text-dark box-shadow-primary raceInfo">
          <Card.Title className="bg-warning text-dark d-flex justify-content-between">
            <div>
              Edit {this.state.name}
            </div>
            <div>
              {this.state.editable && (<Button onClick={this.toggleSave} className="btn-danger" ><FontAwesomeIcon icon="save" /></Button>)}
              {this.state.editable && (<Button onClick={this.toggleCancel} className="btn-dark" >x</Button>)} 
            </div>
          </Card.Title>
          <Card.Body>
            <ul>
              <li>Name: <input type="text" value={this.state.name} name="name" placeholder="race name" onChange={this.handleChange}/></li>
              <li>Host: <input type="text" value={this.state.host} name="host" placeholder="race host" onChange={this.handleChange}/></li>
              <li>Location: <input type="text" value={this.state.location} name="location" placeholder="race location" onChange={this.handleChange}/></li>
              <li>Date:
                <DatePicker
                    value={(this.state.date > 0) || moment().valueOf()}
                    selected={this.state.date}
                    onChange={this.handleChangeCalendar}
                  />
              </li>
              <li>Long Course Req: <input type="text" name="longCourseReq" placeholder="long course requirement" value={this.state.longCourseReq} onChange={this.handleChange}/></li>
              <li>Short Course Req: <input type="text" name="shortCourseReq" placeholder="short course requirement" value={this.state.shortCourseReq} onChange={this.handleChange}/></li>
              <li>Change Req: <input type="checkbox" name="changeReq" placeholder="change requirement" defaultChecked={this.state.changeRequirement}  onChange={this.handleChangeChecked}/></li>
              <li>More info:<textarea name="info" rows="3" value={this.state.info}  placeholder="add more info" onChange={this.handleChange}/></li>
            </ul>
          </Card.Body>
        </Card>
      )}
      {!this.state.editable && (
        <Card border="info" className="text-dark border-1 m-3 box-shadow-primary raceInfo">
          <Card.Title className="bg-info text-light d-flex justify-content-between">
            <span>{this.props.name}</span>
            {this.props.role && (this.props.role == "admin" || this.props.role== "superAdmin") && (<Button onClick={this.toggleEdit}><FontAwesomeIcon icon="edit"/></Button>)}
          </Card.Title>
          <Card.Body>
            <ul>
              <li><b className="mr-3" >Location:</b>  {this.props.location}</li>
              {(this.props.host) && (<li><b className="mr-3" >Host:</b>  {this.props.host}</li>)}
              {(this.props.date>0) && (<li><b className="mr-3" >Date:</b> {moment(this.props.date).format('dddd MMM D, YYYY')}</li>)}
              {this.props.longCourseReq>0 && (<li><b className="mr-3" >Long Course Req:</b>  {this.props.longCourseReq}</li>)}
              {this.props.shortCourseReq>0 && (<li><b className="mr-3" >Short Course Req:</b>  {this.props.shortCourseReq}</li>)}
              {this.props.changeRequirement && (<li><b className="mr-3" >Change Req:</b> {this.props.changeRequirement}</li>)}
              {this.props.info!='' && (<li><b className="mr-3" >more info:</b>  {this.props.info}</li>)}
            </ul>
          </Card.Body>
        </Card>         
      )}
    </div>
    )
  }

}

export default connect()(Race);