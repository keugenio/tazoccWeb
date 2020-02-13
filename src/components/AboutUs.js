import React, { useState, Suspense } from 'react';
import { Card, Row, Col, CardColumns} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bgImage from '../bgImages/bg_high_five.jpg';

const AboutUs = () => {
  const BoardMembers = [
    {title:'President',name:'Lisa Zanin', img:'/images/lisa.jpg'},
    {title:'Vice-President',name:'Jeff Leonard', img:'/images/jeff.jpg'},
    {title:'Treasurer',name:'Diana Durham', img:'/images/diana.jpg'},
    {title:'Secretary',name:'Suzette Lanzarotta', img:'/images/suzette.jpg'},
    {title:'SCORA Representative',name:'Tony Holland', img:'/images/tony.jpg'},
    {title:'Member-At-Large',name:'Todd Hosier', img:'/images/todd.jpg'},
    {title:'Head Coach',name:'Kui Eugenio', img:'/images/kui.jpg'}];
  return(
    <React.Fragment> 
      <Suspense fallback={<h1>loading...</h1>}>
        <div className="bgOverlayColor aboutUs">
          <img src={bgImage} className="fullsize-bg-image"></img>
          <div><p className="text-center text-white pageTitle">About taz</p></div>
          <div className="container aboutUsContainer">
            <section className="history_section">
                <div className="section_title text-center">Like many canoe clubs, Team Arizona has humble beginnings.</div>
                <img src='/images/coach_allen.jpg' className="image-fluid float-left mr-3"/>
                <div className="display-4"></div>
                <p>
                  Team Arizona began with the vision of one man.  Coach Allen Abad started paddling in the mid 1960’s with Leeward Kai Canoe Club. 
                  Much like today, the club was family oriented where all members came together to paddle and help the club.  
                  In 1968, Coach Allen left Hawaii to serve in the Navy.  After serving four years, Coach Allen moved to San Diego where he met other local people from Hawaii and in 1976, San Diego’s first canoe club was established.  
                  It started as a recreational club, allowing locals to enjoy what they missed from back home.  
                  A few years later, Coach Allen moved to Arizona where he later founded Team Arizona Outrigger Canoe Club (TAZ) in 2004.
                  In 2009, after a two year battle with pancreatic cancer, Coach Allen passed away.  Team Arizona proudly paddles in loving memory of Coach Allen
                  and strives to honor his memory and teachings whether we are in or out of the canoe together.
                </p>
            </section>
            <section className="mission_section">
              <div className="section_title">Our Mission</div>
                <Row>
                  <Col lg={2} md={1}>
                    <FontAwesomeIcon icon="quote-left" size="3x"/>
                  </Col>
                  <Col className="d-flex justify-content-center text-center">
                    <p>
                      to promote the Hawaiian culture through competitive and recreational outrigger canoe paddling 
                      for youth (keikis), family (ohana), and the community
                    </p> 
                  </Col>
                  <Col lg={2} md={1}>
                    <FontAwesomeIcon icon="quote-right" size="3x"/>  
                  </Col>
                </Row>                                                                            
            </section>   
            <section id="philosophies" className="philosophies_section">
              <div className="section_title">Our Philosopies</div>
              <ul>
                <li>Hōʻihi - Respect:  Treat people, places, and things like they are special.</li>
                <li>Pono - Integrity : Choose right over wrong.</li>
                <li>Haʻahaʻa - Humility:  Be humble, and a good sport.</li>
                <li>Ohohia - Enthusiasm:  Be happy in everything you do.</li>
                <li>Na‘auao - Knowledge:  Learn, share, and have an open mind.</li>
                <li>Ho'aloha - Friendship:  Make friends for life.</li>
                <li>Alakaʻi - Leadership:  Guide, teach, encourage, enjoy.</li>
                <li>Moʻomeheu - Culture:  Promote competitive and recreational outrigger canoe paddling.</li>
              </ul>                    
            </section>    
            <section id="board" className="board_section">
              <div className="section_title board">Board of Directors</div>
              <div className="boardMembers d-flex flex-row flex-wrap justify-content-center" >
                  {BoardMembers.map((member, i)=>(
                    <Card key={i}>
                      <Card.Img variant="top" src={member.img}/>
                      <Card.Body>
                        <div>
                          <div className="boardName">{member.name}</div><div className="boardTitle">{member.title}</div>
                        </div>
                      </Card.Body>
                    </Card>
                    ))}
              </div>
              <hr />
              <div className="text-center">
                <a className="btn btn-warning" href="/docs/BYLAWS-OF-TEAM-ARIZONA-OUTRIGGER-CANOE-CLUB_April_2018.pdf" target="_blank">BYLAWS (April 2018)</a>
              </div>            
            </section>                     
          </div>
        </div>
      </Suspense>
    </React.Fragment>
  )
}

export { AboutUs as default }