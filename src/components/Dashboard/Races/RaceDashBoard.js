import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dbRacesToPaddlers, dbAllPaddlers } from '../../Firebase';
import moment from 'moment';
import { Card, Col, Tab, Nav, Row } from 'react-bootstrap';

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
          racers.push({raceToPaddlerID: race.id, paddlerID:raceToPaddlerInfo.paddlerID, paddlerName:(aRacer ? aRacer.name:''), timeTrial:raceToPaddlerInfo.timeTrial, age:moment().diff(moment(aRacer.birthday), 'years'), sex:aRacer.sex})          
        })
        this.setState({paddlers:[...racers.sort((a,b)=>(a.age > b.age) ? 1: -1)]})
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
                      <Nav.Item>
                        <Nav.Link eventKey="openMen">Open Men</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="openWomen">Open Women</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="mastersMen">Master's Men</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="mastersWomen">Master's Women</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="srMastersMen">Sr Master's Men</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="srMastersWomen">Sr Master's Women</Nav.Link>
                      </Nav.Item>  
                      <Nav.Item>
                        <Nav.Link eventKey="goldenMastersMen">Golden Master's Men</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="goldenMastersWomen">Golden Master's Women</Nav.Link>
                      </Nav.Item>  
                      <Nav.Item>
                        <Nav.Link eventKey="openCoed">Open Coed</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="mastersCoed">Master's Coed</Nav.Link>
                      </Nav.Item> 
                      <Nav.Item>
                        <Nav.Link eventKey="srMastersCoed">Sr Master's Coed</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="goldenMastersCoed">Golden Master's Coed</Nav.Link>
                      </Nav.Item>      
                      <Nav.Item>
                        <Nav.Link eventKey="keiki">Keiki</Nav.Link>
                      </Nav.Item>                                                                                                                                                                          
                    </Nav>
                  </Col>  
                  <Col sm={9} className="bg-primary pt-4">
                    <Tab.Content>
                      <Tab.Pane eventKey="openMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Men</Card.Title>
                            <Card.Body>
                              <Col>
                                <div className="col w-100 d-flex flex-wrap">
                                  {this.state.paddlers.map((paddler, i)=>{
                                    if (paddler.sex == "kane" || paddler.sex=="male")
                                      return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                  })}          
                                </div>            
                              </Col>
                            </Card.Body>
                        </Card>                      
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="openWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if (paddler.sex == "wahine" || paddler.sex=="female")
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                                  
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="mastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=40)
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                    
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="mastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=40 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                    
                      </Tab.Pane> 
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="srMastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr. Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=50)
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>                       
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="srMastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr. Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=50 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>              
                    <Tab.Content>
                      <Tab.Pane eventKey="goldenMastersMen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Men</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "kane" || paddler.sex=="male") && paddler.age>=60)
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="goldenMastersWomen">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Women</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( (paddler.sex == "wahine" || paddler.sex=="female") && paddler.age>=60 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="openCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Open Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card>
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="mastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( paddler.age>=40 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="srMastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Sr Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( paddler.age>=50)
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="goldenMastersCoed">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>Golden Masters Coed</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( paddler.age>=60 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                      <Tab.Pane eventKey="keiki">
                        <Card className="text-dark border border-dark p-2">
                          <Card.Title>keiki</Card.Title>
                          <Card.Body>
                            <Col>
                              <div className="col w-100 d-flex flex-wrap">
                                {this.state.paddlers.map((paddler, i)=>{
                                  if ( paddler.age<=18 )
                                    return (<div key={i} className="border border-danger p-2 mr-2">{paddler.paddlerName}, {paddler.age}</div>)
                                })}          
                              </div>            
                            </Col>
                          </Card.Body>
                        </Card> 
                      </Tab.Pane>
                    </Tab.Content>                                                                                                                                                                
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