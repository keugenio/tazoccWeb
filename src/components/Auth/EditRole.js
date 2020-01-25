import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { dbAllPaddlers } from '../Firebase';
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
    dbAllPaddlers.doc(this.state.paddlerID).update({
      role:this.state.role      
    })
      .then(()=>{
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
      .then(()=>{
        this.setState({paddlerID:'0', role:'0'})
      })
      .catch((err)=>{
        console.log(err);
        
      })
  }

  render() {
    return (
        <Form.Group className="border border-light rounded-lg w-100 p-4 d-flex flex-column align-items-center justify-content-center ">
          <div className="mr-auto mb-2 text-light" style={fontSize_15}>Set a user's role</div>
          <Form.Control as="select" size="lg" value="0" name="paddlerID" value={this.state.paddlerID} style={fontSize_15} onChange={this.handleChange} >
            <option disabled value="0">-- select Paddler --</option>
            { this.props.paddlers.map((paddler, i)=>(
                <option key={i} value={paddler.paddlerID} >{paddler.paddlerName}</option>
              ))
            }
          </Form.Control>
          <Form.Control as="select" size="lg" name="role" value={this.state.role} style={fontSize_15} onChange={this.handleChange} >
            <option disabled value="0">-- select Role --</option>
            <option value="user">User</option>
            <option value="superAdmin" >Super Admin</option>
            <option value="admin" >Admin</option>
          </Form.Control> 
          {this.state.paddlerID!="0" && this.state.role!="0" && (<Button  size="lg" variant="success" onClick={ this.setRole } className="mt-4 col-6">Set Role</Button>)}
        </Form.Group>
      )
    }

}
const fontSize_15 = {
  fontSize: '1.5rem'
}

export default connect(
  mapStateToProps,
)(EditRole);