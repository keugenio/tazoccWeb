import React from 'react';
import events from './eventDescriptions';
import Modal from './Modal'

class EventInformation extends React.Component  {
  constructor () {
    super()
    this.state = {
      events:[],
      currentTitle:'',
      currentDescription:'',
      currentDate:'',
      currentLocation:'',
      currentMore:'',
      currentEventImg:''
    }
    this.openModal = this.openModal.bind(this);    
  }  
  componentDidMount(){
    this.setState({events})
  }
  openModal(eventTitle) {
    let event = this.search(eventTitle, this.state.events)    
    this.setState({currentTitle:event.title, currentDate:event.date, currentDescription:event.description, currentLocation:event.location, currentMore:event.more, currentEventImg:event.img})
  }
 
  search = (key, inputArray) => {    
    for (let i=0; i < inputArray.length; i++) {
        if (inputArray[i].title === key) {
            return inputArray[i];
        }
    }
  }

  render () {
    return (
      <React.Fragment>
      <Modal title={this.state.currentTitle}>
        <table style={tableStyle}>
          <tbody>
            <tr>
            <td colSpan='2'><img className="card-img-top img-fluid" src={this.state.currentEventImg} alt="event image"></img></td>
            </tr>
            <tr>
              <td><label style={labelStyle}>Event:</label></td>
              <td>{this.state.currentTitle}</td>
            </tr>            
            <tr>
              <td><label style={labelStyle}>Description:</label></td>
              <td>{this.state.currentDescription}</td>
            </tr>
            <tr>
              <td><label style={labelStyle}>Date:</label></td>
              <td>{this.state.currentDate}</td>
            </tr>
              <tr>
              <td><label style={labelStyle}>Location:</label></td>
              <td>{this.state.currentLocation}</td>
            </tr>
            <tr>
              <td colSpan='2' className="text-center"><a href={this.state.currentMore} rel="noopener noreferrer" target="_blank" className="btn btn-light btn-lg">More</a></td>
            </tr>              
          </tbody>
        </table>
      </Modal>      
        {this.state.events.map((event, i)=>(
          <button key={i} type="button" className="btn" data-toggle="modal" data-target="#theModal" onClick={() => this.openModal(event.title)} style={buttonStyle}>
            <div className="card bg-primary text-white">
              <img className="card-img-top img-fluid" src={event.img} alt="event image"></img>
              <div className="card-body">
                <div className="card-title">{event.title}</div>
              </div> 
            </div>
          </button>
        ))}       
      </React.Fragment>

    )
  }      
}


export default EventInformation

const ulStyle = {
  listStyleType:'none'
}
const labelStyle = {
  marginRight:'1rem',
  fontWeight:600
}
const buttonStyle = {
  maxWidth:'33%',
  height:'100%'
}
const tableStyle = {
  fontSize:'1.5rem'
}