import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faSync, faQuoteLeft, faQuoteRight, faStar , faSignInAlt, faSignOutAlt, faNewspaper, faEdit, faSave, faPlus, faPlusCircle, faMinusCircle, faAngleUp, faCog, faMale, faFemale, faWindowClose} from '@fortawesome/free-solid-svg-icons';
import tazStore from './store/store';

import AppRouter from './components/routers/AppRouter'

library.add(fab, faSync, faQuoteLeft, faQuoteRight, faStar, faSignInAlt, faSignOutAlt, faNewspaper, faEdit, faSave, faPlus, faPlusCircle, faMinusCircle, faAngleUp, faCog, faMale, faFemale, faWindowClose)
const store = tazStore();

const jsx = (
  <Provider store = {store} >
    <AppRouter />  
  </Provider>
)
ReactDOM.render(jsx, document.getElementById('app'));
