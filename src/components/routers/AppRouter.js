import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../Firebase';
import Navigation from '../Navigation';
import Home from '../Home';
import AboutUs from '../AboutUs';
import Practices from '../Practices';
import Tradition from '../Tradition';
import News from '../News';
import TAZCalendarOfEvents from '../CalendarOfEvents'
import ShopTAZ from '../ShopTAZ';
import Login from '../Login';
import PaddlerStats from '../PaddlerStats';
import NotFoundPage from '../NotFoundPage';
import Footer from '../Footer';
import { setUserName } from '../../store/store';

class AppRouter extends React.Component {
  componentDidMount() {
    const ref = firebase.database().ref('user');

    ref.on('value', snapshot => {
     let FBUser = snapshot.val();
     this.props.dispatch(setUserName(FBUser))
    })

    // make the hover message on the links viewable instantly suing jQuery
    $('.titleHoverMessage').tooltip({show: {effect:"none", delay:0}});     
  }

  render(){
    return (
      <BrowserRouter>
        <div>
          <Navigation logOutUser={(e)=>{console.log(e);
          }}/>
          <Switch>
            <Route path="/" component={Home} exact={true} />
            <Route path="/practices" component={Practices} />        
            <Route path="/calendar" component={TAZCalendarOfEvents} />     
            <Route path="/aboutUs" component={AboutUs} />
            <Route path="/tradition" component={Tradition} />        
            <Route path="/shopTAZ" component={ShopTAZ} /> 
            <Route path="/News" component={News} /> 
            <Route path="/paddlerstats" component={PaddlerStats} />
            <Route path="/login" component={Login} />
            <Route component={NotFoundPage} />              
          </Switch>
          <Footer />
        </div>
      </BrowserRouter>        
    )
  }
}


export default connect ()(AppRouter);