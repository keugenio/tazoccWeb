import React, { Component } from 'react';
import { Table, Card, Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cp_short = require('../scoraRaces/Crystal-Pier-2019_Short_Course_Overall.json');
const cp_coed = require('../scoraRaces/Crystal-Pier-2019_Coed_Overall.json');
const cp_mens = require('../scoraRaces/Crystal-Pier-2019_Mens_Overall.json');

class ScoraRaces extends Component {
  constructor(props){
    super(props);
    this.state = {
      currRace:null,
      sortBy:"Time",
      modalShow:false,
      buttonTitle:''
    }
  }
  static getDerivedStateFromProps(props, state){
    switch (props.race) {
      case "cp_short":
        return ({currRace:cp_short, buttonTitle:"short course"})
        break;
      case "cp_coed":
        return ({currRace:cp_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "cp_mens":
        return ({currRace:cp_mens, buttonTitle:"men's course"})
        break;      
      default:
        return({})
    }

  }
  handleChangeSortedBy = (sortBy) =>{
    this.setState({
      currRace:this.state.currRace.sort((a,b)=> (a[sortBy]<b[sortBy] ? -1: 1)),
      sortBy:"Division"
    })
  }
  closeModal = () => {
    this.setState({modalShow:false})
  }
  render() {
    return (
      <div>
        <Button bg="primary" onClick={()=>{this.setState({modalShow:true})}}>{this.state.buttonTitle}</Button>
        <Modal show={this.state.modalShow} 
        onHide={() => this.closeModal()}
        style={{zIndex:2002}}
        size="lg"
        >
          <Modal.Body>
            <Card bg="light">
              <Card.Body>
                <Table striped bordered hover className="scoraRaceTable">
                  <thead>
                    <tr>
                      <td className="d-flex">
                      <a onClick={()=>{this.handleChangeSortedBy("Time")}} className="text-"><u>Time</u></a>
                      {this.state.sortBy=="Time" && <FontAwesomeIcon icon="angle-up" className="ml-2"/>}
                      </td>
                      <td>Canoe Number</td>
                      <td>Club</td>
                      <td className="d-flex">
                        <a onClick={()=>{this.handleChangeSortedBy("Division")}}><u>Division</u></a>
                        {this.state.sortBy=="Division" && <FontAwesomeIcon icon="angle-up" className="ml-2"/>}
                      </td>
                    </tr>        
                  </thead>
                  <tbody>
                    {this.state.currRace.map((race, i)=>{
                      if (race['Club'] == 'Team Arizona Outrigger Canoe Club'){
                        return(
                            <tr key={i} className="bg-dark text-white">
                              <td>{race["Time"]}</td>
                              <td>{race["Canoe Number"]}</td>
                              <td>{race["Club"]}
                              </td>
                              <td>{race["Division"]}</td>
                            </tr>
                        )}
                      else {
                        return(
                          <tr key={i}>
                            <td>{race["Time"]}</td>
                            <td>{race["Canoe Number"]}</td>
                            <td>{race["Club"]}
                            </td>
                            <td>{race["Division"]}</td>
                          </tr>
                      )}

                    })}
                  
                  </tbody>
                </Table>          
              </Card.Body>
            </Card>          
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default ScoraRaces;