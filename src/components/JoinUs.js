import React from 'react';
import { Card, Button, Row, Col} from 'react-bootstrap'

const JoinUs = () => {

  return (
    <React.Fragment>
      <div className="bg-white joinUsContainer pt-5 bg-Tribal">
        <Row className="bg-join_1 d-flex justify-content-start align-items-center m-0" id="joinUs">
          <Col lg={4} xs={12} className="px-5 m-0 bg-primary-fade h-100 d-flex flex-column justify-content-center align-items-center text-center"> 
            <img src="/images/hibiscus-white-icon.png" className="mb-4"/>
            <div className="text-white"><h1 className="display-4">Would you like to join our Ohana and paddle with Team Arizona?</h1></div>       
          </Col>

        </Row>
        <Row className="bg-join_3 d-flex justify-content-start align-items-center">
        <Col lg={5} xs={12} className="offset-lg-6 bg-white h-100 d-flex align-items-center text-center"> 
          <div className="text-shadow-white"><p className="joinUsText"> Team Arizona welcomes all levels of paddlers.  It's our mission to share the sport of outrigger paddling along with our Hawaiian culture. We practice year round and welcome members who paddle year round just for recreation, paddlers who race within SCORA events within the summer and paddlers who do long distance voyages. Whatever type of outrigger experience you may want to train for, we'll usually have a crew for you.</p></div>       
        </Col>      
        </Row>
      </div>
    </React.Fragment>

  )
}

export default JoinUs