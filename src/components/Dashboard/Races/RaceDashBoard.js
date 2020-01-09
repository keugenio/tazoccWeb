import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRacesToPaddlers, dbAllPaddlers } from '../../Firebase';

function mapStateToProps({paddlers}) {
  return {
    paddlers
  };
}

class RaceDashBoard extends Component {
  constructor(props) {
    super(props)
    this.state={
      paddlers:[]
    }
  }
  componentDidMount(){
    dbRacesToPaddlers.where("raceID", "==", this.props.raceID)
      .get()
      .then((querySnapshot)=>{
        let racers = [];
        querySnapshot.forEach((race)=>{
          const raceToPaddlerInfo = race.data();
          const aRacer = this.props.paddlers.find(paddler=>paddler.uid==raceToPaddlerInfo.paddlerID)
          racers.push({paddlerID:raceToPaddlerInfo.paddlerID, paddlerName:(aRacer ? aRacer.name:'')})          
        })
        this.setState({paddlers:[...racers]})
      })    
  }

  render() {
    return (
      <div>
        <label>Paddlers attending race:</label>
        <div className="row p-3">        
          {this.state.paddlers.map((paddler, i)=>{
            return (<span key={i} className="paddler comma">{paddler.paddlerName}</span>)
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(RaceDashBoard);