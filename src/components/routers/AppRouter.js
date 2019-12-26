import React from 'react'
import { Router, navigate } from '@reach/router';
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
import { setUserName, setUserID, setUserImage, addRaceToPaddler, setUserRole, setUserAttendance, setAmountUnread, setLoggedInUserReadNews, setSCORAInfo } from '../../store/store';


class AppRouter extends React.Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {      
      if (FBUser) {
        this.props.dispatch(setUserName(FBUser.displayName));
        this.props.dispatch(setUserID(FBUser.uid))
        this.props.dispatch(setUserImage(FBUser.photoURL));
        
        dbAllPaddlers.doc(FBUser.uid).get()
        .then(doc=>{
          const paddler = doc.data();
          
          this.props.dispatch(setUserRole(paddler.role));
          this.props.dispatch(setUserAttendance(paddler.attendance))  
          this.props.dispatch(setLoggedInUserReadNews(paddler.readArticles));
          this.props.dispatch(setSCORAInfo(paddler))           
        })
        
        //get the races that the paddler signed up for and load into store
       dbRacesToPaddlers.where("paddlerID", "==", FBUser.uid).where("enabled", "==", true)
        .get()
        .then((querySnapshot)=>{
          querySnapshot.forEach((race)=>{
            const raceInfo = race.data();
            const scoraRaceInfo = this.props.races.find(race=> race.id == raceInfo.raceID)
            this.props.dispatch(addRaceToPaddler({...raceInfo, ...scoraRaceInfo}))
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
          <NotFoundPage default />
        </Router>
        <Footer />
      </div>
    )
  }
}
const MapStateToProps = ({news, readNewsArticles, races  }) => ({
  news, readNewsArticles, races
})
export default connect (MapStateToProps)(AppRouter);