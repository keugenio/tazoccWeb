import React from 'react';
import { Button, Row, Col, Modal} from 'react-bootstrap'

const JoinUs = () => {
  return (
    <React.Fragment>
      <div className="joinUsContainer bg-Tribal">
        <Row className="bg-join_1">
          <Col lg={4} xs={12} className="bg-primary-fade box-shadow-primary columnText">
            <div className="text-center" >
              <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
              <h1 className="display-4">Would you like to join our Ohana and paddle with us?</h1>
            </div>       
          </Col>
        </Row>
        <Row className="bg-join_2 d-flex justify-content-end">
          <Col lg={4} xs={12} className="bg-primary-fade box-shadow-primary columnText"> 
            <div className="text-white text-shadow-primary p-3 text-center">
              <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
              <p>Team Arizona welcomes all levels of paddlers.  It's always been our mission to share the sport of outrigger paddling along with our Hawaiian culture.
              </p>
              <hr/>
              <p>We normally practice year round and welcome prospective new members at anytime during the year.  Out-of-state visitors are welcome to practice with us while you are here and share your paddling stories and grow our Ohana.
              </p>
            </div>       
          </Col>      
        </Row>
        <Row className="bg-join_5">
          <Col lg={4} xs={12} className="bg-primary-fade box-shadow-primary columnText"> 
            <div className="text-white text-shadow-primary p-3 text-center">
              <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
              <p> We are normally comprised of members who:</p>
              <ul>
                <li>paddle just for recreation</li>
                <li>race within SCORA events throughout the summer</li>
                <li>journey on long distance voyages</li>
              </ul>
              <hr/>
              <p>Whatever type of outrigger experience you may want to train for, we'll usually have a crew for you.</p>
            </div>       
          </Col>      
        </Row>        
        <Row className="bg-join_3">
          <Col lg={5} xl={4} xs={12} className="bg-primary-fade box-shadow-primary columnText"> 
            <div className="text-white text-shadow-primary p-3 text-center">
              <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
              <p>Every practice starts with helping getting the canoes prepared at the boatyard, then a proper stretch and seat assignments.</p><br/>
              <p>A normal practice will usually last a little more than an hour. Sometimes we do drills to work on basics and cardio, sometimes we do long distance pieces to work on endurance and sometimes a combination.</p><br/>
              <p>It really depends on the what type of races we're getting prepared for.</p>
            </div>       
          </Col>      
        </Row>
        <Row className="bg-join_4">
          <Col className="h-75 d-flex justify-content-end align-items-center flex-column"> 
              <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
              <Button href="/practices" variant="primary" size="lg">Learn more</Button>       
          </Col>      
        </Row>   
      </div>
    </React.Fragment>

  )
}

export default JoinUs