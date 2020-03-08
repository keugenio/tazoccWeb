import React, { Component } from 'react';
import { Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { dbAllTimeTrials } from '../Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import moment from 'moment';

function mapStateToProps({user, paddlers}) {
  return {
    user, paddlers: paddlers.sort((a,b)=>(a.paddlerName > b.paddlerName) ? 1: -1)
  };
}

class AllTimeTrials extends Component {
  constructor() {
    super();

    this.state = {
      timeTrials:[],
      showModal:false,
      admin:false,
      currDate:null,
      currPaddlerID:null,
      currTimeTrial:null,
      currUserTTs:[],
      done:[]
    }
  }

  async componentDidMount() { 
    await dbAllTimeTrials.get()
    .then((timeTrials) => {
      timeTrials.forEach(timeTrial=>{
        dbAllTimeTrials.doc(timeTrial.id).get().then(doc=>{
          const ttData=doc.data();
          if (ttData.paddlerID == this.props.user.paddlerID)
            this.setState({currUserTTs:[...this.state.currUserTTs, ttData]});
          // if the current time trial is NOT in the list, add it.
          // else if it's larger than old one, replace it.
          if (!this.state.timeTrials.find(f=>f.paddlerID == ttData.paddlerID)){
            this.setState({timeTrials: [...this.state.timeTrials, ttData]})
          }
          else {
            
            const old = this.state.timeTrials.find(f=>f.paddlerID == ttData.paddlerID);
            if (old.timeTrial<ttData.timeTrial){
              const filtered = this.state.timeTrials.filter(f=>f.paddlerID!=ttData.paddlerID);
              this.setState({timeTrials:[...filtered, ttData]})
            }
          }
        })
      })
    })
    .then(()=>{
      if (this.props.user.role == "admin" || this.props.user.role == "superAdmin" )
        this.setState({admin:true});
    })
  }

  handleCloseModal = () =>{
    this.setState({showModal:false})
  }
  handleOpenModal = () =>{
    this.setState({showModal:true})
  }
  handleAddTimeTrial = () => {
    if (this.state.currDate && this.state.currPaddlerID && this.state.currTimeTrial) {
      dbAllTimeTrials.add({
        paddlerID:this.state.currPaddlerID,
        date:this.state.currDate,
        timeTrial:this.state.currTimeTrial
      }).then(()=>{
        this.handleCloseModal();
        this.setState({
          paddlerID:null,
          date:null,
          timeTrial:null          
        })
      })
    }
  }
  handleChangeCalendar = date => {
    this.setState({currDate:date.valueOf()});
  } 
  setPaddler = (e) => {
    const selectedPaddler = this.props.paddlers.find(paddler => paddler.paddlerID === e.target.value)
    this.setState({currPaddlerID:selectedPaddler.paddlerID})
  }  
  setCurrTimeTrial = (e) => {
    this.setState({currTimeTrial:e.target.value})
  }

  render() {
    const sortedTT = this.state.timeTrials.sort((a,b)=>(a.timeTrial > b.timeTrial) ? 1: -1);
    const currUser = sortedTT.find(paddler=>paddler.paddlerID === this.props.user.paddlerID);
    
    return (
      <div>
      <Card bg="primary" text="white">
          <Card.Title className="d-flex justify-content-start">
            <span>Time Trial Leader Board (in meters)</span>
            {this.state.admin &&  <Button onClick={()=>this.handleOpenModal()} className="ml-auto">
              <FontAwesomeIcon icon="plus-circle"></FontAwesomeIcon>
            </Button>}
            </Card.Title>
          <Card.Body>
            {currUser && <div>your best time: {currUser.timeTrial}m, was on {moment(currUser.date).format('MM-DD-YYYY')} </div>}
            {sortedTT.map((tt, i)=>{
              if (this.props.user.paddlerID == tt.paddlerID)
                return (<Badge key={i} pill variant="danger">{tt.timeTrial}</Badge>)
              else 
                return (<Badge key={i} pill variant="warning">{tt.timeTrial}</Badge>)
              }
            )}
            <hr></hr>
            <span><b>History</b></span>
            {this.state.currUserTTs.map((cTT, i)=>(
              <div key={i}>{cTT.timeTrial + "m , " + moment(cTT.date).format("MM-DD-YY")}</div>
            ))}
          </Card.Body>
        </Card>
        <Modal show={this.state.showModal} centered onHide={()=>this.handleCloseModal()}>
          <Modal.Header closeButton>
            <Modal.Title className="text-dark">Add Time Trial</Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-dark">
          <Form>
            <Form.Group>
              <Form.Label>Paddler</Form.Label>
              <Form.Control as="select" size="lg"onChange={this.setPaddler} value={this.state.currPaddlerID}>
                <option disabled value='0' >-- select Paddler --</option>
                { this.props.paddlers.map((paddler, i)=>(
                    <option key={i} value={paddler.paddlerID}>{paddler.paddlerName}</option>
                  ))
                }
              </Form.Control>            
            </Form.Group>
            <Form.Group>
              <Form.Label>Date:</Form.Label>
              <DatePicker
                onChange={this.handleChangeCalendar}
                selected={this.state.currDate}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time Trial</Form.Label>
              <Form.Control type="text" placeholder="time trial" onChange={this.setCurrTimeTrial} value={this.state.currTimeTrial}/>
            </Form.Group>
          

            <Button variant="primary" type="button" onClick = {this.handleAddTimeTrial}>
              Submit
            </Button>
          </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary"  onClick={()=>this.handleCloseModal()}>Close</Button>
          </Modal.Footer>
      </Modal>        
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(AllTimeTrials);