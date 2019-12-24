import React, { Component } from 'react';
import { dbAttendance } from '../Firebase';
import { connect} from 'react-redux';
import { Accordion, Form, Card, Button, Row, Col, ListGroup, InputGroup, Text } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import uuid from 'uuid/v4'
import { } from '../../store/store';

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state={
      date: Date.now(),
      paddlers:[],
      selectedPaddlers:[],
      dBpaddlersWhoPracticed:[],
      rotation:0,
      paddlersWhoPracticed:[],
      noLoginPaddler:''
    }
  }
  static getDerivedStateFromProps(props, state) {
    // update the available paddlers so it DOES NOT contain any paddlers already chosen
    const { paddlers } = props
    const filteredPaddlers =[];

    paddlers.map(paddler=>{
      if (!state.paddlersWhoPracticed.find((p)=>p.uid == paddler.uid))
        filteredPaddlers.push(paddler)
    })

    return {paddlers:filteredPaddlers}
  }
  componentDidMount(){
    //convert date to show just the MMDDYYYY instead of timecode
    const date = moment(this.state.date).format('MMDDYYYY');
    
    // on the initial mount of this component, load up dbPaddlersWhoPracticed and paddlersWhoPracticed to 
    // show those users for today.
    dbAttendance.doc(date)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();
      console.log(data);
      
      this.setState({dBpaddlersWhoPracticed: [...data.paddler]})
      this.setState({paddlersWhoPracticed: [...data.paddler]})
      
      

    })
    
    
  }
  setPaddler = (e) => {
    this.setState({selectedPaddlers: [...this.state.selectedPaddlers, e.target.value]})
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
  addPaddlerToPractice = (uid) => {
    const selectedPaddler = this.props.paddlers.find(paddler=>paddler.uid == uid)
    this.setState({paddlersWhoPracticed: [...this.state.paddlersWhoPracticed, {uid:selectedPaddler.uid, name:selectedPaddler.name}]})    
  }
  removePaddlerFromPractice = (uid) => {
    const filteredPaddlers = this.state.paddlersWhoPracticed.filter(paddler=> paddler.uid!= uid)
    this.setState({paddlersWhoPracticed: filteredPaddlers})
  }
  updateNoLoginPaddler = (e) => {
    this.setState({noLoginPaddler:e.target.value})
  }

  addNoLoginPaddler = (e) =>{
    e.preventDefault()
    this.setState({
      paddlersWhoPracticed:[...this.state.paddlersWhoPracticed, {name:this.state.noLoginPaddler, uid: "XXXX-" + uuid() }]
      })
    document.getElementById("addNoLoginPaddler").reset()
  }
  savePaddlersWhoAttended = () => {
    
    // write to db then update the display for paddlers who practiced
    dbAttendance.doc(moment(this.state.date).format('MMDDYYYY')).set({paddler:[...this.state.paddlersWhoPracticed]})
    .then(()=>{
      this.setState({dBpaddlersWhoPracticed: [...this.state.paddlersWhoPracticed]})
    })
    .catch((error)=>{
      console.log("error writing to db:", error);
      
    })
  }
  isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  render() {
    return (
      <div className="attendance">
        <Accordion defaultActiveKey="0">      
        <Card className="text-dark">
          <Accordion.Toggle as={Card.Title} eventKey="0" className="bg-warning" onClick={this.rotate}>
            <Card.Title className="d-flex justify-content-between align-items-center bg-warning text-dark">
              <span>Attendance</span>
              <div className="d-flex">                  
                <FontAwesomeIcon icon="angle-up" className="fa-2x text-dark bg-transparent" style={{transform: `rotate(${this.state.rotation}deg)`}}/>
              </div>
            </Card.Title>
          </Accordion.Toggle>          
          <Accordion.Collapse eventKey='0'>
            <Card.Body>
              <Card bg="warning" text="dark" >
                <Card.Title className="d-flex align-items-center">
                <div>
                  <DatePicker
                    value={this.state.date}
                    selected={this.state.date}
                    onChange={this.handleCalendarChange}
                    defaultValue={new Date()}
                    inline
                  />                    
                </div>                
                <div className="ml-3">
                  <span>Date:</span>
                  <span className="ml-2">{ (this.state.date) ? moment(this.state.date).format("dddd MMM Do YYYY") : 'Select Date' }</span>
                </div>
                <div className="ml-4">
                  <ListGroup className="text-dark">
                    <ListGroup.Item>{this.state.dBpaddlersWhoPracticed.length} Practiced</ListGroup.Item>
                    {this.state.dBpaddlersWhoPracticed.map((paddler, i)=>(
                      <ListGroup.Item key={paddler.uid}>{paddler.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
                </Card.Title>
                <Card.Body>
                  <Row>
                    <Col lg={4} xs={12}>
                        <div className="text-muted paddlersWhoPaddledText">                            
                          <ListGroup className="listboxText border border-secondary" >
                            <ListGroup.Item className="bg-dark text-white d-flex justify-content-between">
                              <div>Paddlers attended:</div>
                              {( this.state.date ) && (this.state.paddlersWhoPracticed.length > 0) && (<div><Button variant="danger" onClick={this.savePaddlersWhoAttended}><span className="mr-2">Save  </span><FontAwesomeIcon icon="save" className="text-white bg-dark "/></Button></div>)}
                            </ListGroup.Item>
                            {!this.isEmpty(this.state.paddlersWhoPracticed) && (this.state.paddlersWhoPracticed.map((paddler, i)=>(
                              <ListGroup.Item key={paddler.uid||i} onClick={()=>{this.removePaddlerFromPractice(paddler.uid)}} className={paddler.uid.includes('XXXX') && ("text-muted")}>{paddler.name}</ListGroup.Item>
                            )))}
                          </ListGroup>
                        </div>
                      </Col>
                    <Col lg={'auto'} xs={12}>  
                      <Form.Group>
                        <ListGroup className="listboxText border border-secondary">
                          <ListGroup.Item className="bg-secondary text-dark">Available Paddlers</ListGroup.Item>
                          { this.state.paddlers.map( paddler => (
                            <ListGroup.Item onClick={()=>{this.addPaddlerToPractice(paddler.uid)}} key={paddler.uid}>
                            {paddler.name}
                            </ListGroup.Item>
                          )) }
                        </ListGroup>
                      </Form.Group>
                    </Col>
                    <Col lg={"auto"} xs={12}>   
                      <Form onSubmit={this.addNoLoginPaddler} id="addNoLoginPaddler">                                         
                        <Form.Group controlId="exampleForm.ControlTextarea1" className="p-3 border border-secondary noLogin d-flex justify-content-center flex-column">
                          <Form.Label>Paddler who does not have a login</Form.Label>
                          <Form.Row >
                            <InputGroup onSubmit={()=>{alert('holla')}}>                            
                              <Form.Control
                                name="noLoginPaddler"
                                placeholder="1 paddler per entry"
                                onChange={this.updateNoLoginPaddler}
                                defaultValue={this.state.noLoginPaddler}
                              />
                              <button type="submit">submit</button>
                            </InputGroup>                                                    
                          </Form.Row>
                        </Form.Group>     
                      </Form>                  
                    </Col>

                  </Row>
                </Card.Body>
              </Card>                      
            </Card.Body>
            </Accordion.Collapse>          
          </Card>
        </Accordion>
      </div>
    );
  }
}
const formStyle = {
  fontSize: '1.5rem'
}

const MapStateToProps = ({ paddlers }) =>({
  paddlers
})
export default connect(MapStateToProps)(Attendance);