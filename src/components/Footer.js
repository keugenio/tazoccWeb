import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => (
  <footer className="container-fluid text-white">
    <div className="container">
      <span>@2019 Team Arizona Outrigger Canoe Club</span>
      <span>
          Follow TAZ 
          <a href="http://facebook.com/TAZOCC" className="ml-2">
            <FontAwesomeIcon icon={['fab', 'facebook']}></FontAwesomeIcon>
          </a>
      </span>
    </div>
  </footer>
)

export default Footer