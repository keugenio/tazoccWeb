import React, { Component } from 'react';
import { connect } from 'react-redux'
import Swal from 'sweetalert2';
import firebase from '../Firebase';
import {setUserName, setUserID} from '../../store/store';
import { navigate } from '@reach/router';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      passOne: '',
      passTwo: '',
      errorMessage: null,
      toDashboard: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
  }

  handleSubmit(e) {
      e.preventDefault();
      //check that the passwords tried are the same.  If so, then create account, set the user to the store and navigate to the Dashboard
      if (this.state.passOne !== this.state.passTwo) {
        Swal.fire({
          icon: 'error',
          title: "Oops...",
          text: "the passwords do not match",
          confirmButtonText: 'OK',
          showClass: {
            popup: 'animated fadeInDown faster'
          },
          hideClass: {
            popup: 'animated fadeOutUp faster'
          }
                  
        })   
      } else {
        var registrationInfo = {
          displayName: this.state.displayName,
          email: this.state.email,
          password: this.state.passOne
        };
        
        // to register with firebase, use the email and password THEN you add the displayName
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            registrationInfo.email,
            registrationInfo.password
          )
          .then(() => {
            this.updateDisplayNameAndSetStore(registrationInfo.displayName);
            // have user login again to update the users table
            Swal.fire({
              icon: 'success',
              title: 'Your account has been created! Please login now.',
              showConfirmButton: false,
              timer: 1500
            }) 
            navigate ('/login');
          })
          .catch(error => {
            if (error.message !== null) {
              Swal.fire({
                icon: 'error',
                title: "Oops...",
                text: error.message,
                confirmButtonText: 'OK',
                showClass: {
                  popup: 'animated fadeInDown faster'
                },
                hideClass: {
                  popup: 'animated fadeOutUp faster'
                }
                        
              })  
            } else {
              this.setState({ errorMessage: null });
            }
          });
      } 
  }

  // when someone registers, add display name on that user's profile. the registration form uses email and password but passes you back the userName to set here
  updateDisplayNameAndSetStore = userName => {
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName,
        role:{author:false, editor:false}
      }).then (()=>{
        const newUser = {displayName: FBUser.displayName,userID: FBUser.uid}
        
        this.props.dispatch(setUserName(newUser.displayName));
        this.props.dispatch(setUserID(newUser.userID));
      })
    })
  }

  render() {
    return (
      <div style={formStyle}>
        <form className="mt-3" onSubmit={this.handleSubmit} style={{width:'100%'}}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card bg-light">
                  <div className="card-body">
                    <h3 className="font-weight-light mb-3">Register</h3>
                    <div className="form-row">
                      <section className="col-sm-12 form-group">
                        <label
                          className="form-control-label sr-only"
                          htmlFor="displayName"
                        >
                          Display Name
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          id="displayName"
                          placeholder="Display Name"
                          name="displayName"
                          required
                          value={this.state.displayName}
                          onChange={this.handleChange}
                        />
                      </section>
                    </div>
                    <section className="form-group">
                      <label
                        className="form-control-label sr-only"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        required
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                    </section>
                    <div className="form-row">
                      <section className="col-sm-6 form-group">
                        <input
                          className="form-control"
                          type="password"
                          name="passOne"
                          placeholder="Password"
                          value={this.state.passOne}
                          onChange={this.handleChange}
                        />
                      </section>
                      <section className="col-sm-6 form-group">
                        <input
                          className="form-control"
                          type="password"
                          required
                          name="passTwo"
                          placeholder="Repeat Password"
                          value={this.state.passTwo}
                          onChange={this.handleChange}
                        />
                      </section>
                    </div>
                    <div className="form-group text-right mb-0">
                      <button className="btn btn-primary" type="submit">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect ()(Register);
const formStyle = {
  height: '100vh',
  display:'flex',
  alignItems:'center'
}