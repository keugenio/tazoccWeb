import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRaces } from '../../Firebase';
import { Row, Col, Card, CardGroup, Modal, Button, Form, Accordion} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addRace } from '../../../store/store';
import events from '../../eventDescriptions';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Race from './Race';

const MapStateToProps = ({ races }) => ({
  races
})
class RacesAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal:false,
      name:'',
      host:'',
      location:'',
      date:0,
      longCourseReq:0,
      shortCourseReq:0,
      info:'',
      internalInfo: -1,
      changeRequirement:false,
      rotation:0
    }
  }

  rotate = () => {
    let newRotation = this.state.rotation + 180;
    if(newRotation >= 360){
      newRotation =- 360;
    }
    this.setState({
      rotation: newRotation,
    })
  }  
  handleShowModal = () => {
    this.setState({showModal:true})
  }
  handleCloseModal = () => {
    this.setState({showModal:false})
  }  
  handleSaveNewRace = () => {
    // write the new race to firebase and update store 
    let newDocID = '';
    dbRaces.add({
      name:this.state.name,
      host:this.state.host,
      location:this.state.location,
      date:this.state.date,
      longCourseReq:this.state.longCourseReq,
      shortCourseReq:this.state.shortCourseReq,
      info:this.state.info,
      internalInfo:((this.state.internalInfo!=-1) ? this.state.internalInfo: null),
      changeRequirement:this.state.changeRequirement     
    })
    .then((docRef) => {
      //console.log("Document written with ID: ", docRef.id);
      const newRaceInfo = { name, location, date, longCourseReq, shortCourseReq, info, changeRequirement } = this.state
      this.props.dispatch(addRace({
        raceID:docRef.id,
        name: newRaceInfo.name,
        host: newRaceInfo.host,
        location: newRaceInfo.location,
        date: newRaceInfo.date,
        longCourseReq: newRaceInfo.longCourseReq,
        shortCourseReq: newRaceInfo.shortCourseReq,
        info: newRaceInfo.info,
        internalInfo:((this.state.internalInfo!=-1) ? this.state.internalInfo: null),
        changeRequirement: newRaceInfo.changeRequirement         
      }))
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    // clear the current state race info so the modal shows blank on next popup
    this.setState({
      name:'',
      host:'',
      location:'',
      date:0,
      longCourseReq:0,
      shortCourseReq:0,
      info:'',
      internalInfo:-1,
      changeRequirement:false      
    })
    // close the modal to see the updated state.
    this.handleCloseModal();
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value }) 
  }    
  handleChangeCalendar = date => {
    this.setState({date:date.valueOf()});
  }   
  render() {   
    const sortedRaces = this.props.races.sort((a,b)=>(a.date<b.date?-1:1)) 
    return (
      <div className="raceAdmin">
      <Accordion>      
          <Card>
            <Accordion.Toggle as={Card.Title} eventKey="1" className="bg-primary">
              <Card.Title className="d-flex justify-content-between align-items-center bg-primary text-light">
                <span>Races</span>
                <div className="d-flex">
                  <Button variant="primary" onClick={this.handleShowModal} className="bg-transparent border-0">
                    <FontAwesomeIcon icon="plus-circle" className="fa-2x text-warning bg-transparent"/>
                  </Button>
                  <Button className="bg-transparent border-0" onClick={this.rotate}>
                    <FontAwesomeIcon icon="angle-up" className="fa-2x text-warning bg-transparent" style={{transform: `rotate(${this.state.rotation}deg)`}}/>                  
                  </Button>                  
                </div>
              </Card.Title>
            </Accordion.Toggle>          
            <Accordion.Collapse eventKey='1'>
              <div>
                <Card.Body>                
                  { sortedRaces.length > 0 && ( 
                    <CardGroup>
                      {sortedRaces.map((race,i)=>{
                        return (
                          <Race 
                            key={i} race={race}
                            currentPage = {this.props.currentPage} /> )
                      })}          
                    </CardGroup>
                  )}
                </Card.Body>
              </div>
            </Accordion.Collapse>          
          </Card>
        </Accordion>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal} animation={false} size="lg" centered className="addRaceModal" >
          <Modal.Header className="bg-warning" closeButton>
            <Modal.Title>Add a Race</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="addRaceForm p-3">
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Name </Form.Label>
                </Col>
                <Col>
                  <Form.Control type="text" name="name" placeholder="Name of Race" onChange={this.handleChange}/>
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Host </Form.Label>
                </Col>
                <Col>              
                  <Form.Control type="text" name="host" placeholder="Host Club" onChange={this.handleChange} />
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Location </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="location" placeholder="Location" onChange={this.handleChange} />
                </Col>
              </Row>               
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Date </Form.Label>
                </Col>
                <Col>
                  <DatePicker
                      selected={this.state.date}
                      onChange={this.handleChangeCalendar}
                      minDate={new Date()}
                    />
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Change Requirement</Form.Label>
                </Col>
                <Col>
                  <Form.Check name="changeRequirement" defaultValue={false} onChange={this.handleChangeChecked} />
                </Col>
              </Row>               
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Long Course Req</Form.Label>
                </Col>
                <Col>
                  <Form.Control type="text" name="longCourseReq" placeholder="Long Course Time Requirement" onChange={this.handleChange} />
                </Col>
              </Row>
              {!this.state.changeRequirement && (<Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Short Course Req </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="shortCourseReq" placeholder="Short Course Time Requirement" onChange={this.handleChange} />
                </Col>
              </Row>)}

              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>More Info </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="internalInfo" placeholder="More Info" onChange={this.handleChange} />
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Description </Form.Label>
                </Col>
                <Col>                  
                  <select name="internalInfo" onChange={this.handleChange}>
                    <option value={-1} >none</option>
                    { events.map((race, i)=> (
                        <option key={i} value={i}>{race.title}</option>
                    ))}
                  </select>
                </Col>
              </Row>              
                          
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal} className="btn-lg">
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSaveNewRace} className="btn-lg">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}



export default connect(MapStateToProps)(RacesAdmin);
