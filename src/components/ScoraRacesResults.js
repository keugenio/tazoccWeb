import React, { Component } from 'react';
import { Table, Card, Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cp_short = require('../scoraRaces/Crystal-Pier-2019_Short_Course_Overall.json');
const cp_coed = require('../scoraRaces/Crystal-Pier-2019_Coed_Overall.json');
const cp_mens = require('../scoraRaces/Crystal-Pier-2019_Mens_Overall.json');
const kk_short = require('../scoraRaces/KK-2019_Short_Course_Overall.json');
const kk_coed = require('../scoraRaces/KK-2019_Coed_Overall.json');
const kk_mens = require('../scoraRaces/KK-2019_Mens_Overall.json');
const bob_short = require('../scoraRaces/BOB-2019_Short_Course_Overall.json');
const bob_coed = require('../scoraRaces/BOB-2019_Coed_Overall.json');
const bob_mens = require('../scoraRaces/BOB-2019_Mens_Overall.json');
const iron_short = require('../scoraRaces/Iron-Champs-2019_Short_Course_Overall.json');
const iron_coed = require('../scoraRaces/Iron-Champs-2019_Coed_Overall.json');
const iron_mens = require('../scoraRaces/Iron-Champs-2019_Mens_Overall.json');
const whitey_coed = require('../scoraRaces/Whitey-Harrison-2019_9-Man_Women_Overall.json');
const whitey_mens = require('../scoraRaces/Whitey-Harrison-2019_9-Man_Men_Overall.json');
const paopao_coed = require('../scoraRaces/PaoPao-2019_9-Man_Women_Coed_Overall.json');
const paopao_mens = require('../scoraRaces/PaoPao-2019_9-Man_Mens_Coed_Overall.json');
const catalina_coed = require('../scoraRaces/Catalina-Crossing_2019_Women_Coed_Overall.json');
const catalina_mens = require('../scoraRaces/Catalina-Crossing_2019_Women_Coed_Overall.json');

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
      case "kk_short":
        return ({currRace:kk_short, buttonTitle:"short course"})
        break;
      case "kk_coed":
        return ({currRace:kk_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "kk_mens":
        return ({currRace:kk_mens, buttonTitle:"men's course"})
        break; 
      case "bob_short":
        return ({currRace:bob_short, buttonTitle:"short course"})
        break;
      case "bob_coed":
        return ({currRace:bob_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "bob_mens":
        return ({currRace:bob_mens, buttonTitle:"men's course"})
        break; 
      case "iron_short":
        return ({currRace:iron_short, buttonTitle:"short course"})
        break;
      case "iron_coed":
        return ({currRace:iron_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "iron_mens":
        return ({currRace:iron_mens, buttonTitle:"men's course"})
        break; 
      case "whitey_coed":
        return ({currRace:whitey_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "whitey_mens":
        return ({currRace:whitey_mens, buttonTitle:"men's course"})
        break; 
      case "paopao_coed":
        return ({currRace:paopao_coed, buttonTitle:"coed/wahine course"})
        break;        
      case "paopao_mens":
        return ({currRace:paopao_mens, buttonTitle:"men's course"})
        break; 
        case "catalina_coed":
          return ({currRace:catalina_coed, buttonTitle:"coed/wahine course"})
          break;        
        case "catalina_mens":
          return ({currRace:catalina_mens, buttonTitle:"men's course"})
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