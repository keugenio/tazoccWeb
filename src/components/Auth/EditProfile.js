import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Card, Form, Col, Row, Button } from 'react-bootstrap';
import firebase, { dbAuth, dbAllPaddlers } from '../Firebase';
import { setUserName } from '../../store/store';

function mapStateToProps({user}) {
  return {
    user
  };
}

class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state={
      displayName:''

    }
  }


  handleOnChange = (e) => {    
    this.setState({[e.target.name]:e.target.value})
  }  
  handleSave = () => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName:this.state.displayName
    }).then(()=>{
      this.props.dispatch(setUserName(this.state.displayName))
    })
    console.log(user);
    
  }

  render() {
    return (
      <div>
        <div className="pageTitle text-white">Edit Profile</div>
        <Card as={Col} lg={10} className="editProfile mx-auto">
          <Card.Body>
            <div>          
              <Form className="container-fluid">
                <Form.Group as={Row} controlId="formPlaintextEmail" className="d-flex align-items-center">
                  <Form.Label column sm="3" className="text-right">
                    New Display Name
                  </Form.Label>
                    <Col sm="6">              
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Display Name"
                        name="displayName"
                        defaultValue={this.props.user.userName} 
                        value={this.state.displayName}                       
                        onChange={this.handleOnChange}
                      />
                    </Col>
                </Form.Group>  
                <Button background="danger" text="white" onClick={this.handleSave}>Save</Button>             
              </Form>       
            </div>          
          </Card.Body>
        </Card>
        

        </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(EditProfile);