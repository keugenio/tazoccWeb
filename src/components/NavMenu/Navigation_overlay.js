import React from 'react'
import { Link } from '@reach/router';
import { connect } from 'react-redux';

var $ = require('jquery');
window.$ = $;
require('bootstrap');
function closeNavOverlay() {
  document.getElementById("navi-toggle").checked = false;
}
const  NavigationOverlay = (props) => {
  const loggedIn = props.user || false;
  return (
    <div className="navigation">
      <input type="checkbox" className="navigation__checkbox" id="navi-toggle"></input>
      <label htmlFor="navi-toggle" className="navigation__button">
        <span className="navigation__icon">&nbsp;</span>
      </label>
      <div className="navigation__background fadeIn">&nbsp;</div>
      <nav className="navigation__nav">
        <ul className="navigation__list">
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
          <li className="navigation__item">  
            <Link className="navigation__link" to="/news" onClick={closeNavOverlay}>
              <span>07</span>News
            </Link>
          </li>
          {loggedIn && (
            <li className="navigation__item">  
            <Link className="navigation__link" to="/dashboard" onClick={closeNavOverlay}>
              <span>08</span>Dashboard
            </Link>
          </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
const MapStateToProps = ({ user }) => ({
  user
})
export default connect(MapStateToProps)(NavigationOverlay)
