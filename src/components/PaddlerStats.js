import React from 'react'
import { connect } from 'react-redux';
import bgImage from '../bgImages/bg_sunset.jpg';

class PaddlerStats extends React.Component {

  render (){
    return (
      <React.Fragment> 
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">My Stats</p></div>
      </React.Fragment>
    )
  }
}

const MapStateToProps = ()=>({

})

export default connect(MapStateToProps)(PaddlerStats);
