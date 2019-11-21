import React from 'react'
import bgImage from '../bgImages/bg_home.jpg';

const Home = () => {
  return(
    <div className="container-fluid homepage">
      <div className="offset-1 title">Team Arizona</div>
      <div className="text-wrapper offset-1 animated-words display-3 sub-title mt-4f">
          <span>Outrigger Canoe Club</span>
          <span>Ohana</span>
          <span>Outrigger Voyagers</span>
          <span>Outrigger Racers</span>
          <span>Lives Aloha</span>
      </div>    
      <img src={bgImage} className="fullsize-bg-image"></img>
      <button className="join">join us</button>
    </div>
  )
}

export { Home as default }