import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRaces } from '../../Firebase';
import { Row, Col, Card, CardGroup, Modal, Button, Form, Accordion} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addRace } from '../../../store/store';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Race from './Race';

class RacesAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races:[],
      showModal:false,
      name:'',
      host:'',
      location:'',
      date:0,
      longCourseReq:0,
      shortCourseReq:0,
      info:'',
      changeRequirement:false,
      rotation:0
    }
  }
  
  getRacesAndUpdateStore = () => {
    dbRaces.get().then(docs=>{
      docs.docs.forEach(doc => {
        const raceData = doc.data();
        const newRaceData = {...raceData, id:doc.id}
        this.props.dispatch(addRace(newRaceData));
        //this.setState({races: [...this.state.races, newRaceData]});
      });
    })    
  }
  componentDidMount() {
    //if no races in the store, load races from firestore into store
    if (this.props.races.length<=0){
      this.getRacesAndUpdateStore()
     }
  }
  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked })
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value })
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
      changeRequirement:this.state.changeRequirement     
    })
    .then((docRef) => {
      //console.log("Document written with ID: ", docRef.id);
      const newRaceInfo = { name, location, date, longCourseReq, shortCourseReq, info, changeRequirement } = this.state
      this.props.dispatch(addRace({
        id:docRef.id,
        name: newRaceInfo.name,
        host: newRaceInfo.host,
        location: newRaceInfo.location,
        date: newRaceInfo.date,
        longCourseReq: newRaceInfo.longCourseReq,
        shortCourseReq: newRaceInfo.shortCourseReq,
        info: newRaceInfo.info,
        changeRequirement: newRaceInfo.changeRequirement         
      }))
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    // clear the current races in the state and reload from the db
    //this.setState({races:[]})
    // dbRaces.get().then(docs=>{
    //   docs.docs.forEach(doc => {
    //     this.setState({races: [...this.state.races, doc.data()]});
    //     this.store.dispatch(addRace(doc.data()))
    //   });
    // }) 
    // this.getRacesAndUpdateStore();

    // clear the current state race info so the modal shows blank on next popup
    this.setState({
      name:'',
      host:'',
      location:'',
      date:0,
      longCourseReq:0,
      shortCourseReq:0,
      info:'',
      changeRequirement:false      
    })
    // close the modal to see the updated state.
    this.handleCloseModal();
  }
  handleCalendarChange = date => {
    this.setState({date:date.valueOf()});
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
      
  render() {    
    return (
      <div className="raceAdmin">
      <Accordion defaultActiveKey="0">      
          <Card>
            <Accordion.Toggle as={Card.Title} eventKey="0" className="bg-primary" onClick={this.rotate}>
              <Card.Title className="d-flex justify-content-between align-items-center bg-primary text-light">
                <span>Races</span>
                <div className="d-flex">                  
                  <FontAwesomeIcon icon="angle-up" className="fa-2x text-warning bg-primary" style={{transform: `rotate(${this.state.rotation}deg)`}}/>                  
                  <Button variant="primary" onClick={this.handleShowModal} className="bg-transparent border-0">
                    <FontAwesomeIcon icon="plus-circle" className="fa-3x text-warning bg-primary"/>
                  </Button>
                </div>
              </Card.Title>
            </Accordion.Toggle>          
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                { this.props.races.length > 0 && (
                      <CardGroup>
                        {this.props.races.map((race,i)=>{
                          const {id, name, host, location, date, longCourseReq, shortCourseReq, changeRequirement, internalInfo, info} = race
                          return (
                            <Race key={i} raceID={id} name={name} host={host} location={location} internalInfo={internalInfo} info={info} date={date} longCourseReq={longCourseReq} shortCourseReq={shortCourseReq} changeRequirement={changeRequirement} />
                          )
                        })}           
                    </CardGroup>
                )}
              </Card.Body>
            </Accordion.Collapse>          
          </Card>
        </Accordion>

        <Modal show={this.state.showModal} onHide={this.handleCloseModal} animation={false} size="lg" centered className="addRaceModal">
          <Modal.Header closeButton>
            <Modal.Title>Add a Race</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="addRaceForm p-3">
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Name </Form.Label>
                </Col>
                <Col>
                  <Form.Control type="text" name="name" placeholder="Name of Race" value={this.state.name} onChange={this.handleChange}/>
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Host </Form.Label>
                </Col>
                <Col>              
                  <Form.Control type="text" name="host" placeholder="Host Club" value={this.state.host} onChange={this.handleChange} />
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Location </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="location" placeholder="Location" value={this.state.location} onChange={this.handleChange} />
                </Col>
              </Row>               
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Race Date </Form.Label>
                </Col>
                <Col>
                  <DatePicker
                      value={this.state.date}
                      selected={this.state.date}
                      onChange={this.handleCalendarChange}
                      minDate={new Date()}
                    />
                </Col>
              </Row>
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Change Requirement</Form.Label>
                </Col>
                <Col>
                  <Form.Check name="changeRequirement" checked={this.state.changeRequirement} onChange={this.handleChangeChecked} />
                </Col>
              </Row>               
              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Long Course Req</Form.Label>
                </Col>
                <Col>
                  <Form.Control type="number" name="longCourseReq" placeholder="Long Course Time Requirement" value={this.state.longCourseReq} onChange={this.handleChange} />
                </Col>
              </Row>
              {!this.state.changeRequirement && (<Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>Short Course Req </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="shortCourseReq" placeholder="Short Course Time Requirement" value={this.state.shortCourseReq} onChange={this.handleChange} />
                </Col>
              </Row>)}

              <Row>
                <Col className="text-right" lg={4}>
                  <Form.Label>More Info </Form.Label>
                </Col>
                <Col>                  
                  <Form.Control type="text" name="info" placeholder="More Info" value={this.state.info} onChange={this.handleChange} />
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

const MapStateToProps = ({ races }) => ({
  races
})

export default connect(MapStateToProps)(RacesAdmin);
