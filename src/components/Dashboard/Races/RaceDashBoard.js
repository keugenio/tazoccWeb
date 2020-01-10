import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRacesToPaddlers, dbAllPaddlers } from '../../Firebase';
import moment from 'moment';
import { Card, Col, Tab, Nav, Row, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function mapStateToProps({paddlers}) {
  return {
    paddlers
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
      keiki:[]
    }
  }
  get
  componentDidMount(){
    dbRacesToPaddlers.where("raceID", "==", this.props.raceID)
      .get()
      .then((querySnapshot)=>{
        let racers = [];
        let openMen=[]; let openWomen=[]; let mastersMen=[]; let mastersWomen=[]; let srMastersMen=[]; let srMastersWomen=[]; let goldenMastersMen=[]; let goldenMastersWomen=[]; 
        let openCoed=[]; let mastersCoed=[]; let srMastersCoed=[]; let goldenMastersCoed=[]; 
        let openCoedMaleCount=0; let openCoedFemaleCount=0;
        let mastersCoedMaleCount=0; let mastersCoedFemaleCount=0;
        let srMastersCoedMaleCount=0; let srMastersCoedFemaleCount=0;
        let goldenMastersCoedMaleCount=0; let goldenMastersCoedFemaleCount=0;        
        let keiki=[];
        querySnapshot.forEach((race)=>{
          const raceToPaddlerInfo = race.data();
          const aRacer = this.props.paddlers.find(paddler=>paddler.uid==raceToPaddlerInfo.paddlerID)
          racers.push({raceToPaddlerID: race.id, paddlerID:raceToPaddlerInfo.paddlerID, paddlerName:(aRacer ? aRacer.name:''), timeTrial:raceToPaddlerInfo.timeTrial, age:moment().diff(moment(aRacer.birthday), 'years'), sex:aRacer.sex})          
        })

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

        this.setState({
          paddlers:[...racers.sort((a,b)=>(a.age > b.age) ? 1: -1)],
          openMen, openWomen, mastersMen, mastersWomen, srMastersMen, srMastersWomen, goldenMastersMen, goldenMastersWomen,
          openCoed, mastersCoed, srMastersCoed, goldenMastersCoed, openCoedMaleCount, openCoedFemaleCount, mastersCoedMaleCount, mastersCoedFemaleCount,
          srMastersCoedMaleCount, srMastersCoedFemaleCount, goldenMastersCoedMaleCount, goldenMastersCoedFemaleCount,keiki
        })
      })    
  }

  render() {
    return (
      <div className="raceDashboard p-2">
        <section>        
          <Card className="border border-success p-2">
            <Card.Title className="text-sucess">Paddlers attending race:</Card.Title>
            <Card.Body className="row">
              {this.state.paddlers.map((paddler, i)=>{
                return (<span key={i} className="paddler comma">{paddler.paddlerName}</span>)
              })}         
            </Card.Body>        
          </Card>
        </section>
        <section>
          <Card className="border border-success">
            <Card.Header className=""/>
            <Card.Title className="text-dark p-2">Possible Crews:</Card.Title>
            <Card.Body >
              <Tab.Container defaultActiveKey="openMen">
                <Row>
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
                  <Col sm={9} className="bg-primary pt-4">
                    {this.state.openMen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="openMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Men</Card.Title>
                            <Card.Body>
                              <Col>
                                <div className="col w-100 d-flex flex-wrap">
                                  {this.state.openMen.map((paddler, i)=>(
                                    <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                  )}          
                                </div>            
                              </Col>
                            </Card.Body>
                        </Card>                      
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.openWomen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="openWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.openWomen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                                  
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.mastersMen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="mastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.mastersMen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                    
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.mastersWomen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="mastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.mastersWomen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                    
                      </Tab.Pane> 
                    </Tab.Content>)}
                    {this.state.mastersMen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="srMastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr. Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.srMastersMen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                       
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.srMastersWomen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="srMastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr. Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.srMastersWomen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>)}              
                    {this.state.goldenMastersMen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="goldenMastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.goldenMastersMen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.goldenMastersWomen.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="goldenMastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.goldenMastersWomen.map((paddler, i)=>(
                                  <div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.openCoed.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="openCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.openCoed.map((paddler, i)=>(
                                  <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.mastersCoed.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="mastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.mastersCoed.map((paddler, i)=>(
                                  <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.srMastersCoed.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="srMastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.srMastersCoed.map((paddler, i)=>(
                                  <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.goldenMastersCoed.length>0 && (<Tab.Content>
                      <Tab.Pane eventKey="goldenMastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.goldenMastersCoed.map((paddler, i)=>(
                                  <div key={i} className={`border border-danger p-2 mr-2 ${paddler.sex=="male" || paddler.sex=="kane" ? ('bg-primary'):('bg-pink')}`}>{paddler.paddlerName}, {paddler.age}</div>)
                                )}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>)}
                    {this.state.keiki.length>0 && (<Tab.Content>
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
                    </Tab.Content>)}                                                                                                                                                                
                  </Col>              
                </Row>
              </Tab.Container>                                                                     
            </Card.Body>
          </Card>
        </section>

      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(RaceDashBoard);