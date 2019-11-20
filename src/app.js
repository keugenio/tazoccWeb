import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import AppRouter from './components/routers/AppRouter'

library.add(fab, faSync)

ReactDOM.render(<AppRouter />, document.getElementById('app'));
