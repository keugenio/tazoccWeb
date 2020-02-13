import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => (
  <footer className="container-fluid text-white">
    <div className="container d-flex justify-content-between">
      <span>@2019 Team Arizona Outrigger Canoe Club</span>
      <span className="ml-auto">
      <span>
        Like TAZ on 
        <a href="http://facebook.com/TAZOCC" className="ml-2">
          <FontAwesomeIcon icon={['fab', 'facebook']}></FontAwesomeIcon>
        </a>
      </span>
      
    </span>
    </div>
  </footer>
)

export default Footer