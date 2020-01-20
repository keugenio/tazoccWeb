import React from 'react';
import { connect } from 'react-redux';
import {Badge} from 'react-bootstrap'

const MapStateToProps = ({timeTrials, crewTrials})=>({
  crewTrials
})

class CrewTrials extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tTrials:[],
      raceCrewTrials:[],
      paddlerTrialSet:false
    }
  }
  
  static getDerivedStateFromProps(props, state){
    const tTrials = props.crewTrials.filter(tt=>(tt.raceID == props.raceID))
    tTrials.sort( (a,b) => (a.timeTrial<b.timeTrial ? -1:1) )
    const raceCrewTrials =  tTrials.reduce(function (r, a) {
      r[a.crewID] = r[a.crewID] || [];
      r[a.crewID].push(a);
      return r;
    }, Object.create(null)); 
    const TTs = Object.values(raceCrewTrials) || null   
    return {tTrials:tTrials, raceCrewTrials:TTs};    
  }
  render(){
    let ttSet = false
    return (
      <div>
        {this.state.raceCrewTrials.map((rct, i)=>{
          ttSet=false;
          return(
          <div key={i}>{rct[0].division}
            { rct.map((element,i) => {
              if (!ttSet && element.paddlerID == this.props.paddler.uid){
                ttSet=true;
                return (
                  <Badge pill key={i} variant="danger">{element.timeTrial}</Badge>
                )
              } 
              else {
                return (
                  <Badge pill key={i} variant="warning">{element.timeTrial}</Badge>
                )}
          })}            
          </div>           
        )}
        )}
      </div>
    )}

}

export default connect(MapStateToProps)(CrewTrials);