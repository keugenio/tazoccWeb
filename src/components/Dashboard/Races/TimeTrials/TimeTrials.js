import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {Badge} from 'react-bootstrap'

const MapStateToProps = ({timeTrials})=>({
  timeTrials
})

class TimeTrials extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tTrials:[]
    }
  }
  
  static getDerivedStateFromProps(props, state){
    const tTrials = props.timeTrials.filter(tt=>tt.raceID == props.raceID)
    const sorted = tTrials.sort( (a,b) => (a.timeTrial<b.timeTrial ? -1:1) )
    return {tTrials:sorted};    
  }
  render(){  
    return (
      <div>
        { this.state.tTrials.map((tt, i)=>(
          <Badge key={i} pill variant={tt.timeTrial == this.props.paddler.timeTrial? ('danger'):('warning')}>{tt.timeTrial}</Badge>
        ))}
      </div>
    )}

}

export default connect(MapStateToProps)(TimeTrials);