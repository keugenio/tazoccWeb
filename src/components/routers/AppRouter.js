import React from 'react'
import { Router } from '@reach/router';
import { connect } from 'react-redux';
import firebase, { dbRacesToPaddlers, dbAllPaddlers, dbRaces } from '../Firebase';
import axios from 'axios';
import Navigation from '../NavMenu/Navigation';
import NavMenu from "../NavMenu/NavMenu";
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
import "babel-polyfill";
import { setPaddlerName, setPaddlerID, setPaddlerImage, setPaddlerRole, setPaddlerAttendance, addRaceToPaddler, setSelectedPaddler, setUserReadNews, setSCORAInfo, setNewsArticles, setAmountOfNewsUserStillNeedsToRead, addRace } from '../../store/store';

class AppRouter extends React.Component {
  constructor(){
    super();
    this.state={
      newsAmount:0
    }
    this.getNewsArticlesAndPostToStore = this.getNewsArticlesAndPostToStore.bind(this);
  }
  async getNewsArticlesAndPostToStore() {
   
  }

  async componentDidMount() {
    // get the last 10 articles from tazocc.com
    // let newsAmount = 0;
    // await fetch(`http://tazocc.com/wp-json/wp/v2/posts?per_page=10`)       
    //   .then(res => {
    //       this.props.dispatch(setNewsArticles([...res.data]))  
    //       newsAmount = res.data.length;
    //   }) 

   firebase.auth().onAuthStateChanged(async FBUser => {      
      if (FBUser) {
        //load all races
        await dbRaces.get()
          .then(qSnap=>{
            qSnap.docs.map(doc=>{
             dbRaces.doc(doc.id).get()
              .then(race=>{
                const raceInfo = race.data()                
                dbRacesToPaddlers.where("raceID", "==", race.id).where("enabled", "==", true).get()
                .then((res)=>{
                  this.props.dispatch(addRace({...raceInfo, raceID:race.id, paddlerCount:res.docs.length}))
                  });                
              })
            })
          })

        // get all relevant info for current user
        await dbAllPaddlers.doc(FBUser.uid).get()
        .then(doc=>{
          const paddler = doc.data();
          // if exisiting paddler in firestore, update the store with info else add new paddler to firestore
          if (paddler){
            this.props.dispatch(setPaddlerName(paddler.paddlerName));
            this.props.dispatch(setPaddlerID(paddler.paddlerID));
            this.props.dispatch(setPaddlerRole(paddler.role || ''));                   
            this.props.dispatch(setPaddlerAttendance(paddler.attendance || []));
            this.props.dispatch(setPaddlerImage(FBUser.photoURL));
            // this.props.dispatch(setUserReadNews(paddler.readNews || []));
            // this.props.dispatch(setAmountOfNewsUserStillNeedsToRead( newsAmount - (paddler.readNews? paddler.readNews.length: 0)));
            this.props.dispatch(setSCORAInfo(paddler));    
            this.props.dispatch(setSelectedPaddler(paddler))      
          } 
          else {
            dbAllPaddlers.doc(FBUser.uid).set({
              paddlerName:FBUser.displayName,
              paddlerID:FBUser.uid,
              image:FBUser.photoURL
            })
          }
        })
        .then(()=>{
          dbRacesToPaddlers.where("paddlerID", "==", FBUser.uid).where("enabled", "==", true)
            .get()
            .then((querySnapshot)=>{
              querySnapshot.docs.forEach((race)=>{
                const raceInfo = race.data();
                const scoraRaceInfo = this.props.races.find(race=> race.raceID  == raceInfo.raceID)
                if (scoraRaceInfo)
                  this.props.dispatch(addRaceToPaddler({...scoraRaceInfo, ...raceInfo, changeRequirementForRace:scoraRaceInfo.changeRequirement}))
              })
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
        <NavMenu/>
        <Router>
          <Home path="/" />
          <Practices path="/practices" />
          <TAZCalendarOfEvents path="/calendar" />
          <AboutUs path="/aboutUs" />
          <Tradition path="tradition" />
          <ShopTAZ path="/shopTAZ" />
          <News path="/news" />
          <Dashboard path="/dashboard" />
          <Login path="/login" />
          <Register path="/register" />
          <AdminControl path="/admin" />
          <EditProfile path="/editprofile" />
          <NotFoundPage default />
        </Router>
        <Footer />
      </div>
    )
  }
}
const MapStateToProps = ({user, news, races, racesPaddlerSignedUpFor  }) => ({
  user, news, races, racesPaddlerSignedUpFor
})
export default connect (MapStateToProps)(AppRouter);