import React from 'react'
import { Link } from '@reach/router';

var $ = require('jquery');
window.$ = $;
require('bootstrap');
function closeNavOverlay() {
  document.getElementById("navi-toggle").checked = false;
}
const  NavigationOverlay = () => {
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
        </ul>
      </nav>
    </div>
  )
}
export { NavigationOverlay as default}
