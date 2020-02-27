import React, { Component } from 'react';
import firebase, { dbAttendance, dbAllPaddlers } from '../Firebase';
import { connect} from 'react-redux';
import { Accordion, Form, Card, Button, Row, Col, ListGroup, InputGroup, Badge, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import DatePicker from './Datepicker';
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
      noLoginPaddler:'',
      daysThatHadPractices:'',
      showModal:false,
      showSaveButton:false
    }
  }
  static getDerivedStateFromProps(props, state) {
    // update the available paddlers so it DOES NOT contain any paddlers already chosen
    const { paddlers } = props
    const filteredPaddlers =[];

    paddlers.map(paddler=>{
      if (!state.paddlersWhoPracticed.find((p)=>p.paddlerID == paddler.paddlerID))
        filteredPaddlers.push(paddler)
    })

    return {paddlers:filteredPaddlers}
  }
  componentDidMount(){
    this.getPaddlersWhoAttendedFromDb();

    //get all the dates where there are attendances and add to state
    firebase.firestore().collection('practiceAttendance')
    .get()
    .then(snapshot=>{
      snapshot.docs.forEach(doc=>{
        this.setState({daysThatHadPractices:[...this.state.daysThatHadPractices, new Date(doc.id)]})    
      })
    })
  }
  getPaddlersWhoAttendedFromDb = () => {
    //convert date to show just the MMDDYYYY instead of timecode
    const date = moment(this.state.date).format('MM-DD-YYYY');
    
    // on the initial mount of this component, get info from db and
    // load up dbPaddlersWhoPracticed and paddlersWhoPracticed to 
    // show those users for today.
    dbAttendance.doc(date)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();
      if (data){
        this.setState({dBpaddlersWhoPracticed: [...data.paddler]})
        this.setState({paddlersWhoPracticed: [...data.paddler]})
      }
    })    
  }
  setPaddler = (e) => {
    this.setState({selectedPaddlers: [...this.state.selectedPaddlers, e.target.value]})
  }
  handleCalendarChange = date => {
    
    //convert date to show just the MMDDYYYY instead of timecode
    const newDate = moment(date.valueOf()).format('MM-DD-YYYY');
    this.setState({date:date.valueOf()});
    
    // on the initial mount of this component, get info from db and
    // load up dbPaddlersWhoPracticed and paddlersWhoPracticed to 
    // show those users for today.
    dbAttendance.doc(newDate)
    .get()
    .then((snapshot) => {
      const data = snapshot.data();
      // if anything returned update the paddlers else clear the fields to show no paddlers
      if (data) {
        this.setState({dBpaddlersWhoPracticed: [...data.paddler]})
        this.setState({paddlersWhoPracticed: [...data.paddler]})
      }
      else {
        this.setState({dBpaddlersWhoPracticed:[], paddlersWhoPracticed:[], showModal:true})

      }
    })   
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
  addPaddlerToPractice = (paddlerID) => {
    const selectedPaddler = this.props.paddlers.find(paddler=>paddler.paddlerID == paddlerID)
    this.setState({
      paddlersWhoPracticed: [...this.state.paddlersWhoPracticed, {paddlerID:selectedPaddler.paddlerID, paddlerName:selectedPaddler.paddlerName}],
      showSaveButton:true
    })    
  }
  removePaddlerFromPractice = (paddlerID) => {
    const filteredPaddlers = this.state.paddlersWhoPracticed.filter(paddler=> paddler.paddlerID!= paddlerID)
    this.setState({paddlersWhoPracticed: filteredPaddlers})
  }
  updateNoLoginPaddler = (e) => {
    this.setState({noLoginPaddler:e.target.value})
  }
  addNoLoginPaddler = (e) =>{
    e.preventDefault();
    this.setState({
      paddlersWhoPracticed:[...this.state.paddlersWhoPracticed, {paddlerName:this.state.noLoginPaddler, paddlerID: "XXXX-" + uuid() }],
      noLoginPaddler:'', showSaveButton:true})
  }
  savePaddlersWhoAttended = () => {
    // write to db then update the display for paddlers who practiced
    // if there are no paddlers who practiced, delete the document from firestore else update the paddlers
    
    if (this.state.paddlersWhoPracticed.length<=0){
      //remove the doc from the attendance db
      dbAttendance.doc(moment(this.state.date).format('MM-DD-YYYY')).delete()
      const currDate = moment(this.state.date).format("MM-DD-YYYY")
      const filteredDays = this.state.daysThatHadPractices.filter(day=> moment(day).format("MM-DD-YYYY") != currDate)
      this.setState({daysThatHadPractices:filteredDays, showModal:false})
    }
    else {   
      dbAttendance.doc(moment(this.state.date).format('MM-DD-YYYY')).set({paddler:[...this.state.paddlersWhoPracticed]})
      .then(()=>{
        this.setState({dBpaddlersWhoPracticed: [...this.state.paddlersWhoPracticed], showModal:false})
      })
      .then(()=>{
        this.state.paddlersWhoPracticed.forEach(paddler=>{
          if (!paddler.paddlerID.includes('XXXX')) {
            // add the date to the user's attendance field
            dbAllPaddlers.doc(paddler.paddlerID).update({
              attendance:firebase.firestore.FieldValue.arrayUnion(this.state.date)
            })
            .catch(error=>{
              Swal.fire({
                icon: 'error',
                title: "Oops...",
                text: error,
                confirmButtonText: 'OK',
                showClass: {
                  popup: 'animated fadeInDown faster'
                },
                hideClass: {
                  popup: 'animated fadeOutUp faster'
                }                    
              }) 
              
            })
          }
        })
      })
      .then(()=>{
        // update the calendar to mark that this date had attendees
        this.setState({daysThatHadPractices:[...this.state.daysThatHadPractices, new Date(moment(this.state.date).format("MM-DD-YYYY"))]})
      })
      .catch((error)=>{
        console.log("error writing to db:", error);
      })
    }
  }  
  closeModal = () =>{
    this.setState({showModal:false})
  }
  showModal = () => {
    this.setState({showModal:true})
  }
  render() {    
    return (
      <div className="attendance" id="attendance">
        <Accordion defaultActiveKey="0">      
          <Card className="text-dark">
            <Accordion.Toggle as={Card.Title} eventKey="0" className="bg-warning">
              <Card.Title className="d-flex justify-content-between align-items-center bg-warning text-dark">
                <span>Attendance</span>
                <div className="d-flex">
                  <Button className="bg-transparent" onClick={()=>this.rotate()}>
                    <FontAwesomeIcon icon="angle-up" className="fa-2x text-dark bg-transparent border-0" style={{transform: `rotate(${this.state.rotation}deg)`}}/>
                  </Button>                
                </div>
              </Card.Title>
            </Accordion.Toggle>          
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Row>
                  <Col lg={6} xs={12} className="d-flex justify-content-center">
                    <DatePicker daysThatHadPractices={this.state.daysThatHadPractices} handleCalendarChange={this.handleCalendarChange}/>            
                  </Col>
                  <Col lg={6} xs={12} className="d-flex justify-content-center">
                    <Card border="dark" text="dark" className="bg-transparent dbListOfPaddlersWhoAttended">
                      <Card.Header className="d-flex justify-content-start text-dark">
                        <span className="ml-2">{moment(this.state.date).format("ddd MM-DD-YYYY")}</span>
                        <span className="ml-auto row">
                          <Badge pill variant="warning" className="ml-3">{this.state.dBpaddlersWhoPracticed.length} attended</Badge>
                          <Button className="bg-transparent border-0 ml-2 text-dark" onClick={this.showModal}><FontAwesomeIcon icon="edit" className="fa-2x"/></Button>
                        </span>
                      </Card.Header>

                      <Card.Body>
                        <Card.Text>
                          {this.state.dBpaddlersWhoPracticed.map((paddler, i)=>(
                              <span key={paddler.paddlerID} className="ml-3 comma">{paddler.paddlerName}</span>
                            ))}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>                                    
              </Card.Body>
            </Accordion.Collapse>          
          </Card>
        </Accordion>
        <Modal
          show={this.state.showModal} onHide={this.closeModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="attendanceModal"
        >
          <Modal.Header className="bg-warning text-dark" closeButton>
            <Modal.Title>
              <span className="text-dark">Add Paddlers who attended practice on {moment(this.state.date).format("ddd MMM DD, YYYY")}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card text="dark" >
              <Card.Body>
                <Row>
                  <Col lg={4} xs={12}>
                      <div className="text-muted paddlersWhoPaddledText">                            
                        <ListGroup className="listboxText border border-secondary" >
                          <ListGroup.Item className="bg-dark text-white d-flex justify-content-between">
                            <div>Paddlers attended:</div>
                            {this.state.date && this.state.showSaveButton && (<div><Button variant="danger" onClick={this.savePaddlersWhoAttended}><FontAwesomeIcon icon="save" className="text-white bg-dark "/></Button></div>)}
                          </ListGroup.Item>
                          {this.state.paddlersWhoPracticed.map((paddler, i)=>(
                            <ListGroup.Item key={paddler.paddlerID||i} onClick={()=>{this.removePaddlerFromPractice(paddler.paddlerID)}} className={paddler.paddlerID.includes('XXXX') && ("text-muted")}>
                              {paddler.paddlerName}
                              <FontAwesomeIcon icon="minus-circle" className="ml-2" />
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </div>
                    </Col>
                  <Col lg={'auto'} xs={12}>  
                    <Form.Group>
                      <ListGroup className="listboxText border border-secondary">
                        <ListGroup.Item className="bg-secondary text-dark">Available Paddlers</ListGroup.Item>
                        { this.state.paddlers.map( paddler => (
                          <ListGroup.Item onClick={()=>{this.addPaddlerToPractice(paddler.paddlerID)}} key={paddler.paddlerID}>
                          {paddler.paddlerName}
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
                              value={this.state.noLoginPaddler}
                            />
                            <Button type="submit">submit</Button>
                          </InputGroup>                                                    
                        </Form.Row>
                      </Form.Group>     
                    </Form>                  
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.closeModal} className="btn-primary">Close</button>
          </Modal.Footer>
        </Modal>        
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