import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import NavigationOverlay from '../Navigation_overlay';
import Home from '../Home';
import AboutUs from '../AboutUs';
import Practices from '../Practices';
import Tradition from '../Tradition';
import News from '../News';
import TAZCalendarOfEvents from '../CalendarOfEvents'
import ShopTAZ from '../ShopTAZ';
import NotFoundPage from '../NotFoundPage';
import Footer from '../Footer';

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <NavigationOverlay />
      <Switch>
        <Route path="/" component={Home} exact={true} />
        <Route path="/practices" component={Practices} />        
        <Route path="/calendar" component={TAZCalendarOfEvents} />     
        <Route path="/aboutUs" component={AboutUs} />
        <Route path="/tradition" component={Tradition} />        
        <Route path="/shopTAZ" component={ShopTAZ} /> 
        <Route path="/News" component={News} /> 
        <Route component={NotFoundPage} />              
      </Switch>
      <Footer />
    </div>
  </BrowserRouter>  
)

export default AppRouter;