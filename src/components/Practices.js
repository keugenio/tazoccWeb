import React, {useState} from 'react'
import GoogleApiWrapper from './GoogleApiWrapper';
import {Tabs, Tab, Alert, Button} from 'react-bootstrap';
import Calendar from './Calendar';

const Practices = () => {
  const [show, setShow] = useState(true);

  return(
    <React.Fragment> 
      <div className="bgOverlayColor">
        <img src="/images/bg_nightime.jpg" className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">Practices</p></div>
        <div className="d-flex container-fluid p-5">
          <div className="col-md-6">
            <div className="practiceText">
              <h2>Team Arizona holds Open Practices</h2>
              <ul className="practiceTimes">
                <li>
                  <strike>Tuesday Evenings 6:30pm  (Open Practice)</strike> Cancelled till January 2020
                </li>
                <li>
                  Thursday Evenings 6:30pm (Open Practice)
                </li>
                <li>
                  Saturday Mornings 7:00am (Open Practice)
                </li>                        
              </ul>
              <p><strong>Practices are held on the north side of Tempe Town Lake at the marina.</strong></p>
              <Alert variant="dark alertText">
                <Alert.Heading>Directions to 550 East Tempe Town Lake, Tempe, AZ 85251</Alert.Heading>
                <hr />
                <ul className="mb-0">
                  <li>From Loop 202 in Tempe, exit on Scottsdale Road and head <b>north</b> (towards Scottsdale, away from Tempe).  You must<strong> immediately</strong> get into the leftmost lane.  You&#8217;ll see the Carvana glass structure to your left.</li>
                  <li>Turn at the first left on E. Gilbert Dr.</li>
                  <li>Follow E. Gilbert Drive westward and the marina entrance is right after the overpass.</li>
                  <li>Park anywhere in the parking lot and we gather on the west side of the boatyard.  Look for the blue and white canoes.</li>
                </ul>
              </Alert>
            </div> 
          </div>       
          <div className="col-md-6 practiceInfo">
          <div className="practiceTabs">
            <Tabs defaultActiveKey="map" id="practiceTabInfo">
              <Tab eventKey="map" title="Map">
              <Alert show={show} variant="success">
                <Alert.Heading>See where to park and meet us</Alert.Heading>
                <p>Drag the little yellow man (at the bottom right of this map) on the TAZ icon to see the Google Map Satellite view of exactly where to park. Rotate the map 180 degrees and you'll see our canoes behind the gate.</p>
                  <br></br><hr></hr><br></br>
                <p>Drag the little yellow man again on the rowing icon and you'll see where we launch our canoes and where to go if you're late.  Wait at the end of the dock and we'll pick you up when we come back.</p>                
                <hr />
                <div className="d-flex justify-content-end">
                  <Button onClick={() => setShow(false)} variant="outline-success">
                    OK
                  </Button>
                </div>
              </Alert>               
                <GoogleApiWrapper />
              </Tab>
              <Tab eventKey="summer" title="Summer Clothing">
                <Alert variant="dark alertText">
                  <Alert.Heading>What to wear when it gets warm</Alert.Heading>
                  <hr></hr>
                  <div className="w-100 d-flex justify-content-center">
                    <img src='/images/summer_image.jpg' className="img-fluid"></img>
                  </div>
                  <p>As the weather starts getting warmer, be cognizant of the sun.  Practices at the lake can get up to 110 degrees and above.  During those times, we'll practice later at night or early in the morning however there are times we utilize the heat to train for harder races like the Queen Lili`uokalani Race in September.</p>
                  <p>Most clothing that you would wear to the gym will work. Bring LOTS of water and sunscreen and remember to bring a towel to dry off and extra clothing to change for your drive home.  It's a water sport. Deal with it.</p>
                  <p>The club can provide you with a paddle if you need it but most paddlers end up purchasing their own.</p>
                </Alert> 
              </Tab>
              <Tab eventKey="winter" title="Winter Clothing">
                <Alert variant="dark alertText">
                  <Alert.Heading>What to wear when it gets cold</Alert.Heading>
                  <hr></hr>
                  <div className="w-100 d-flex justify-content-center">
                    <img src='/images/winter_image.jpg' className="img-fluid"></img>
                  </div>
                  <p>As the weather starts getting colder, be prepared to wear a little more clothing when you paddle.  Some sort of headwear keeps the heat from leaving your body.  Layers are always best because you'll start to warm up quickly so long sleeve shirts with a jacket that can easily be removed should be considered.  Most paddlers will wear some sort of water resistant pants.  As for shoes, this is the ONLY time we allow them in the canoe.  Remember to bring a towel and extra clothes to change your clothing that may become wet due to the nature of the sport.</p>
                </Alert>                
              </Tab>
              <Tab eventKey="practiceSchedule" title="Practice Schedule">
                <Alert variant="dark alertText">
                  <Calendar></Calendar>
                </Alert>                
              </Tab>              
            </Tabs> 
          </div>
          </div>
        </div>
      </div>

      </React.Fragment>
  )
}

export { Practices as default }