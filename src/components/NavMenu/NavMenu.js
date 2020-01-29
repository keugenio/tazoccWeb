import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Nav, Navbar, NavDropdown, Container, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut, clearRacesPaddlerSignedUpFor, clearAllRaces, clearSelectedPaddler } from '../../store/store';
import Monogram from '../Monogram';
import EditProfile from '../Auth/EditProfile';
import NavigationOverlay from './Navigation_overlay';

const MapStateToProps = ({user})=>({
  loggedIn: user.paddlerID || false,
  paddlerName: user.paddlerName || '',
  paddlerImageURL: user.image || false
})

const NavMenu =(props) => {
  const [show, setShow] = useState(false);
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

  const handleShow = () => {

  }

  return (
    <Container fluid className="tazNavMenu">
      <Nav as="ul" className="justify-content-start" >
        <Nav.Item as="li">
          <Nav.Link href="/" className="brandText">Team Arizona Outrigger Canoe Club</Nav.Link>
          <Nav.Link href="/" className="brandText">Team Arizona OCC</Nav.Link>
        </Nav.Item>
        <div className="ml-auto row rightNavItems">
          <Nav.Item as="li">
            <Nav.Link eventKey="link-1" className="titleHoverMessage" onClick={()=>setShow(true)} title="Have a Question? Ask us!">
            <div className="contactUsLink">
              Contact TAZ
            </div>
            <div className="contactUsLink" onClick={()=>setShow(true)} title="Have a Question? Ask us!">
              <FontAwesomeIcon icon="envelope-open-text" className="fa-2x"/>
            </div>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li" className="d-flex">
            {!loggedIn && (
              <Nav.Link eventKey="link-2" className="nav_link titleHoverMessage" href="/login" title="Login to see your stats">
                  Login <FontAwesomeIcon icon="sign-in-alt"/>
              </Nav.Link>
            )}
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
                  <Button className="text-dark bg-transparent border-0 d-flex align-items-center">
                    <h4 className="text-dark">Profile</h4>
                    <EditProfile title="Settings"/>
                  </Button>
                  </div>                                    
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Button className="text-dark bg-transparent border-0 d-flex align-items-center" onClick={logOutUser}>
                    <h4>Logout</h4> <FontAwesomeIcon icon="sign-out-alt" className="ml-2 fa-2x" />
                  </Button>
                </NavDropdown.Item>
              </NavDropdown> )}                        
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