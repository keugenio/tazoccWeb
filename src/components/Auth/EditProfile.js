import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Card, Form, Col, Row, Button, Modal } from 'react-bootstrap';
import firebase, { dbAllPaddlers } from '../Firebase';
import { setUserName, setBirthday } from '../../store/store';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function mapStateToProps({user}) {  
  return {
    user
  };
}

class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state={
      oldDisplayName:'',
      displayName:'',
      oldBirthday:'',
      birthday:'',
      showModal:false
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {oldDisplayName:props.user.userName, oldBirthday:props.user.birthday || 'none entered yet'}
  }
  handleOnChange = (e) => {    
    this.setState({displayName:e.target.value});    
  }  
  handleSave = () => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:this.state.displayName
    })
      .then(()=>{
        this.props.dispatch(setUserName(this.state.displayName))
      })    
      .then(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Your display name has been changed!',
          showConfirmButton: false,
          timer: 1000
        })
        this.setState({displayName:''})
      })
      .catch(err=>{
        Swal.fire({
          icon: 'error',
          title: 'error in saving display name',
          text: err,
          showConfirmButton: false,
          timer: 1500
        })         
      })
  }
  handleCalendarChange = date => {
    this.setState({ birthday:date.valueOf() });
  }   
  handleSaveBirthday = () => {
    dbAllPaddlers.doc(this.props.user.uid).update({
      birthday:this.state.birthday
    })
      .then(()=>{
        Swal.fire({
          icon: 'success',
          title: 'Birthday saved!',
          showConfirmButton: false,
          timer: 1500
        }) .then(()=>{
          this.props.dispatch(setBirthday(this.state.birthday))
          this.setState({birthday:''})
        })       
      })
      .catch(err=>{
        Swal.fire({
          icon: 'error',
          title: 'Error in saving Birthday',
          text:{err},
          showConfirmButton: false,
          timer: 1500
        }) 
      })
    
  }

  render() {
    return (
      <div>
        <Button variant="dark" onClick={()=>this.setState({showModal:true})} className="bg-transparent text-dark border-0 d-flex align-items-center">
          <h4>{this.props.title}</h4><FontAwesomeIcon icon="cog" className="h4 ml-2"/>
        </Button>
        <Modal centered show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}}>
          <Modal.Header className="bg-success text-white" closeButton/>
          <Modal.Title className="pl-2"><h2>Edit Profile</h2></Modal.Title>
          <Modal.Body>
            <div className="editProfilePage">
              <Card as={Col} className="editProfile mx-auto text-dark">
                <Card.Body>
                  <div>
                    <h4>Current Display Name: {this.state.oldDisplayName}</h4>          
                    <Form className="container-fluid">
                      <Form.Group as={Row} controlId="formPlaintextEmail" className="d-flex align-items-center">
                        <Col lg={10} className="d-flex align-items-center">            
                            <input
                              className="form-control w-100"
                              type="text"
                              name="displayName"
                              placeholder="new display name"                     
                              onChange={this.handleOnChange}
                            />
                        </Col>
                        <Col lg={2} className="d-flex align-items-center">
                          <Button className="btn-danger" onClick={this.handleSave}>Save</Button>
                        </Col>             
                      </Form.Group>  
                    </Form>       
                  </div>         
                </Card.Body>
              </Card>
              <Card as={Col} className="editProfile mx-auto text-dark">
                <Card.Body>
                  <div>
                    <h4>Current Birthdate: {moment(this.state.oldBirthday).format("MMM DD, YYYY")}</h4>        
                    <Form className="container-fluid">
                      <Form.Group as={Row} controlId="formPlaintextEmail" className="d-flex align-items-center">
                        <Col lg={10} className="d-flex align-items-center">               
                          <DatePicker
                            value={this.state.birthday}
                            selected={this.state.birthday}
                            onChange={this.handleCalendarChange}
                          />

                        </Col>
                        <Col lg={2} className="d-flex align-items-center">
                          <Button className="btn-danger" onClick={this.handleSaveBirthday}>Save</Button>
                        </Col>            
                      </Form.Group>  
                    </Form>       
                  </div>         
                </Card.Body>
              </Card>        
            </div>          
          </Modal.Body>
        </Modal>
      </div>

    );
  }
}

export default connect(
  mapStateToProps,
)(EditProfile);