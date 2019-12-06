import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { Router, navigate } from '@reach/router';
import { connect } from 'react-redux';
import firebase from '../Firebase';
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
import Dashboard from '../Dashboard';
import Register from '../Auth/Register';
import NotFoundPage from '../NotFoundPage';
import Footer from '../Footer';
import { setUserName, setUserID } from '../../store/store';

class AppRouter extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(FBUser => {      
      if (FBUser) {
        this.props.dispatch(setUserName(FBUser.displayName));
        this.props.dispatch(setUserID(FBUser.uid))
      }
    })
    // make the hover message on the links viewable instantly suing jQuery
    $('.titleHoverMessage').tooltip({show: {effect:"none", delay:0}});     
  }

  render(){
    return (
      // <BrowserRouter>
      //   <div>
      //     <Navigation />
      //     <Switch>
      //       <Route path="/" component={Home} exact={true} />
      //       <Route path="/practices" component={Practices} />        
      //       <Route path="/calendar" component={TAZCalendarOfEvents} />     
      //       <Route path="/aboutUs" component={AboutUs} />
      //       <Route path="/tradition" component={Tradition} />        
      //       <Route path="/shopTAZ" component={ShopTAZ} /> 
      //       <Route path="/News" component={News} /> 
      //       <Route path="/paddlerstats" component={PaddlerStats} />
      //       <Route path="/login" component={Login} />
      //       <Route path="/register" component={Register} />
      //       <Route component={NotFoundPage} />              
      //     </Switch>
      //     <Footer />
      //   </div>
      // </BrowserRouter>   
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
          <NotFoundPage default />
        </Router>
        <Footer />
      </div>
    )
  }
}


export default connect ()(AppRouter);