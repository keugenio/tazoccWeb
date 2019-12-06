import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import UnreadNewsBadge from './UnreadNewsBadge';
import NavigationOverlay from './Navigation_overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logUserOut } from '../../store/store';
import { navigate, Link } from '@reach/router';

class Navigation extends Component {
  state= {
    goToLogin: false
  }

  logOutUser = (e) => {
    e.preventDefault ();
    this.props.dispatch(logUserOut())
    firebase.auth().signOut().then(() =>{
      navigate('/');
    });
  }

  render() {
    const { user } = this.props;
    const { userName } = user
    
    if (this.state.goToLogin)
      return <Redirect to="/" />
    else 
      return (
        <nav className="site-nav family-sans navbar navbar-expand higher">
          <div className="container-fluid navigatorMenu">
            <Link to="/" className="navbar-brand">
              Team Arizona Outrigger Canoe Club
            </Link>
            <div className="navbar-nav ml-auto">
              { (userName) && (<div className="welcomeUser">Welcome {userName}</div>) }
              {!userName && (
                <Link className="nav_link" to="/login" title="Login to see your stats">
                  Login <FontAwesomeIcon icon="sign-in-alt"/>
                </Link>
              )}
              <UnreadNewsBadge />
              {userName && (
                <Link className="nav_link titleHoverMessage" to="/login" onClick={e => this.logOutUser(e)} title="Logout">
                <FontAwesomeIcon icon="sign-out-alt"/>
                </Link>
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