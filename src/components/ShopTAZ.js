import React from 'react'
import Iframe from 'react-iframe';
import bgImage from '../bgImages/bg_sunset.jpg';

const ShopTAZ = () => {
  return(
    <React.Fragment> 
      <div className="bgOverlayColor">
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">ShopTAZ</p></div>
        <Iframe url="store.html" className="store"/>
      </div>
    </React.Fragment>
  )
}

export { ShopTAZ as default }

const iframeStyle = {
  minHeight: '90vh',
  background:'rgba(255,255,255,.5)',
  border:'none'
}