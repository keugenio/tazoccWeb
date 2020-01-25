import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Row, Col, Image, Form } from 'react-bootstrap';
import { dbAllPaddlers } from '../Firebase.js';
import { setSelectedPaddler, editSelectedPaddler } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditProfile from '../Auth/EditProfile';
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
      <Card className="paddlerBio">
        <Card.Title  className="bg-success text-white d-flex justify-content-between">
          <div>About {paddlerName}</div>
          {!role && (<EditProfile />) }
          {((role=="admin") || (role=="superAdmin")) && (<div>
            {this.state.showEditable && (<Button onClick={this.toggleSave} className="btn-danger" ><FontAwesomeIcon icon="save" /></Button>)}
            {this.props.selectedPaddler && !this.state.showEditable && (<Button onClick={this.toggleEdit} className={this.state.showEdit}><FontAwesomeIcon icon="edit"/></Button>) }
            {this.state.showEditable && (<Button onClick={this.toggleCancel} className="btn-dark" >x</Button>)}               
          </div>)}
        </Card.Title>
        <Card.Body>
          {!this.state.showEditable && (<NonEditableBio selectedPaddler={this.props.selectedPaddler} />)}
          {this.state.showEditable && (
            <EditableBio
              state={this.state}
              handleChange={this.handleChange}
              handleChangeChecked={this.handleChangeChecked}
              handleCalendarChange={this.handleCalendarChange} />)}          
        </Card.Body>
      </Card>
  )}
}

const NonEditableBio = ({selectedPaddler}) =>(
  <div className="nonEditableBio">
    <Row>
      <Col lg={4} xs={12} className="flex-row text-dark">
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
      <Col lg={4} xs={12} className="flex-row">
        <table>
          <tbody>
            <tr>
              <td>
                <b>age:</b>
              </td>
              <td>
                {selectedPaddler.birthday && (<span name="age">{`${moment().diff(selectedPaddler.birthday, 'years')},  ${moment(selectedPaddler.birthday).format('MMM YYYY')}`} </span>)}
                {!selectedPaddler.birthday && (<span>no birthday assigned yet</span>)}
              </td>                      
            </tr>
            <tr>
              <td>
                <b>jersey size:</b>
              </td>
              <td>
                {selectedPaddler.jerseySize || 'n/a'}
              </td>
            </tr>
            <tr>
              <td>
                <b>sex:</b>
              </td>
              <td>
                {selectedPaddler.sex || 'no sex assigned yet'}
              </td>
            </tr>
          </tbody>
        </table>                 
      </Col>
      <Col lg={4} xs={12} className="paddlerImage">
          {selectedPaddler.image && (<div><Image src={selectedPaddler.image} fluid roundedCircle style={{width:"75px"}}/></div>)}
          {!selectedPaddler.image && (<Monogram name={selectedPaddler.paddlerName || ''} />)} 
      </Col>                               
    </Row>
  </div>
)
const EditableBio = ({state, handleChange, handleChangeChecked, handleCalendarChange}) => (
    <Row>
      <Col lg={4} md={12} className="flex-row">
        <table>
          <tbody>
            <tr>
              <td>
                Dues Paid for {moment().format('YYYY')}
              </td>
              <td>
                <input type="checkbox" className="form-check-input" name="duesPaid" checked={state.duesPaid} onChange={handleChangeChecked}/>
              </td>              
            </tr>
            <tr>
              <td>
                Membership Type:
              </td>
              <td>
                <Form.Group id="membershipType">
                  <Form.Control as="select" size="lg" name="membershipType" onChange={handleChange} style={formStyle} defaultValue={state.membershipType}>
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
      </Col>
      <Col lg={4} md={12} className="flex-row">
        <table>
          <tbody>
            <tr>
              <td>
                birthday:
              </td>
              <td>
                <DatePicker
                  value={state.birthday}
                  selected={state.birthday}
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
                  <Form.Control as="select" size="lg" name="jerseySize" onChange={handleChange} style={formStyle} defaultValue={state.jerseySize}>
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
          </tbody>
        </table>                 
      </Col>
      <Col lg={4} md={12} className="flex-row">
        <table>
          <tbody>
            <tr>
              <td>
                sex:
              </td>
              <td>
                <Form.Control as="select" size="lg" name="sex" onChange={handleChange} style={formStyle} defaultValue={state.sex}>
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
    </Row>  
)
const MapStateToProps = ({selectedPaddler}) => ({
  selectedPaddler
})
export default connect(MapStateToProps)(PaddlerBio)

const formStyle = {
  fontSize: '1.5rem'
}