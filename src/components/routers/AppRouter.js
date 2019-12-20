import React from 'react'
import { Router, navigate } from '@reach/router';
import { connect } from 'react-redux';
import firebase, { dbRacesToPaddlers, dbPaddlers } from '../Firebase';
import Navigation from '../NavMenu/Navigation';
import Home from '../Home';
import AboutUs from '../AboutUs';
import Practices from '../Practices';
import Tradition from '../Tradition';
import News from '../News';
import TAZCalendarOfEvents from '../CalendarOfEvents'
import ShopTAZ from '../ShopTAZ';
import Login from '../Auth/Login';
import PaddlerStats from '../PaddlerStats';
import Dashboard from '../Dashboard/Dashboard';
import Register from '../Auth/Register';
import AdminControl from '../Dashboard/AdminControl';
import NotFoundPage from '../NotFoundPage';
import Footer from '../Footer';
import { setUserName, setUserID, setUserImage, addRaceToPaddler, setUserRole } from '../../store/store';


class AppRouter extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {      
      if (FBUser) {
        this.props.dispatch(setUserName(FBUser.displayName));
        this.props.dispatch(setUserID(FBUser.uid))
        this.props.dispatch(setUserImage(FBUser.photoURL));
        
        // query the user db to find the role for the user logging in and set store
        const dbUser = firebase.database().ref(`users/${FBUser.uid}`);  
        dbUser.once('value')
          .then((snapshot) => {
            const userInfo = snapshot.val();
            this.props.dispatch(setUserRole(userInfo.role));      
          });

        firebase.firestore().collection('racesToPaddlers').where("paddlerID", "==", FBUser.uid)
        .get()
        .then((querySnapshot)=>{
          querySnapshot.forEach((race)=>{
            const raceInfo = race.data();
            this.props.dispatch(addRaceToPaddler(raceInfo.raceID))
          })
        })
      }
    })
    // make the hover message on the links viewable instantly suing jQuery
    $('.titleHoverMessage').tooltip({show: {effect:"none", delay:0}});  
    
    
  }

  render(){
    return (   
      <div>
        <Navigation />
        <Router>
          <Home path="/" />
          <Practices path="/practices" />
          <TAZCalendarOfEvents path="/calendar" />
          <AboutUs path="/aboutUs" />
          <Tradition path="tradition" />
          <ShopTAZ path="/shopTAZ" />
          <News path="/news" />
          <PaddlerStats path="/paddlerstats" />
          <Dashboard path="/dashboard" />
          <Login path="/login" />
          <Register path="/register" />
          <AdminControl path="/admin" />
          <NotFoundPage default />
        </Router>
        <Footer />
      </div>
    )
  }
}

export default connect ()(AppRouter);