
import React, { Component } from 'react';
import firebase, { GoogleProvider, FBProvider } from '../Firebase';
import { connect } from 'react-redux';
import {Row, Col, Card} from 'react-bootstrap';
//import { setUserName, setUserID, setUserImage, setRacesPaddlerSignedUpFor } from '../../store/store';
import { navigate, Link } from '@reach/router';
import Swal from 'sweetalert2';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null
    };
  }

  handleChange = (e) => {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue });
  }

  updateUserImage = (user) => {    
    const dbUsers = firebase.database().ref(`users/${user.uid}`);
    dbUsers.update({
      image:user.photoURL
    })
  }

  signInWithGoogle = () => {
    firebase
    .auth()
    .signInWithPopup(GoogleProvider)
    .then((FBUser)=>{
      this.updateUserImage(FBUser.user);
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
      this.updateUserImage(FBUser.user)
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
  signInWithEmail = (e) => {
    e.preventDefault();
    var registrationInfo = {
      email: this.state.email,
      password: this.state.password
    };

    // login, set the store with the user info and navigate to the dashboard page
    firebase
      .auth()
      .signInWithEmailAndPassword(
        registrationInfo.email,
        registrationInfo.password
      )
      .then(()=>{
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
        <div className="login">
          <form className="mt-3" onSubmit={this.signInWithEmail} >
            <Card className="bg-white-3">
              <Card.Body>
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
                    <button className="btn btn-lg btn-warning" type="submit">
                      Log in
                    </button>
                    
                  </div>
                </section>
                <section className="form-group">
                  <div className="text-center">no account? <Link to="/register">Register</Link> </div>
                </section>
              </Card.Body>
            </Card>
          </form>            

          <Row className="mt-4 p-4">
            <button className="btn btn-lg btn-success" onClick={this.signInWithGoogle} >Sign with Google</button>
            <button className="btn btn-lg btn-primary" onClick={this.signInWithFacebook} >Sign with Facebook</button>
          </Row>
        </div>
      );
  }
}
const MapStateToProps=({user}) => ({
  user
})

export default connect (MapStateToProps)(Login);
