
import React, { Component } from 'react';
import firebase, { GoogleProvider, FBProvider } from '../Firebase';
import { connect } from 'react-redux';
import {Row, Col} from 'react-bootstrap';
import { setUserName, setUserID, setUserImage } from '../../store/store';
import { navigate, Link } from '@reach/router';
import Swal from 'sweetalert2';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      goToRegister: false,
      goToDashboard: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
  }

  addUserToFirebaseUsersDb = (user) => {    
    const dbUsers = firebase.database().ref(`users/${user.uid}`);
    dbUsers.set({
      name:user.displayName,
      loggedInWith:user.providerData[0].providerId,
      email:user.providerData[0].email,
      uid:user.uid,
      image:user.photoURL
    })
  }
  signInWithGoogle = () => {
    firebase
    .auth()
    .signInWithPopup(GoogleProvider)
    .then((FBUser)=>{
      this.addUserToFirebaseUsersDb(FBUser.user)
      navigate('/dashboard');
    })
    .catch(error => {
      if (error.message !== null) {
        this.setState({ errorMessage: error.message });
        Swal.fire({
          icon: 'error',
          title: "Oops...",
          text: this.state.errorMessage,
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
  signInWithFacebook = () => {
    firebase
    .auth()
    .signInWithPopup(FBProvider)
    .then((FBUser)=>{   
      this.addUserToFirebaseUsersDb(FBUser.user)

      navigate('/dashboard');
    })
    .catch(error => {
      if (error.message !== null) {
        this.setState({ errorMessage: error.message });
        Swal.fire({
          icon: 'error',
          title: "Oops...",
          text: this.state.errorMessage,
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
  handleSubmit(e) {
    var registrationInfo = {
      email: this.state.email,
      password: this.state.password
    };
    e.preventDefault();

    // login, set the store with the user info and navigate to the dashboard page
    firebase
      .auth()
      .signInWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      )
      .then((FBUser) => {
        const {uid, displayName} = FBUser;
        this.addUserToFirebaseUsersDb(FBUser.user)
        this.props.dispatch(setUserID(uid));
        this.props.dispatch(setUserName(displayName));

        navigate('/dashboard')
      })
      .catch(error => {
        if (error.message !== null) {
          this.setState({ errorMessage: error.message });
          Swal.fire({
            icon: 'error',
            title: "Oops...",
            text: this.state.errorMessage,
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
  handleGoToRegister = () => {
    navigate('/register')
  }

  render() {
    return (
        <div style={formStyle}>
          <form className="mt-3" onSubmit={this.handleSubmit} style={{width:'100%'}}>
            <div className="container">
              <div className="row justify-content-center w-100">
                <div className="col-lg-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h3 className="font-weight-light mb-3">Log in</h3>
                      <section className="form-group">
                        <label
                          className="form-control-label sr-only"
                          htmlFor="Email"
                        >
                          Email
                        </label>
                        <input
                          required
                          className="form-control"
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Email"
                          value={this.state.email}
                          onChange={this.handleChange}
                        />
                      </section>
                      <section className="form-group">
                        <input
                          required
                          className="form-control"
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.handleChange}
                        />
                      </section>
                      <section className="form-group">
                        <div className="form-group text-center py-3">
                          <button className="btn btn-primary" type="submit">
                            Log in
                          </button>
                          
                        </div>
                      </section>
                      <section className="form-group">
                        <div className="text-right">no account? <Link to="/register">Register</Link> </div>
                      </section>
                    </div>
                  </div>
                </div>
                
                </div>
            </div>
          </form>
          <Row className="mt-4 p-4">
            <button className="btn btn-success" onClick={this.signInWithGoogle} >Sign with Google</button>
            <button className="btn btn-primary" onClick={this.signInWithFacebook} >Sign with Facebook</button>
          </Row>
        </div>
      );
  }
}

export default connect ()(Login);
const formStyle = {
  height: '100vh',
  display:'flex',
  alignItems:'center',
  flexDirection:'column',
  justifyContent:'center'
}
