import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import NavigationOverlay from './Navigation_overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut } from '../../store/store';
import { navigate, Link } from '@reach/router';
import { Modal, Button } from 'react-bootstrap'
import UnreadNewsBadge from './UnreadNewsBadge';
import EmailUs from '../EmailUs';
import Monogram from '../Monogram';

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      show:false
    }
  }
  handleClose = () => {this.setState({show: false})};
  handleShow = () => {this.setState({show: true})};
  
  logOutUser = (e) => {
    e.preventDefault ();
    this.props.dispatch(logUserOut())
    firebase.auth().signOut().then(() =>{
      navigate('/')
    });
  }

  render() {
    const { loggedIn, userImageURL, userName} = this.props;
    
    return (
      <nav className="site-nav family-sans navbar navbar-expand higher">
        <div className="container-fluid navigatorMenu">
          <Link to="/" className="navbar-brand">
            Team Arizona Outrigger Canoe Club
          </Link>
          <div className="navbar-nav ml-auto">
            {loggedIn && (<div className="nav-item"><UnreadNewsBadge /></div>)}
            
            <div className="nav-item">
              <Link className="nav_link titleHoverMessage" to="#" onClick={this.handleShow} title="Have a Question? Ask us!">
                Contact us
              </Link>
            </div>
            {!loggedIn && (
              <div className="nav-item">
                <Link className="nav_link titleHoverMessage" to="/login" title="Login to see your stats">
                  Login <FontAwesomeIcon icon="sign-in-alt"/>
                </Link>
              </div>
            )}            
            {loggedIn && (
              <div className="nav-item">
                <Link className="nav_link titleHoverMessage" to="/login" onClick={this.logOutUser} title="Logout">
                  Logout
                </Link>
              </div>
            )}
            <div className="mx-3">
              { (loggedIn) && (userImageURL) && (<div className="nav-item"><img src={userImageURL} className="userProfileIcon" /></div>)}
              { (loggedIn) && (!userImageURL) && (<Monogram name= {userName}/>)}
            </div>
          </div>
        </div>

        <NavigationOverlay />
        
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contact TAZ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EmailUs />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </nav>
    );
  }
}
const MapStateToProps = ({user})=>({
  loggedIn: user.userID || false,
  userName: user.userName || '',
  userImageURL: user.image || false
})

export default connect(MapStateToProps)(Navigation);