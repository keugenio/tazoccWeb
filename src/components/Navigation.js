import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import UnreadNewsBadge from './UnreadNewsBadge';
import NavigationOverlay from './Navigation_overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Navigation extends Component {
  
  render() {
    const { user, logOutUser } = this.props;
    const { userName } = user
    
    return (
      <nav className="site-nav family-sans navbar navbar-expand higher">
        <div className="container-fluid navigatorMenu">
          <NavLink to="/" className="navbar-brand">
            Team Arizona Outrigger Canoe Club
          </NavLink>
          <div className="navbar-nav ml-auto">
            { (user) && (<div className="welcomeUser">Welcome {userName}</div>) }
            {!user && (
              <NavLink activeClassName="is-active" className="nav_link" to="/login" onClick={e => logOutUser(e)}>
                <FontAwesomeIcon icon="sign-in-alt"/>
              </NavLink>
            )}
            {!user && (
              <NavLink activeClassName="is-active" className="nav_link" to="/register" onClick={e => logOutUser(e)}>
                register
              </NavLink>              
            )}
            <UnreadNewsBadge />
            {user && (
              <NavLink activeClassName="is-active" className="nav_link titleHoverMessage" to="/login" onClick={e => logOutUser(e)} title="Logout">
              <FontAwesomeIcon icon="sign-out-alt"/>
              </NavLink>
            )}
          </div>
        </div>
        <NavigationOverlay />
      </nav>
    );
  }
}
const MapStateToProps = ({user})=>({
  user
})

export default connect(MapStateToProps)(Navigation);