import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import firebase from '../Firebase';
import Swal from 'sweetalert2';

function mapStateToProps({paddlers}) {
  return {
    paddlers
  };
}

class EditRole extends React.Component {
  constructor (props) {
    super(props)
    this.state= {
      paddlerID:'0',
      role:'0'
    }
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }  
  setRole = () => {
    const dbUsers = firebase.database().ref(`users/${this.state.paddlerID}`);    
    dbUsers.update({
      role:this.state.role      
    }).then(()=>{
      Swal.fire({
        icon: 'success',
        title: "Success",
        text: "Role set!", 
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }                
      })      
    })
    .error((err)=>{
      console.log(err);
      
    })
  }

  render() {
    return (
        <div>
        <Form.Group className="border border-light rounded-lg mt-3 p-4 d-flex flex-column align-items-center justify-content-center ">
          <div className="mr-auto mb-2" style={fontSize_15}>Set user role</div>
          <Form.Control as="select" size="lg" value="0" name="paddlerID" value={this.state.paddlerID} style={fontSize_15} onChange={this.handleChange} >
            <option disabled value="0">-- select Paddler --</option>
            { this.props.paddlers.map((paddler, i)=>(
                <option key={i} value={paddler.uid} >{paddler.name}</option>
              ))
            }
          </Form.Control>
            <Form.Control as="select" size="lg" name="role" value={this.state.role} style={fontSize_15} onChange={this.handleChange} >
              <option disabled value="0">-- select Role --</option>
              <option value="superAdmin" >Super Admin</option>
              <option value="Admin" >Admin</option>
            </Form.Control> 
            {this.state.paddlerID!="0" && this.state.role!="0" && (<Button  size="lg" variant="success" onClick={ this.setRole } className="mt-4 col-6">Set Role</Button>)}
        </Form.Group>
        </div>
      )
    }

}
const fontSize_15 = {
  fontSize: '1.5rem'
}

export default connect(
  mapStateToProps,
)(EditRole);