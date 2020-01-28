import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import NavigationOverlay from './Navigation_overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut, clearRacesPaddlerSignedUpFor, clearAllRaces, clearSelectedPaddler } from '../../store/store';
import { navigate, Link } from '@reach/router';
import { Modal, Button, Navbar, NavDropdown } from 'react-bootstrap'
import UnreadNewsBadge from './UnreadNewsBadge';
import EmailUs from '../EmailUs';
import Monogram from '../Monogram';
import EditProfile from '../Auth/EditProfile';

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      show:false
    }
  }
  handleClose = () => {this.setState({show: false})};
  handleShow = () => {this.setState({show: true})};
  
  logOutUser = () => {
    //clear the user and his/her races from store, logout from firebase
    this.props.dispatch(logUserOut());
    this.props.dispatch(clearRacesPaddlerSignedUpFor());
    this.props.dispatch(clearAllRaces());
    this.props.dispatch(clearSelectedPaddler());
    firebase.auth().signOut()
    .then(() =>{
      navigate('/login')
    })
  }

  render() {
    const { loggedIn, userImageURL, userName} = this.props;   
    return (
      <nav className="site-nav family-sans navbar navbar-expand higher">
        <div className="navigatorMenu d-flex align-items-center justify-content-start">
        
          <div className="d-flex">
            <Link to="/" className="navbar-brand">
              Team Arizona Outrigger Canoe Club
            </Link>
          </div>
          <div className="navbar-nav ml-auto">
            {/*loggedIn && (<div className="nav-item"><UnreadNewsBadge /></div>)*/}
            
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
            {loggedIn && (<div className="nav-item d-flex flex-row">
              <Navbar expand="lg" bg="transparent">
                <NavDropdown
                  className="border-0" 
                  title={(loggedIn) && (userImageURL) ? 
                  (<img src={userImageURL} className="userProfileIcon" />) :
                  (<span><Monogram name= {userName}/></span>) }
                  id="basic-nav-dropdown">
                  <NavDropdown.Item>
                  <div className="titleHoverMessage text-dark  bg-white border-0 d-flex align-items-center" title="Edit Profile">
                    <EditProfile title="Settings"/>
                  </div>                                    
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Button className="nav_link titleHoverMessage text-dark bg-white border-0 d-flex align-items-center" onClick={this.logOutUser} title="Logout">
                      <h4>Logout</h4> <FontAwesomeIcon icon="sign-out-alt" className="ml-2 h4" />
                    </Button>
                  </NavDropdown.Item>
                </NavDropdown>
              </Navbar>
            </div> )}
            <div className="nav-item">
              <NavigationOverlay />
            </div>           
          </div>
        </div>

        
        
        <Modal show={this.state.show} centered onHide={this.handleClose}>
          <Modal.Header className="bg-taz-blue text-white" closeButton>
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
  loggedIn: user.paddlerID || false,
  userName: user.paddlerName || '',
  userImageURL: user.image || false
})

export default connect(MapStateToProps)(Navigation);