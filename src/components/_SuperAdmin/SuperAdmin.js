import React, { Component } from 'react';
import { Card, Button, Col, Row, Form } from 'react-bootstrap';
import axios from 'axios';
import "babel-polyfill";
import moment from 'moment';
import firebase, { dbAllPaddlers, dbAttendance, dbRacesToPaddlers, dbRaces } from '../Firebase';
require('firebase/auth');

class SuperAdmin extends Component {
  constructor(){
    super();
    this.state = {
      ids:[],
      selected:'',
      displayName:''
    }
    this.generateUsers = this.generateUsers.bind(this)
  }
  componentDidMount() {
    dbAllPaddlers.get()
    .then(paddlers=>{
      const allPaddlers=[]
      paddlers.forEach(doc=>{
        allPaddlers.push(doc.id)
      })
      this.setState({ ids: [...allPaddlers]})
    })    
  }

  handleOnChange = (e) => {
    console.log("fuck me", e.target.name);
    

  }
  generateRacesForPaddler = (id) => {
    console.log(`races added for ${id}` );
  }
  generateAttendanceForPaddler = (id) => {
    console.log(`attendance added for ${id}` );
  }

  async generateUsers () {
    await axios.get('https://randomuser.me/api/?results=1')
    .then(res => {
      const devPaddlers = res.data.results
      devPaddlers.forEach(paddler=>{
        console.log(paddler);
        
        firebase.auth().createUserWithEmailAndPassword(
          paddler.email, 'whoopwhoop'
        ).then(()=>{
          firebase.auth().onAuthStateChanged((FBUser)=>{
            FBUser.updateProfile({
              displayName:paddler.login.username,
              photoURL:paddler.picture.thumbnail,
              
            }).then(()=>{
              dbAllPaddlers.doc(FBUser.uid).set({
                duesPaid:((Math.random() >= 0.5)? (true): (false)),
                membershipType: ((Math.random() >= 0.5)? ('single'): ('family')),
                birthday:new Date(paddler.dob.date).valueOf(),
                jerseySize:'L',
                sex: paddler.gender,
                uid: FBUser.uid,
                SCORAID:'SC'+ Math.floor(1000 + Math.random() * 9000),
                scoraSmartWaiver:((Math.random() >= 0.5)? (true): (false)),
                scoraWaiver:((Math.random() >= 0.5)? (true): (false)),
                huliDrill:((Math.random() >= 0.5)? (true): (false)),
                devUser:true      
              })
            })

        // this.generateRacesForPaddler()
        // this.generateAttendanceForPaddler()
          })
        })

      })

    })
  }

  render() {
    const paddlers = this.state.ids
    return (
      <div>
      <Row>
        <Col lg={4}>
          <Card>
            <Card.Header>Add Users</Card.Header>
            <Card.Body>
              <Button onClick={this.generateUsers}>Generate Users</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
        <div className="form-group">
          <Form>
            <Form.Group>
              <Form.Label column sm="2">
                Select Paddler:
              </Form.Label>
              <Col sm="10">
                <select className="form-control" id="sel1" name="selected" onChange={this.handleOnChange}>
                  { this.state.ids.map((paddler)=>{
                      return (
                        <option key={paddler} value={paddler}>{paddler}</option> 
                      )
                    })
                  }            
                </select>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                New Display Name
              </Form.Label>
              <Col sm="10">              
                <input
                  className="form-control"
                  type="text"
                  id="displayName"
                  placeholder="Display Name"
                  name="displayName"
                  
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>                 
          </Form>
        </div>
        </Col>
      </Row>
      </div>
    );
  }
}

export default SuperAdmin;