import React from 'react'
import { NavLink } from 'react-router-dom';


var $ = require('jquery');
window.$ = $;
require('bootstrap');

const  Header = () => {
  return (
      <nav className="navbar navbar-expand-lg container-fluid">
        <NavLink activeClassName="is-active" className="navbar-brand" to="/" >
          <img src='/images/star_logo.png' width='100px' height='100px'></img>
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink activeClassName="is-active"  className="nav-link" to="/calendar">Calendar</NavLink>
            </li>
            <li className="nav-item">
            <NavLink activeClassName="is-active"  className="nav-link" to="/shopTAZ">Shop TAZ</NavLink>
            </li>    
            <li className="nav-item">
              <NavLink activeClassName="is-active"  className="nav-link" to="/aboutUs">About TAZ</NavLink>
            </li>                                 
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-primary my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    )
}
export { Header as default}
