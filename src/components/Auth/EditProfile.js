import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Form, Col, Row, Button, Modal } from 'react-bootstrap';
import firebase, { dbAllPaddlers } from '../Firebase';
import { setSelectedPaddler, updateSelectedPaddler, updatePaddler, updateUser } from '../../store/store';
import Swal from 'sweetalert2';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function mapStateToProps({user, selectedPaddler}) {  
  return {
    user, selectedPaddler
  };
}

class EditProfile extends Component {
  constructor(props){
    super(props);
    this.state={
      displayName:'',
      duesPaid:false,
      membershipType:'n/a',
      birthday:0,
      jerseySize:'',
      sex:'wahine',
      paddlerPhone:'',
      contactName:'',
      contactNumber:'',
      showModal:false,
      showSave:false,
      showCancel:false
    }
  }

  handleEdit = () => {
    this.setState({
      displayName:this.props.selectedPaddler.paddlerName || '',
      birthday:this.props.selectedPaddler.birthday || Date(),
      duesPaid:this.props.selectedPaddler.duesPaid || false,
      membershipType:this.props.selectedPaddler.membershipType || '',
      jerseySize:this.props.selectedPaddler.jerseySize || '',
      sex:this.props.selectedPaddler.sex || '',
      paddlerPhone: this.props.selectedPaddler.paddlerPhone || '',
      contactName:this.props.selectedPaddler.contactName || '',
      contactNumber:this.props.selectedPaddler.contactNumber||'',      
      showModal:true
    })
  }
  handleOnChange = (e) => {    
    this.setState({[e.target.name]:e.target.value, showSave:true, showCancel:true});    
  }
  handleChangeChecked = (e) => {
    this.setState({[e.target.name]: e.target.checked, showSave:true, showCancel:true })
  }  
  handleCancel = () =>{
    this.setState({
        "displayName": "",
        "showModal": true,
        "duesPaid": false,
        "membershipType": "n/a",
        "birthday": 0,
        "jerseySize": "",
        "sex": "wahine",
        "contactName": "",
        "contactNumber": "",
        "showSave": false,
        "showCancel": false,
        "showModal":false    
    })
  }
  handleSave = () => {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName:this.state.displayName
    })

    dbAllPaddlers.doc(this.props.selectedPaddler.paddlerID).update({
      paddlerName:this.state.displayName,
      birthday:this.state.birthday,
      jerseySize:this.state.jerseySize,
      sex:this.state.sex,
      paddlerPhone: this.state.paddlerPhone,
      contactName:this.state.contactName,
      contactNumber:this.state.contactNumber      
    }).then(()=>{
      const currPaddler = {
        ...this.props.selectedPaddler,
        paddlerName:this.state.displayName,
        birthday:this.state.birthday,
        jerseySize:this.state.jerseySize,
        sex:this.state.sex,
        paddlerPhone: this.state.paddlerPhone,
        contactName:this.state.contactName,
        contactNumber:this.state.contactNumber }
      this.props.dispatch(updateSelectedPaddler(currPaddler))
      if (this.props.location=="admin")
        this.props.dispatch(updatePaddler(currPaddler))
      if (this.props.location!="admin")
        this.props.dispatch(updateUser(currPaddler))
    }).then(()=>{
      Swal.fire({
        title:'success',
        icon:'success',
        text:'proifle updated!',
        timer:1000
      })
    })
    this.setState({showModal:false})
  }

  handleCalendarChange = date => {
    this.setState({ birthday:date.valueOf(), showSave:true, showCancel:true});
  }

  render() {
    return (
      <div>

        <Button variant="dark" onClick={()=>this.handleEdit()} className="bg-transparent text-dark border-0 d-flex align-items-center">
          <h4>Settings</h4>
          <FontAwesomeIcon icon="cog" className="ml-2 fa-2x"/>
        </Button>
        { this.props.location=="overlay" && this.props.user.paddlerID &&  <span onClick={()=>this.handleEdit()}>PROFILE SETTINGS</span>}
        <Modal centered show={this.state.showModal} onHide={()=>{this.setState({showModal:false})}} className="editProfile">
          <Modal.Title className="px-2 bg-success text-white d-flex justify-content-start align-items-center">
            <h2>Edit Profile</h2>
            <div className="ml-auto">
              {this.state.showSave && <Button className="bg-transparent border-0 mr-1" onClick={()=>this.handleSave()}><FontAwesomeIcon icon="save" className="fa-2x text-danger"/></Button>}
              <Button className="bg-transparent border-0" onClick={()=>this.handleCancel()}><FontAwesomeIcon icon="window-close" className="fa-2x text-white"/></Button>
            </div>
            </Modal.Title>
          <Modal.Body className="text-dark p-3">
          <EditableBio 
            admin={this.props.user.role=="admin" || this.props.user.role=="superAdmin"} state = {this.state}            
            selectedPaddler={this.props.selectedPaddler} handleOnChange={this.handleOnChange} handleChangeChecked={this.handleChangeChecked}
            handleCalendarChange={this.handleCalendarChange} />         
          </Modal.Body>
        </Modal>
      </div>

    );
  }
}

