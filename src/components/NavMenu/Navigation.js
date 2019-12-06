import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import UnreadNewsBadge from './UnreadNewsBadge';
import NavigationOverlay from './Navigation_overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut } from '../../store/store';
import { navigate, Link } from '@reach/router';
import { Modal, Button } from 'react-bootstrap'
import EmailUs from '../EmailUs';

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
    const { loggedIn, userName } = this.props;
    
    return (
      <nav className="site-nav family-sans navbar navbar-expand higher">
        <div className="container-fluid navigatorMenu">
          <Link to="/" className="navbar-brand">
            Team Arizona Outrigger Canoe Club
          </Link>
          <div className="navbar-nav ml-auto">
            { (loggedIn) && (<div className="welcomeUser">Welcome {userName}</div>) }
            {!loggedIn && (
              <Link className="nav_link" to="/login" title="Login to see your stats">
                Login <FontAwesomeIcon icon="sign-in-alt"/>
              </Link>
            )}
            {loggedIn && <UnreadNewsBadge />}
            <Link className="nav_link" to="#" onClick={this.handleShow}>
              Contact us
            </Link>
            {loggedIn && (
              <Link className="nav_link titleHoverMessage" to="/login" onClick={e => this.logOutUser(e)} title="Logout">
              <FontAwesomeIcon icon="sign-out-alt"/>
              </Link>
            )}
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
  userName: user.userName || ''
})

export default connect(MapStateToProps)(Navigation);