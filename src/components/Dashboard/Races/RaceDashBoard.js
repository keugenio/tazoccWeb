import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRacesToPaddlers, dbCrews } from '../../Firebase';
import moment from 'moment';
import { addPaddlerToRace, updatePaddlerTT, clearPaddlersToRace, removePaddlerFromRace, updateRace, addCrew, clearCrews } from '../../../store/store';
import { Card, Col, Tab, Nav, Row, Badge, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingIcon from '../../LoadingIcon';
import AddPaddler from './AddPaddler';
import RaceCrews from './Crews/RaceCrews';

import "babel-polyfill";

function mapStateToProps({paddlers, races, paddlersForCurrentRace}) {
  return {
    paddlers, races, paddlersForCurrentRace
  };
}

class RaceDashBoard extends Component {
  constructor(props) {
    super(props)
    this.state={
      paddlers:[],
      openMen:[], openWomen:[], mastersMen:[], mastersWomen:[], srMastersMen:[], srMastersWomen:[], goldenMastersMen:[], goldenMastersWomen:[], 
      openCoed:[], mastersCoed:[], srMastersCoed:[], goldenMastersCoed:[],
      openCoedMaleCount:0, openCoedFemaleCount:0,
      mastersCoedMaleCount:0, mastersCoedFemaleCount:0,
      srMastersCoedMaleCount:0, srMastersCoedFemaleCount:0,
      goldenMastersCoedMaleCount:0, goldenMastersCoedFemaleCount:0,
      keiki:[], ready:false,
      showEditTimeTrial:false,
      ttBeingEdited:false,
      paddlerTTBeingEdited:null,
      newTimeTrialValue:0
    }
  }

  static getDerivedStateFromProps(props, state){
    const racers = props.paddlersForCurrentRace;

    let openMen=[]; let openWomen=[]; let mastersMen=[]; let mastersWomen=[]; let srMastersMen=[]; let srMastersWomen=[]; let goldenMastersMen=[]; let goldenMastersWomen=[]; 
    let openCoed=[]; let mastersCoed=[]; let srMastersCoed=[]; let goldenMastersCoed=[]; 
    let openCoedMaleCount=0; let openCoedFemaleCount=0;
    let mastersCoedMaleCount=0; let mastersCoedFemaleCount=0;
    let srMastersCoedMaleCount=0; let srMastersCoedFemaleCount=0;
    let goldenMastersCoedMaleCount=0; let goldenMastersCoedFemaleCount=0;        
    let keiki=[];    
    
    racers.forEach(paddler=> {
      if (paddler.sex == "kane" || paddler.sex=="male"){
        openMen.push(paddler);
        openCoed.push(paddler);
        openCoedMaleCount ++;
      }
        
      if (paddler.sex == "wahine" || paddler.sex=="female"){
        openWomen.push(paddler);
        openCoed.push(paddler);
        openCoedFemaleCount++;
      }          
      if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=40){
        mastersMen.push(paddler); mastersCoed.push(paddler);
        mastersCoedMaleCount++;
      }
      if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=40 ){
        mastersWomen.push(paddler); mastersCoed.push(paddler);
        mastersCoedFemaleCount++;
      }
      if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=50){
        srMastersMen.push(paddler); srMastersCoed.push(paddler);
        srMastersCoedMaleCount++;
      }
      if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=50 ){ 
        srMastersWomen.push(paddler); srMastersCoed.push(paddler);
        srMastersCoedFemaleCount++;
      }
      if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=60){
        goldenMastersMen.push(paddler); goldenMastersCoed.push(paddler)};
        goldenMastersCoedMaleCount++;
      if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=60 ){ 
        goldenMastersWomen.push(paddler); goldenMastersCoed.push(paddler)};
        goldenMastersCoedFemaleCount++;
      if (paddler.age <=18)
        keiki.push(paddler) 
    })
    const updatedRacers = racers.map(paddler=>{
      const tt = paddler.timeTrial? paddler.timeTrial:0;
      return {...paddler, timeTrial:tt}
    })
    return {
      paddlers:[...updatedRacers.sort((a,b)=>(a.age > b.age) ? 1: -1)],
      openMen, openWomen, mastersMen, mastersWomen, srMastersMen, srMastersWomen, goldenMastersMen, goldenMastersWomen,
      openCoed, mastersCoed, srMastersCoed, goldenMastersCoed, openCoedMaleCount, openCoedFemaleCount, mastersCoedMaleCount, mastersCoedFemaleCount,
      srMastersCoedMaleCount, srMastersCoedFemaleCount, goldenMastersCoedMaleCount, goldenMastersCoedFemaleCount,keiki,
      ready:true
    }      
  }
  componentDidMount(){
    dbRacesToPaddlers.where("raceID", "==", this.props.raceID)
      .get()
      .then((querySnapshot)=>{
        querySnapshot.forEach((race)=>{
          const raceToPaddlerInfo = race.data();
          if (raceToPaddlerInfo.enabled){
            const aRacer = this.props.paddlers.find(paddler=>paddler.uid==raceToPaddlerInfo.paddlerID)
              if (aRacer){
                const paddler = {raceToPaddlerID: race.id, paddlerID:raceToPaddlerInfo.paddlerID, paddlerName:aRacer.name, timeTrial:raceToPaddlerInfo.timeTrial, age:moment().diff(moment(aRacer.birthday), 'years'), sex:aRacer.sex}
                this.props.dispatch(addPaddlerToRace(paddler))                     
              }}
        })
    })
    // retrieve crews for race and update store
    dbCrews.where("race.raceID", "==", this.props.raceID).get()
      .then((docs)=>{
        if (!docs.empty)
          docs.forEach(doc =>{
            const crewData = doc.data();
            this.props.dispatch(addCrew({...crewData, crewID:doc.id}))
          })
      })
  }
  componentWillUnmount(){
    this.props.dispatch(clearPaddlersToRace())
    this.props.dispatch(clearCrews())
  }
  handleChange = (e) =>{
    this.setState({newTimeTrialValue:e.target.value})
  }
  showEditTimeTrial = (e) => {
    const paddler = this.state.paddlers.find(paddler=>paddler.paddlerID == e.target.id);
    this.setState({showEditTimeTrial:true, ttBeingEdited:true, paddlerTTBeingEdited:e.target.id, newTimeTrialValue:paddler.timeTrial});
  }
  saveTimeTrials = () => {
    // get raceToPaddlerID record number to edit
    const raceToPaddlerID = this.state.paddlers.find(paddler=>paddler.paddlerID == this.state.paddlerTTBeingEdited)
    // update firebase
    dbRacesToPaddlers.doc(raceToPaddlerID.raceToPaddlerID).update({
      timeTrial:this.state.newTimeTrialValue
    })
    // update paddler in state. Find the paddler in paddlersForCurrentRace and update timeTrial. 
    
    const editedPaddler = this.state.paddlers.find(paddler=>paddler.paddlerID==this.state.paddlerTTBeingEdited)
    this.props.dispatch(updatePaddlerTT({...editedPaddler, timeTrial:this.state.newTimeTrialValue}))
    // update local state
    const filteredPaddlers = this.state.paddlers.filter(paddler => paddler.paddlerID != this.state.paddlerTTBeingEdited)
    this.setState({
      showEditTimeTrial:false, ttBeingEdited:false, paddlerTTBeingEdited:null,
      paddlers:[...filteredPaddlers, {...editedPaddler, timeTrial:this.state.newTimeTrialValue}]
    })
  }
  cancelEditTimeTrial = () => {
    this.setState({showEditTimeTrial:false, ttBeingEdited:false, paddlerTTBeingEdited:null})
  }
  deletePaddlerFromRace = (paddlerID) => {
    const currPaddler = this.props.paddlersForCurrentRace.find(paddler=>paddler.paddlerID==paddlerID)
   
    // disable in firestore
    dbRacesToPaddlers.doc(currPaddler.raceToPaddlerID)
      .update({enabled:false})
      .then(()=>{
        // remove from paddlersToRace
        this.props.dispatch(removePaddlerFromRace(paddlerID))
        // update paddlerCount for race
        const currRace = this.props.races.find(race=>race.id==this.props.raceID)
        this.props.dispatch(updateRace({...currRace, paddlerCount:currRace.paddlerCount--}))
      })   
       
  }
  render() {
    let sortedRacersByTT=this.props.paddlersForCurrentRace.sort((a,b)=>(a.timeTrial < b.timeTrial) ? 1: -1);
    const currRace = this.props.races.find(race=>race.id==this.props.raceID)
    return (
      <div className="raceDashboard p-2">
      { !this.state.ready && <LoadingIcon textColor="text-dark"/>}
        <section className="paddlerInfo">        
          <Card className="border border-success p-2">
            <Card.Title className="bg-success text-white">{this.props.paddlersForCurrentRace.length} paddlers attending race:</Card.Title>
            <Card.Body className="row">    
            <Col lg={7} className="line-height-4rem">       
                {this.state.paddlers.map((paddler, i)=>(               
                  <span key={i} className="paddler border border-success border-2 p-2 d-inline text-nowrap">
                    {paddler.paddlerName}                    
                      <Button className="bg-transparent text-danger mx-2 border-0" onClick={()=>this.deletePaddlerFromRace(paddler.paddlerID)} value={paddler.paddlerID}><FontAwesomeIcon icon="minus-circle"/></Button>
                  </span>
                ))}
              </Col> 
              <Col lg={5} sm={12} className="border-left-2 d-flex align-items-center justify-content-end">
                <AddPaddler raceID={this.props.raceID} />
              </Col>         
            </Card.Body>        
          </Card>
        </section>
        <section className="tabbedInfo">
          <Tab.Container defaultActiveKey="possibleCrews">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="timeTrials">Time Trials</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="setCrews">Set Crews</Nav.Link>
              </Nav.Item> 
              <Nav.Item>
                <Nav.Link eventKey="possibleCrews">Possible Crews</Nav.Link>
              </Nav.Item>                        
            </Nav>

            <Tab.Content  className="currentTab">
              <Tab.Pane eventKey="timeTrials">
                <Card>
                  <Card.Body className="flex-column">
                    <ul>
                    { sortedRacersByTT.map((paddler,i)=>{
                      return (
                        
                        <li key={i} className="d-flex align-items-center">
                          {paddler.paddlerName}
                          <span className="ml-3">|</span>
                          <span className={`${paddler.timeTrial<=0 ? 'text-danger font-weight-bold':''}`}>
                            <u><a href="#" onClick={this.showEditTimeTrial} id={paddler.paddlerID}>
                              {paddler.paddlerID!=this.state.paddlerTTBeingEdited && (paddler.timeTrial || 'n/a')}
                            </a></u>
                          </span>  
                          {this.state.showEditTimeTrial && paddler.paddlerID==this.state.paddlerTTBeingEdited && (<Col lg={1}><Form.Control type="text" value={this.state.newTimeTrialValue} onSubmit={this.setEditTimeTrial} onChange={this.handleChange} className="border border-dark text-right" style={{fontSize:'1.5rem'}}></Form.Control></Col>)}
                          <span>m</span>
                          {this.state.showEditTimeTrial && paddler.paddlerID==this.state.paddlerTTBeingEdited && (<Button variant="danger" onClick={this.saveTimeTrials} className="mr-3"><FontAwesomeIcon icon="save" className="fa-2x"/></Button>)} 
                          {this.state.showEditTimeTrial && paddler.paddlerID==this.state.paddlerTTBeingEdited && (<Button variant="muted" onClick={this.cancelEditTimeTrial}>X</Button> )}                    
                        </li>)
                    })}
                    </ul>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="setCrews">
                <RaceCrews raceID={this.props.raceID} raceName={currRace.name}/>
              </Tab.Pane>
              <Tab.Pane eventKey="possibleCrews" className="possibleCrews">
                <Card>
                  <Card.Body >
                      <Tab.Container defaultActiveKey="openMen">
                      <Row className="p-4">
                        <Col sm={3} className="pr-0">
                          <Nav variant="pills" className="flex-column">
                            {this.state.openMen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="openMen">
                                <div className="mr-auto">Open Men</div>
                                <FontAwesomeIcon icon="male"/>
                                <Badge pill variant="warning">{this.state.openMen.length}</Badge>
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.openWomen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="openWomen">
                                <div className="mr-auto">Open Women</div>
                                <FontAwesomeIcon icon="female"/>
                                <Badge pill variant="warning">{this.state.openWomen.length}</Badge>
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.mastersMen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="mastersMen">
                                <div className="mr-auto">Master's Men</div>
                                <FontAwesomeIcon icon="male"/>
                                <Badge pill variant="warning">{this.state.mastersMen.length}</Badge>
                              </Nav.Link>                       
                            </Nav.Item>)}
                            {this.state.mastersWomen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="mastersWomen">
                                <div className="mr-auto">Master's Women</div>
                                <FontAwesomeIcon icon="female"/>
                                <Badge pill variant="warning">{this.state.mastersWomen.length}</Badge>
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.srMastersMen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="srMastersMen">
                                <div className="mr-auto">Sr Master's Men</div>
                                <FontAwesomeIcon icon="male"/>
                                <Badge pill variant="warning">{this.state.srMastersMen.length}</Badge>
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.srMastersWomen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="srMastersWomen">
                                <div className="mr-auto">Sr Master's Women</div>
                                <FontAwesomeIcon icon="female"/>
                                <Badge pill variant="warning">{this.state.srMastersWomen.length}</Badge>
                              </Nav.Link>
                            </Nav.Item> ) }
                            {this.state.goldenMastersMen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="goldenMastersMen">
                                <div className="mr-auto">Golden Master's Men</div>
                                <FontAwesomeIcon icon="male"/>
                                <Badge pill variant="warning">{this.state.goldenMastersMen.length}</Badge>                        
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.goldenMastersWomen.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="goldenMastersWomen">
                                <div className="mr-auto">Golden Master's Women</div>
                                <FontAwesomeIcon icon="female"/>
                                <Badge pill variant="warning">{this.state.goldenMastersWomen.length}</Badge>                         
                              </Nav.Link>
                            </Nav.Item>)}  
                            {this.state.openCoed.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="openCoed">
                                <div className="mr-auto">Open Coed</div>
                                <div className="pr-3 d-flex">
                                  <FontAwesomeIcon icon="male"/>
                                  <Badge pill variant="warning">{this.state.openCoedMaleCount}</Badge>                         
                                </div>
                                <div className="d-flex">
                                  <FontAwesomeIcon icon="female"/>
                                  <Badge pill variant="warning">{this.state.openCoedFemaleCount}</Badge>                         
                                </div>
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.mastersCoed.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="mastersCoed">
                                <div className="mr-auto">Masters Coed</div>
                                <div className="pr-3 d-flex">
                                  <FontAwesomeIcon icon="male"/>
                                  <Badge pill variant="warning">{this.state.mastersCoedMaleCount}</Badge>                         
                                </div>
                                <div className="d-flex">
                                  <FontAwesomeIcon icon="female"/>
                                  <Badge pill variant="warning">{this.state.mastersCoedFemaleCount}</Badge>                         
                                </div>                        
                              </Nav.Link>
                            </Nav.Item>)} 
                            {this.state.srMastersCoed.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="srMastersCoed">
                                <div className="mr-auto">Sr Masters Coed</div>
                                <div className="pr-3 d-flex">
                                  <FontAwesomeIcon icon="male"/>
                                  <Badge pill variant="warning">{this.state.srMastersCoedMaleCount}</Badge>                         
                                </div>
                                <div className="d-flex">
                                  <FontAwesomeIcon icon="female"/>
                                  <Badge pill variant="warning">{this.state.srMastersCoedFemaleCount}</Badge>                         
                                </div>                        
                              </Nav.Link>
                            </Nav.Item>)}
                            {this.state.goldenMastersCoed.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="goldenMastersCoed">
                                <div className="mr-auto">Golden Masters Coed</div>
                                <div className="pr-3 d-flex">
                                  <FontAwesomeIcon icon="male"/>
                                  <Badge pill variant="warning">{this.state.goldenMastersCoedMaleCount}</Badge>                         
                                </div>
                                <div className="d-flex">
                                  <FontAwesomeIcon icon="female"/>
                                  <Badge pill variant="warning">{this.state.goldenMastersCoedFemaleCount}</Badge>                         
                                </div>                        
                              </Nav.Link>
                            </Nav.Item> )}     
                            {this.state.keiki.length>0 && (<Nav.Item>
                              <Nav.Link eventKey="keiki">Keiki</Nav.Link>
                            </Nav.Item>)}                                                                                                                                                                          
                          </Nav>
                        </Col>  
                        <Col sm={9} className="possibleCrewsTabInfo pt-4">
                          <Tab.Content>
                            {this.state.openMen.length>0 && (
                              <Tab.Pane eventKey="openMen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Open Men</Card.Title>
                                    <Card.Body>
                                      <Col>
                                        <div className="col w-100 d-flex flex-wrap">
                                          {this.state.openMen.map((paddler, i)=>(
                                            <div key={i} className="border border-danger p-2 mr-2 bg-primary text-white">{paddler.paddlerName}, {paddler.age}</div>)
                                          )}          
                                        </div>            
                                      </Col>
                                    </Card.Body>
                                </Card>                      
                              </Tab.Pane>
                            )}
                            {this.state.openWomen.length>0 && (
                              <Tab.Pane eventKey="openWomen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Open Women</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.openWomen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-pink">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>                                  
                              </Tab.Pane>
                            )}
                            {this.state.mastersMen.length>0 && (
                              <Tab.Pane eventKey="mastersMen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Masters Men</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.mastersMen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-primary text-white">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>                    
                              </Tab.Pane>
                            )}
                            {this.state.mastersWomen.length>0 && (
                              <Tab.Pane eventKey="mastersWomen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Masters Women</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.mastersWomen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-pink">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>                    
                              </Tab.Pane> 
                            )}
                            {this.state.mastersMen.length>0 && (
                              <Tab.Pane eventKey="srMastersMen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Sr. Masters Men</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.srMastersMen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-primary text-white">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>                       
                              </Tab.Pane>
                            )}
                            {this.state.srMastersWomen.length>0 && (
                              <Tab.Pane eventKey="srMastersWomen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Sr. Masters Women</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.srMastersWomen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-pink">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>
                              </Tab.Pane>
                            )}              
                            {this.state.goldenMastersMen.length>0 && (
                              <Tab.Pane eventKey="goldenMastersMen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Golden Masters Men</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.goldenMastersMen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-primary text-white">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card> 
                              </Tab.Pane>
                            )}
                            {this.state.goldenMastersWomen.length>0 && (
                              <Tab.Pane eventKey="goldenMastersWomen">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Golden Masters Women</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.goldenMastersWomen.map((paddler, i)=>(
                                          <div key={i} className="border border-danger p-2 mr-2 bg-pink">{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>
                              </Tab.Pane>
                            )}
                            {this.state.openCoed.length>0 && (
                              <Tab.Pane eventKey="openCoed">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Open Coed</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.openCoed.map((paddler, i)=>(
                                          <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary text-white'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card>
                              </Tab.Pane>
                            )}
                            {this.state.mastersCoed.length>0 && (
                              <Tab.Pane eventKey="mastersCoed">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Masters Coed</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.mastersCoed.map((paddler, i)=>(
                                          <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary text-white'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card> 
                              </Tab.Pane>
                            )}
                            {this.state.srMastersCoed.length>0 && (
                              <Tab.Pane eventKey="srMastersCoed">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Sr Masters Coed</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.srMastersCoed.map((paddler, i)=>(
                                          <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary text-white'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card> 
                              </Tab.Pane>
                            )}
                            {this.state.goldenMastersCoed.length>0 && (
                              <Tab.Pane eventKey="goldenMastersCoed">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>Golden Masters Coed</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.goldenMastersCoed.map((paddler, i)=>(
                                          <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary text-white'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card> 
                              </Tab.Pane>
                            )}
                            {this.state.keiki.length>0 && (
                              <Tab.Pane eventKey="keiki">
                                <Card className="text-dark border border-dark p-2">
                                  <Card.Title>keiki</Card.Title>
                                  <Card.Body>
                                    <Col>
                                      <div className="col w-100 d-flex flex-wrap">
                                        {this.state.keiki.map((paddler, i)=>(
                                          <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                        )}          
                                      </div>            
                                    </Col>
                                  </Card.Body>
                                </Card> 
                              </Tab.Pane>
                            )}
                          </Tab.Content>                                                                                                                                                                
                        </Col>              
                      </Row>
                    </Tab.Container>                                                                     
                  </Card.Body>
                </Card>            
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </section>
        <section>
        </section>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(RaceDashBoard);