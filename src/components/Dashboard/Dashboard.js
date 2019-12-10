import React from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from 'react-bootstrap';
import { navigate } from '@reach/router';
import { CardBody } from 'react-bootstrap/Card';

class Dashboard extends React.Component {

  render () {
    const {loggedIn, userName} = this.props
    if (loggedIn)
      return (
        <React.Fragment>
          <div className="dashboardStats">
            <Card className="dashboard">
              <Card.Title>Hello {userName}!</Card.Title>
              <Card.Body>

                <Card bg="info" text="dark" style={{fontSize:'2rem'}} >
                  <Card.Header className="display-4">SCORA Info</Card.Header>
                  <Card.Body>
                  <Row>
                    <Col lg={3} xs={12}><p>SCORA ID: n/a</p>
                    </Col>
                    <Col lg={3} xs={12}><p>SCORA Waiver: no</p>
                    </Col>
                    <Col lg={3} xs={12}><p>Smart Waiver: no</p>
                    </Col>
                    <Col lg={3} xs={12}><p>huli drill: yes</p>
                    </Col>                  
                  </Row>
                    
                    
                    
                    
                  </Card.Body>
                </Card>

                <Card text="dark" style={{fontSize:'2rem'}} >
                  <Card.Header className="display-4">Races</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col lg={4} xs={12}>
                          <Card>
                            <Card.Title>Havasu : April, 2020</Card.Title>
                              <Card.Body>
                                <p>paid: no</p>
                                <p>time trials: n/a</p>
                                <p>practices attended: 0 <a href="#">see dates</a></p>
                              </Card.Body>
                          </Card>
                        </Col>
                        <Col lg={4} xs={12}>
                          <Card>
                            <Card.Title>Crystal Pier : May, 2020</Card.Title>
                              <Card.Body>
                                <p>paid: no</p>
                                <p>time trials: n/a</p>
                                <p>practices attended: 0 <a href="#">see dates</a></p>
                              </Card.Body>
                          </Card>
                        </Col>                    
                        <Col lg={4} xs={12}>
                          <Card>
                            <Card.Title>Catalina : Sept, 2020</Card.Title>
                              <Card.Body>
                                <p>paid: no</p>
                                <p>time trials: n/a</p>
                                <p>change requirement: completed</p>
                                <p>practices attended: 0 <a href="#">see dates</a></p>
                              </Card.Body>
                          </Card>
                        </Col>                     
                      </Row>
                    </Card.Body>
                </Card>              
              
              </Card.Body>
            </Card>)
          </div>
        </React.Fragment>  
      )  
    else 
        return (
          <React.Fragment>
          <Card className="dashboard">
            <Card.Title>Please Login to view this page</Card.Title>            
          </Card>)
        </React.Fragment>            
        )
  }
}

const MapStateToProps = ({user})=>({
  loggedIn: user.userID || false,
  userName: user.userName || ''
})
export default connect(MapStateToProps)(Dashboard)