import React from 'react'
import { Link } from '@reach/router';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import { navigate } from '@reach/router';
import ContactUsButton from './ContactUsButton';
import EditProfile from '../Auth/EditProfile';
import { logUserOut, clearRacesPaddlerSignedUpFor, clearAllRaces, clearSelectedPaddler } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
var $ = require('jquery');
window.$ = $;
require('bootstrap');
function closeNavOverlay() {
  document.getElementById("navi-toggle").checked = false;
}
const  NavigationOverlay = (props) => {
  const loggedIn = props.user.paddlerID || false;
  const role = props.user.role;
  
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
    .catch(error=>{
      console.log(error);
      
    })
  }

  return (
    <div className="navigation">
      <input type="checkbox" className="navigation__checkbox" id="navi-toggle"></input>
      <label htmlFor="navi-toggle" className="navigation__button">
        <span className="navigation__icon">&nbsp;</span>
      </label>
      <div className="navigation__background fadeIn">&nbsp;</div>
      <nav className="navigation__nav" onClick={closeNavOverlay}>
        <ol className="navigation__list">
          <li className="navigation__item">
            <Link className="navigation__link" to="/" onClick={closeNavOverlay}>
              <span>01</span>Home
            </Link> 
          </li>
          <li className="navigation__item"> 
            <Link className="navigation__link" to="/practices" onClick={closeNavOverlay}>
              <span>02</span>Practices
            </Link> 
          </li>
          <li className="navigation__item">  
            <Link className="navigation__link" to="/calendar" onClick={closeNavOverlay}>
              <span>03</span>Calendar
            </Link> 
          </li>
          <li className="navigation__item">   
            <Link className="navigation__link" to="/aboutUs" onClick={closeNavOverlay}>
              <span>04</span>About TAZ
            </Link> 
          </li>
          <li className="navigation__item">  
            <Link className="navigation__link" to="/tradition" onClick={closeNavOverlay}>
              <span>05</span>Tradition          
            </Link> 
          </li>
          <li className="navigation__item">   
            <Link className="navigation__link" to="/shopTAZ" onClick={closeNavOverlay}>
              <span>06</span>Shop TAZ
            </Link> 
          </li>



          {loggedIn && (
            <li className="navigation__item">  
            <Link className="navigation__link" to="/dashboard" onClick={closeNavOverlay}>
              <span>08</span>Dashboard
            </Link>
          </li>
          )}
          {loggedIn && (role == "admin" || role == "superAdmin") &&  (
            <li className="navigation__item">  
              <Link className="navigation__link" to="/admin" onClick={closeNavOverlay}>
                <span>09</span>Admin
              </Link>
            </li>
          )}
          <li className="navigation__item">
            <Link className="navigation__link" to="" onClick={closeNavOverlay}>
              <ContactUsButton location="overlay"/>
            </Link> 
          </li>
          <li className="navigation__item">
            <Link className="navigation__link d-flex justify-content-center align-items-center" to="" onClick={closeNavOverlay}>
                <EditProfile location="overlay"/>
            </Link>           
          </li>
          {loggedIn && 
            <li className="navigation_item">
              <Link className="navigation__link d-flex justify-content-center align-items-center" to="" onClick={()=>logOutUser()}>
                <span> logout </span>
              </Link>          
            </li>}
          {!loggedIn && (
            <Link className="nav_link titleHoverMessage loginButton" to="/login" title="Login to see your stats">
                Login <FontAwesomeIcon icon="sign-in-alt"/>
            </Link>
          )}                          
        </ol>
      </nav>
    </div>
  )
}
const MapStateToProps = ({ user }) => ({
  user
})
export default connect(MapStateToProps)(NavigationOverlay)
