import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Row, Col, Image, Form } from 'react-bootstrap';
import firebase from '../Firebase.js';
import { setSelectedPaddler, editSelectedPaddler } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Monogram from '../Monogram';

class PaddlerBio extends React.Component{
  constructor(props) {
    super(props)
    this.state={
      showEditable:false,
      duesPaid:false,
      membershipType:'n/a',
      birthday: new Date(),
      jerseySize:'n/a',
      sex: 'n/a',
      oldDuesPaid:false,
      oldMembershipType:'n/a',
      oldJerseySize:'n/a',
      oldBirthday: new Date(),
      oldSex: 'n/a'
    }
  }
  componentDidMount(){

  }
  toggleEdit = () => {
    //display the editable fields
    this.setState({showEditable:true})
    // write the current values of the selected Paddler into state to update form
    const {duesPaid, membershipType, birthday, jerseySize, sex} = this.props.selectedPaddler;
    this.setState({
      duesPaid:duesPaid || false, membershipType: membershipType || 'n/a', jerseySize: jerseySize || 'n/a', birthday: birthday | moment().format('YYYY-MM-DD'), sex: sex || 'n/a',
      oldDuesPaid:duesPaid || false, oldmembershipType:membershipType || 'n/a', oldJerseySize: jerseySize || 'n/a', oldBirthday:birthday || moment().format('YYYY-MM-DD'), oldSex:sex|| 'n/a' })

    //disable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(false))
  } 
  toggleCancel = () => {
    // hide editable fields
    this.setState({showEditable:false})

    //enable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(true))    
  }
  toggleSave = () => {
    //hide editable fields
    this.setState({showEditable:false})

    console.log(this.state.birthday);
    
    // write data to firebase and update store
    const dbUsers = firebase.database().ref(`users/${this.props.selectedPaddler.uid}`);    
    dbUsers.set({
      ...this.props.selectedPaddler, 
      duesPaid:this.state.duesPaid,
      membershipType:this.state.membershipType,
      birthday:this.state.birthday,
      jerseySize:this.state.jerseySize,
      sex: this.state.sex      
    }) 

    // update the selected paddlers info in the store from the database
    dbUsers.once('value').then((snapshot) => {
      this.props.dispatch(setSelectedPaddler(snapshot.val()));      
    });

    //enable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(true))    
  }

  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked })
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value })
  }  
  handleCalendarChange = date => {
    this.setState({ birthday:date.valueOf() });
  }    

  render (){
    return (
      <Card className="paddlerBio">
        <Card.Title  className="bg-success text-white d-flex justify-content-between">
          <div>About {this.props.selectedPaddler.name}</div>
          <div>
            {this.state.showEditable && (<Button onClick={this.toggleSave} className="btn-danger" ><FontAwesomeIcon icon="save" /></Button>)}
            {this.props.selectedPaddler && !this.state.showEditable && (<Button onClick={this.toggleEdit} className={this.state.showEdit}><FontAwesomeIcon icon="edit"/></Button>) }
            {this.state.showEditable && (<Button onClick={this.toggleCancel} className="btn-dark" >x</Button>)}               
          </div>
        </Card.Title>
        <Card.Body>
          {!this.state.showEditable && (
            <div>
              <Row>
                <Col lg={4} xs={12} className="flex-row text-dark">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="duesPaid">Dues Paid for {moment().format('YYYY')}</label>
                    <span>
                      {this.props.selectedPaddler.duesPaid && <span>Yes</span> }
                      {!this.props.selectedPaddler.duesPaid && <span className="text-danger font-weight-bold">NO</span> }
                    </span>
                  </div> 
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="membershipType">Membership Type:</label>
                    <span name="membershipType">{this.props.selectedPaddler.membershipType || 'n/a'}</span>                  
                  </div>
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="age">age:</label>
                    {this.props.selectedPaddler.birthday && (<span name="age">{`${moment().diff(this.props.selectedPaddler.birthday, 'years')},  ${moment(this.props.selectedPaddler.birthday).format('MMM YYYY')}`} </span>)}
                    {!this.props.selectedPaddler.birthday && (<span>no birthday assigned yet</span>)}
                  </div>                
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="jerseySize">jersey size:</label>
                    <div name="jerseySize">{this.props.selectedPaddler.jerseySize || 'n/a'}</div>
                  </div>                  
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    {this.props.selectedPaddler.image && (<div><Image src={this.props.selectedPaddler.image} fluid roundedCircle style={{width:"75px"}}/></div>)}
                    {!this.props.selectedPaddler.image && (<Monogram name={this.props.selectedPaddler.name} />)}
                    <div className="ml-4">{this.props.selectedPaddler.sex || 'no sex assigned yet'}</div>
                  </div>  
                </Col>                             
              </Row>
            </div>
          )}
          {this.state.showEditable && (
            <div>
              <Row>
                <Col lg={4} xs={12} className="flex-row text-dark">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="duesPaid">Dues Paid for {moment().format('YYYY')}</label>
                    <span>
                      <input type="checkbox" className="form-check-input" name="duesPaid" checked={this.state.duesPaid} onChange={this.handleChangeChecked}/>
                    </span>
                  </div> 
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="membershipType">Membership Type:</label>
                    <Form.Group id="membershipType">
                      <Form.Control as="select" size="lg" name="membershipType" onChange={this.handleChange} style={formStyle} defaultValue={this.state.membershipType}>
                        <option disabled value='n/a'>-- select membershipType --</option>
                        <option value='single'>single</option>
                        <option value='family'>family</option>   
                        <option value='student'>student</option>                                          
                      </Form.Control>
                  </Form.Group>                 
                  </div>
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="age">birthday:</label>
                    <DatePicker
                      value={this.state.birthday}
                      selected={this.state.birthday}
                      onChange={this.handleCalendarChange}
                    />
                  </div>                
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="jerseySize">jersey size:</label>
                    <Form.Group id="jerseySize">
                      <Form.Control as="select" size="lg" name="jerseySize" onChange={this.handleChange} style={formStyle} defaultValue={this.state.jerseySize}>
                        <option disabled value='n/a'>-- select jerseySize --</option>
                        <option value='women small'>women small</option>
                        <option value='women medium'>women medium</option>   
                        <option value='women large'>women large</option>  
                        <option value='women xl'>women xl</option>  
                        <option value='men small'>men small</option>
                        <option value='men medium'>men medium</option>   
                        <option value='men large'>men large</option>  
                        <option value='men xl'>men xl</option>  
                        <option value='men xxl'>men xxl</option> 
                      </Form.Control>
                  </Form.Group>
                  </div>                  
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    {this.props.selectedPaddler.image && (<div><Image src={this.props.selectedPaddler.image} fluid roundedCircle style={{width:"75px"}}/></div>)}
                    {!this.props.selectedPaddler.image && (<Monogram name={this.props.selectedPaddler.name} />)}
                    <Form.Control as="select" size="lg" name="sex" onChange={this.handleChange} style={formStyle} defaultValue={this.state.sex}>
                      <option disabled value='n/a'>-- select sex --</option>
                      <option value='wahine'>wahine</option>
                      <option value='kane'>kane</option>   
                      <option value='keiki'>keiki wahine</option> 
                      <option value='keiki'>keiki kane</option>                                                                
                    </Form.Control>                    
                  </div>  
                </Col>                             
              </Row>
            </div>
          )}          
        </Card.Body>
      </Card>
  )}
}

const MapStateToProps = ({selectedPaddler}) => ({
  selectedPaddler
})
export default connect(MapStateToProps)(PaddlerBio)

const formStyle = {
  fontSize: '1.5rem'
}