import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let currentYear = new Date().getFullYear().toString();
const Footer = () => (
  <footer className="container-fluid text-white">
    <div className="container">
      <div>@{currentYear} TAZOCC.com</div>
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