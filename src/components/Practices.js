import React, {useState} from 'react'
import GoogleApiWrapper from './GoogleApiWrapper';
import {Tabs, Tab, Alert, Button, Row, Col, Card} from 'react-bootstrap';
import Calendar from './Calendar';
import bgImage from '../bgImages/bg_sunset.jpg';

const Practices = () => {
  const [show, setShow] = useState(true);

  return(
    <React.Fragment> 
      <div className="bgOverlayColor">
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">Practices</p></div>
        <div className="container-fluid practices ">
          <Row>
            <Col xl={6} xs={12}>
              <Card className="bg-white-2">
                <Card.Title><h2>Team Arizona holds Open Practices</h2></Card.Title>
                <Card.Body>                    
                    <ul className="practiceTimes">
                      <li>
                        <strike>Tuesday Evenings 6:30pm  (Open Practice)</strike> Cancelled till February 2020
                      </li>
                      <li>
                        Thursday Evenings 6:30pm (Open Practice)
                      </li>
                      <li>
                        Saturday Mornings 7:00am (Open Practice)
                      </li>                        
                    </ul>               
                </Card.Body>
              </Card>
              <Card className="bg-white-2 directions">
                <Card.Header><h2>Practices are held on the north side of Tempe Town Lake at the marina.</h2></Card.Header>
                <Card.Body>
                <Card.Title><h2>Directions to 550 East Tempe Town Lake, Tempe, AZ 85251</h2></Card.Title>
                  <hr />
                  <ul className="mb-0">
                    <li>From Loop 202 in Tempe, exit on Scottsdale Road and head <b>north</b> (towards Scottsdale, away from Tempe).  You must<strong> immediately</strong> get into the leftmost lane.  You&#8217;ll see the Carvana glass structure to your left.</li>
                    <li>Turn at the first left on E. Gilbert Dr.</li>
                    <li>Follow E. Gilbert Drive westward and the marina entrance is right after the overpass.</li>
                    <li>Park anywhere in the parking lot and we gather on the west side of the boatyard.  Look for the blue and white canoes.</li>
                  </ul>                
                </Card.Body>
              </Card> 
            </Col>       
            <Col xl={6} xs={12} className="practiceInfo">
            <div className="practiceTabs">
            <Tabs defaultActiveKey="map" id="practiceTabInfo">
              <Tab eventKey="map" title="Map" className="m-4">
                <Alert show={show} variant="success">
                  <Alert.Heading>See where to park and meet us</Alert.Heading>
                  <br/>
                  <p>Drag the little yellow man (at the bottom right of this map) on the TAZ icon to see the Google Map Satellite view of exactly where to park. Rotate the map 180 degrees and you'll see our canoes behind the gate.</p>
                    <hr/>
                  <p>Drag the little yellow man again on the rowing icon and you'll see where we launch our canoes and where to go if you're late.  Wait at the end of the dock and we'll pick you up when we come back.</p>                
                  <hr />
                  <div className="d-flex justify-content-end">
                    <Button onClick={() => setShow(false)} variant="outline-success">
                      OK
                    </Button>
                  </div>
                </Alert>               
                <GoogleApiWrapper/>                  
              </Tab>
              <Tab eventKey="summer" title="Summer Clothing">
                <Card className="bg-white-2">
                  <Card.Title>What to wear when it gets warm</Card.Title>
                  <Card.Body>
                    <div className="w-100 d-flex justify-content-center">
                      <img src='/images/summer_image.jpg'></img>
                    </div>
                    <hr/>
                    <ul>
                      <li>As the weather starts getting warmer, be cognizant of the sun.  Practices at the lake can get up to 110 degrees and above.  During those times, we'll practice later at night or early in the morning however there are times we utilize the heat to train for harder races like the Queen Lili`uokalani Race in September.</li>
                      <li>Most clothing that you would wear to the gym will work. Bring LOTS of water and sunscreen and remember to bring a towel to dry off and extra clothing to change for your drive home.  It's a water sport. Deal with it.</li>
                      <li>The club can provide you with a paddle if you need it but most paddlers end up purchasing their own.</li>
                    </ul>                                      
                  </Card.Body>
                </Card>
              </Tab>
              <Tab eventKey="winter" title="Winter Clothing">
                <Card className="bg-white-2">
                  <Card.Title>What to wear when it gets cold</Card.Title>
                  <Card.Body>
                    <div className="w-100 d-flex justify-content-center">
                      <img src='/images/winter_image.jpg'></img>
                    </div>
                    <hr/>
                    <ul>
                      <li>As the weather starts getting colder, be prepared to wear a little more clothing when you paddle.</li>
                      <li>Some sort of headwear keeps the heat from leaving your body.</li>
                      <li>Layers are always best because you'll start to warm up quickly so long sleeve shirts with a jacket that can easily be removed should be considered.</li>
                      <li>Most paddlers will wear some sort of water resistant pants.</li>
                      <li>As for shoes, this is the ONLY time we allow them in the canoe.</li>
                      <li>Remember to bring a towel and extra clothes to change your clothing that may become wet due to the nature of the sport.</li>
                    </ul>
                  </Card.Body>
                </Card>                
              </Tab>
              <Tab eventKey="practiceSchedule" title="Practice Schedule">
                <Card className="bg-white-2">
                  <Card.Body>
                    <Calendar></Calendar>
                  </Card.Body>
                </Card>               
              </Tab>              
            </Tabs> 
          </div>
          </Col>
          </Row>
          </div>
      </div>

      </React.Fragment>
  )
}

export { Practices as default }