const EditableBio = ({admin, state, selectedPaddler, handleOnChange, handleChangeChecked, handleCalendarChange}) => (
  <Row className="px-4">
    {admin &&
    <Col lg={6} md={12} className="d-flex justify-content-center border border-success p-4">
      <table>
        <tbody>
          <tr>
            <td>
              Dues Paid for {moment().format('YYYY')}
            </td>
            <td>
              <input type="checkbox" className="form-check-input" name="duesPaid" checked={state.duesPaid} onChange={handleChangeChecked} defaultValue={selectedPaddler.duesPaid}/>
            </td>              
          </tr>
          <tr>
            <td>
              Membership Type:
            </td>
            <td>
              <Form.Group id="membershipType">
                <Form.Control as="select" size="lg" name="membershipType" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.meme}>
                  <option disabled value='n/a'>-- select membershipType --</option>
                  <option value='single'>single</option>
                  <option value='family'>family</option>   
                  <option value='student'>student</option>                                          
                </Form.Control>
              </Form.Group> 
            </td>
          </tr>
        </tbody>
      </table>
    </Col>}
    <Col lg={6} md={12} className="d-flex justify-content-center border border-success p-4">
      <table>
        <tbody>
          <tr>
            <td>
              Display Name:
            </td>
            <td>
              <input type="text" name="displayName" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.paddlerName} style={{width:'100%'}}>                                                              
              </input> 
            </td>
          </tr>
          <tr>
            <td>
              birthday:
            </td>
            <td>
              <DatePicker
                selected={new Date(state.birthday)}
                onChange={handleCalendarChange}
              />
            </td>              
          </tr>
          <tr>
            <td>
              jersey size:
            </td>
            <td>
              <Form.Group id="jerseySize">
                <Form.Control as="select" size="lg" name="jerseySize" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.jerseySize}>
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
            </td>              
          </tr>            
          <tr>
            <td>
              sex:
            </td>
            <td>
              <Form.Control as="select" size="lg" name="sex" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.sex || "n/a"}>
                <option disabled value='n/a'>-- select sex --</option>
                <option value='wahine'>wahine</option>
                <option value='kane'>kane</option>   
                <option value='keiki wahine'>keiki wahine</option> 
                <option value='keiki kane'>keiki kane</option>                                                                
              </Form.Control>              
            </td>              
          </tr>
        </tbody>
      </table>                 
    </Col>                            
    <Col lg={6} md={12} className="d-flex justify-content-center border border-success p-4">
      <table>
        <tbody>
          <tr>
            <td>
              Paddler Phone:
            </td>
            <td>
            <input type="text" name="paddlerPhone" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.paddlerPhone} style={{width:'100%'}}>                                                              
            </input>              
            </td>              
          </tr>          
          <tr>
            <td>
              Emergency Contact Name:
            </td>
            <td>
              <input type="text" name="contactName" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.contactName} style={{width:'100%'}}>                                                              
              </input>              
            </td>              
          </tr>
          <tr>
            <td>
              Emergency Contact's Number:
            </td>
            <td>
            <input type="text" name="contactNumber" onChange={handleOnChange} style={formStyle} defaultValue={selectedPaddler.contactNumber} style={{width:'100%'}}>                                                              
            </input>              
            </td>              
          </tr>          
                
          </tbody>
      </table>    
    </Col>
  </Row>  
)
const formStyle = {
  fontSize:'1.5rem'
}
export default connect(
  mapStateToProps,
)(EditProfile);