import React from 'react';
import UnreadNewsBadge from './UnreadNewsBadge';
import NavigationOverlay from './Navigation_overlay';
import Auth from './Auth';

const Dashboard = () => (
  <React.Fragment>
    <div className="dashboard d-flex flex-row-reverse align-items-center">
      <UnreadNewsBadge />
      <Auth />
      <NavigationOverlay />
    </div>
  </React.Fragment>
)

export default Dashboard