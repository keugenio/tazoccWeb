import React, { useState } from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AboutUs = () => {
  const [open, setOpen] = useState(false);
  const BoardMembers = [
    {title:'President',name:'Lisa Zanin', img:'/images/lisa.jpg'},
    {title:'Vice-President',name:'Jeff Leonard', img:'/images/jeff.jpg'},
    {title:'Treasurer',name:'Diana Durham', img:'/images/diana.jpg'},
    {title:'Secretary',name:'Sofia Tuncap', img:'/images/sofia.jpg'},
    {title:'SCORA Representative',name:'Tony Holland', img:'/images/tony.jpg'},
    {title:'Member-At-Large',name:'Michelle Vega', img:'/images/vega.jpg'},
    {title:'Head Coach',name:'Kui Eugenio', img:'/images/kui.jpg'}];
  return(
    <React.Fragment> 
      <div className="bgOverlayColor">
        <img src="/images/bg_high_five.jpg" className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">About TAZ</p></div>
        <div className="container aboutUsContainer">
          <section className="history section">
              <h1 className="display-4">Our History</h1>
              <img src='/images/coach_allen.jpg' className="image-fluid float-left mr-3"/>
              <p>
                Team Arizona began with the vision of one man.  Coach Allen Abad started paddling in the mid 1960’s with Leeward Kai Canoe Club. 
                The club was a family oriented where all members came together to paddle and help the club.  
                In 1968, Coach Allen left Hawaii to serve in the Navy.  After serving four years in the Navy, Coach Allen moved to San Diego where he met other local people from Hawaii and in 1976, San Diego’s first canoe club was established.  
                It started as a recreational club, allowing locals to enjoy what they missed from back home.  
                A few years later, Coach Allen moved to Arizona where he later founded Team Arizona (TAZ) Outrigger Canoe Club in 2004.
                In 2009, after a two year battle with pancreatic cancer, Coach Allen passed away.  Team Arizona proudly paddles in loving memory of Coach Allen
                and strives to honor him each and every time we are in the canoe together.
              </p>
          </section>
          <section className="mission section">
            <h1 className="display-4">Our Mission</h1>
            <FontAwesomeIcon icon="quote-left" size="4x" className="float-left mr-3" />
            <FontAwesomeIcon icon="quote-right" size="4x" className="float-right" /> 
            <p>
              to promote the Hawaiian culture through competitive and recreational outrigger canoe paddling 
              for youth (keikis), family (ohana), and the community
            </p>                       
          </section>   
          <section id="philosophies" className="section">
            <h1 className="display-4">Our Philosopies</h1>
            <ul>
              <li>Respect:  Treat people, places, and things like they are special.</li>
              <li>Integrity:  Choose right over wrong.</li>
              <li>Humility:  Be humble, and a good sport.</li>
              <li>Enthusiasm:  Be happy in everything you do.</li>
              <li>Knowledge:  Learn, share, and have an open mind.</li>
              <li>Friendship:  Make friends for life.</li>
              <li>Leadership:  Guide, teach, encourage, enjoy.</li>
              <li>Culture:  Promote competitive and recreational outrigger canoe paddling.</li>
            </ul>                    
          </section>    
          <section id="board" className="section">
            <h1 className="display-4">Board Officers</h1>
            <div className="boardMembers d-flex flex-row flex-wrap justify-content-center" >
              {BoardMembers.map((member, i)=>(
                <Card key={i}>
                  <Card.Img variant="top" src={member.img}/>
                  <Card.Body>
                    <Card.Text>
                      <h3 className="text-bold">{member.name}</h3> <h4 className="text-italic">{member.title}</h4>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <hr />
            <div>
              <a href="/docs/BYLAWS-OF-TEAM-ARIZONA-OUTRIGGER-CANOE-CLUB_April_2018.pdf">BYLAWS OF TEAM ARIZONA OUTRIGGER CANOE CLUB (April 2018)</a>
            </div>            
          </section>                     
        </div>
      </div>
    </React.Fragment>
  )
}

export { AboutUs as default }