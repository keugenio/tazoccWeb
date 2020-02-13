import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavDropdown, Container, Button} from 'react-bootstrap';
import { navigate, Link } from '@reach/router';
import firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut, clearRacesPaddlerSignedUpFor, clearAllRaces, clearSelectedPaddler } from '../../store/store';
import Monogram from '../Monogram';
import EditProfile from '../Auth/EditProfile';
import NavigationOverlay from './Navigation_overlay';
import ContactUsButton from './ContactUsButton';

const MapStateToProps = ({user})=>({
  loggedIn: user.paddlerID || false,
  paddlerName: user.paddlerName || '',
  paddlerImageURL: user.image || false
})

const NavMenu =(props) => {
  const {loggedIn, paddlerName, paddlerImageURL} = props
  const logOutUser = () => {
    //clear the user and his/her races from store, logout from firebase
    props.dispatch(logUserOut());
    props.dispatch(clearRacesPaddlerSignedUpFor());
    props.dispatch(clearAllRaces());
    props.dispatch(clearSelectedPaddler());
    firebase.auth().signOut()
    .then(() =>{
      navigate('/login')
    })
  }

  return (
    <Container fluid className="tazNavMenu">
      <Nav as="ul" className="justify-content-start" >
        <Nav.Item as="li">
          <Link to="/" className="brandText">Team Arizona Outrigger Canoe Club</Link>
          <Link to="/" className="brandText">Team Arizona</Link>
          <Link to="/" className="brandText">Team Arizona OCC</Link>
        </Nav.Item>
        <div className="ml-auto row rightNavItems">
          <Nav.Item as="li" className="navMenuContactButton">
            <ContactUsButton location="navMenu"/>
          </Nav.Item>
          <Nav.Item as="li" className="d-flex">
            {!loggedIn && (
              <Link className="nav_link titleHoverMessage loginButton" to="/login" title="Login to see your stats">
                  Login <FontAwesomeIcon icon="sign-in-alt"/>
              </Link>
            )}
          <div className="logoOrImage">
            {loggedIn && ((paddlerImageURL) ? 
                (<img src={paddlerImageURL} className="userProfileIcon" />) :
                (<span><Monogram name= {paddlerName}/></span>))}
            {loggedIn && (
              <NavDropdown
                className="border-0" 
                title=''
                id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <div className="d-flex align-items-center">
                  <div className="text-dark bg-transparent border-0 d-flex align-items-center">
                    <EditProfile location="navMenu"/>
                  </div>
                  </div>                                    
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Button className="text-dark bg-transparent border-0 d-flex align-items-center" onClick={logOutUser}>
                    <h4>Logout</h4> <FontAwesomeIcon icon="sign-out-alt" className="ml-2 fa-2x" />
                  </Button>
                </NavDropdown.Item>
              </NavDropdown> )}
          </div>
          </Nav.Item>
          <Nav.Item as="li">
            <NavigationOverlay />
          </Nav.Item>
        </div>
      </Nav>  
    </Container>
  );

}

export default connect(MapStateToProps,)(NavMenu);