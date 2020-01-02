import React from 'react'
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import firebase, { dbRacesToPaddlers, dbAllPaddlers } from '../Firebase';
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
import SuperAdmin from '../_SuperAdmin/SuperAdmin';
import EditProfile from '../Auth/EditProfile';

import { setUserName, setUserID, setUserImage, addRaceToPaddler, setUserRole, setUserAttendance, setAmountUnread, setLoggedInUserReadNews, setSCORAInfo } from '../../store/store';


class AppRouter extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {      
      if (FBUser) {
        // set user in store
        // this.props.dispatch(setUserName(FBUser.displayName));
        this.props.dispatch(setUserName(FBUser.displayName));        
        this.props.dispatch(setUserID(FBUser.uid))
        this.props.dispatch(setUserImage(FBUser.photoURL));
        
        // get all relevant info for current user
        dbAllPaddlers.doc(FBUser.uid).get()
        .then(doc=>{
          const paddler = doc.data();
          // if exisiting paddler in firestore, update the store with info else add new paddler to firestore
          if (paddler){
            this.props.dispatch(setUserRole(paddler.role || ''));                   
            this.props.dispatch(setUserAttendance(paddler.attendance || []))  
            this.props.dispatch(setLoggedInUserReadNews(paddler.readArticles || []));
            this.props.dispatch(setSCORAInfo(paddler))           
          } 
          else {
            dbAllPaddlers.doc(FBUser.uid).set({
              name:FBUser.displayName,
              uid:FBUser.uid,
              image:FBUser.photoURL
            })
          }
        })
        
        //get the races that the paddler signed up for and load into store
        dbRacesToPaddlers.where("paddlerID", "==", FBUser.uid).where("enabled", "==", true)
          .get()
          .then((querySnapshot)=>{
            querySnapshot.forEach((race)=>{
              const raceInfo = race.data();
              const scoraRaceInfo = this.props.races.find(race=> race.id == raceInfo.raceID)
              if (scoraRaceInfo)
                this.props.dispatch(addRaceToPaddler({...scoraRaceInfo, ...raceInfo, changeRequirementForRace:scoraRaceInfo.changeRequirement}))
            })
        }) 
      }
    })
    // make the hover message on the links viewable instantly suing jQuery
    $('.titleHoverMessage').tooltip({show: {effect:"none", delay:0}});

    // set the number of articles not read
    const { news, readNewsArticles } = this.props;
    const unreadNewsAmount = news.length - readNewsArticles.readNews.length +1;
    this.props.dispatch(setAmountUnread(unreadNewsAmount))
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
          <SuperAdmin path="/superAdmin" />
          <EditProfile path="/editprofile" />
          <NotFoundPage default />
        </Router>
        <Footer />
      </div>
    )
  }
}
const MapStateToProps = ({user, news, readNewsArticles, races  }) => ({
  user, news, readNewsArticles, races
})
export default connect (MapStateToProps)(AppRouter);