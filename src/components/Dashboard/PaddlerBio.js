import React from 'react';
import { connect } from 'react-redux';
import { Card, Col, Image, Row, Form, Button, Accordion } from 'react-bootstrap';
import { dbAllPaddlers } from '../Firebase.js';
import { setSelectedPaddler, editSelectedPaddler } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import Search from "../Dashboard/Search";
import "react-datepicker/dist/react-datepicker.css";
import EditProfile from '../Auth/EditProfile';
import Monogram from '../Monogram';
import SCORA_INFO from './SCORA_INFO';

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
      oldSex: 'n/a',
      rotation:0
    }
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

    // write to firestore and update the current paddler's info
    dbAllPaddlers.doc(this.props.selectedPaddler.paddlerID)
      .set({
        ...this.props.selectedPaddler, 
        duesPaid:this.state.duesPaid,
        membershipType:this.state.membershipType,
        birthday:this.state.birthday,
        jerseySize:this.state.jerseySize,
        sex: this.state.sex      
      })
      .then(()=>{
          this.props.dispatch(setSelectedPaddler({
            ...this.props.selectedPaddler, 
            duesPaid:this.state.duesPaid,
            membershipType:this.state.membershipType,
            birthday:this.state.birthday,
            jerseySize:this.state.jerseySize,
            sex: this.state.sex       
          }
        ))
      })      
    
    //enable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(true))    
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
    const {paddlerName, role} = this.props.selectedPaddler
    return (
      <Accordion>
        <Card className="paddlerBio">
        <Accordion.Toggle as={Card.Title} eventKey="1" className="bg-sucess">              
          <Card.Title  className="bg-success text-white d-flex justify-content-start align-items-center m-0">
            <MonogramOrImage selectedPaddler={this.props.selectedPaddler} />
            <div className="ml-3">About {paddlerName}</div>
            <div className="ml-auto d-flex align-items-center">
              <Search />
              <EditProfile />
              <Button className="bg-transparent border-0" onClick={this.rotate}>
                <FontAwesomeIcon icon="angle-up" className="fa-2x text-white bg-transparent" style={{transform: `rotate(${this.state.rotation}deg)`}}/>                  
              </Button>           
            </div>
          </Card.Title>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='1'>
            <Card.Body>
              {!this.state.showEditable && (<NonEditableBio selectedPaddler={this.props.selectedPaddler} />)}         
              <SCORA_INFO />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
  )}
}

const MonogramOrImage = ({selectedPaddler}) =>(
  <div>
    {!selectedPaddler.image && (<Monogram name={selectedPaddler.paddlerName || ''} />)}   
    {selectedPaddler.image && (<div><Image src={selectedPaddler.image} fluid roundedCircle style={{width:"75px"}}/></div>)}
  </div>
)
const NonEditableBio = ({selectedPaddler}) =>(
  <div className="nonEditableBio p-4">
    <Row>
      <Col lg={4} xs={12}>
        <table>
          <tbody>
            <tr>
              <td><p>{`Dues Paid for ${moment().format('YYYY')}:`}</p></td>
              <td>
                {selectedPaddler.duesPaid && ('Yes') }
                {!selectedPaddler.duesPaid && <span className="text-danger font-weight-bold">NO</span> }
              </td>
            </tr>
            <tr>
              <td>
                <b>Membership Type:</b>
              </td>
              <td>
                <span>{selectedPaddler.membershipType || 'n/a'}</span> 
              </td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col lg={4} xs={12}>
        <table>
          <tbody>
            <tr>
              <td>
                <b>Display Name:</b>
              </td>
              <td>
                {selectedPaddler.paddlerName}
              </td>
            </tr>
            <tr>
              <td>
                <b>Age:</b>
              </td>
              <td>
                {selectedPaddler.birthday && (<span name="age">{`${moment().diff(selectedPaddler.birthday, 'years')},  ${moment(selectedPaddler.birthday).format('MMM YYYY')}`} </span>)}
                {!selectedPaddler.birthday && (<span>no birthday assigned yet</span>)}
              </td>                      
            </tr>
            <tr>
              <td>
                <b>Jersey size:</b>
              </td>
              <td>
                {selectedPaddler.jerseySize || 'n/a'}
              </td>
            </tr>
            <tr>
              <td>
                <b>Sex:</b>
              </td>
              <td>
                {selectedPaddler.sex || 'no sex assigned yet'}
              </td>
            </tr>
          </tbody>
        </table>                 
      </Col>
      <Col lg={4} xs={12}>
        <table>
          <tbody>
            <tr>
              <td><p>Emergency Contact</p></td>
              <td>
                {selectedPaddler.contactName || 'n/a'}
              </td>
            </tr>
            <tr>
              <td>
                <b>Emergency Contact Number:</b>
              </td>
              <td>
                <span>{selectedPaddler.contactNumber || 'n/a'}</span> 
              </td>
            </tr>
          </tbody>
        </table>        
      </Col>                              
    </Row>
  </div>
)
const MapStateToProps = ({selectedPaddler}) => ({
  selectedPaddler
})
export default connect(MapStateToProps)(PaddlerBio)

