import React, { useState, Suspense } from 'react'
import bgImage from '../bgImages/bg_afternoon.jpg';
import { Card, CardColumns, Carousel, CardGroup, Tabs, Tab } from 'react-bootstrap';
import canoe1 from '../images/canoe_1.jpg';
import canoe2 from '../images/canoe_2.jpg';
import canoe3 from '../images/canoe_3.jpg';
import canoe4 from '../images/canoe_4.jpg';
import canoe5 from '../images/canoe_5.jpg';
import canoe6 from '../images/canoe_6.jpg';
import canoe7 from '../images/canoe_7.jpg';
import canoe8 from '../images/canoe_8.jpg';
import canoe9 from '../images/canoe_9.jpg';
import canoe10 from '../images/canoe_10.jpg';
import canoe11 from '../images/canoe_11.jpg';
import canoe12 from '../images/canoe_12.jpg';

const Tradition = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const canoeImgs=[canoe1, canoe2, canoe3, canoe4, canoe5, canoe6, canoe7, canoe8, canoe9, canoe10, canoe11, canoe12];

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setDirection(e.direction);
  };
  const terms = [
    {name:'UNE', pronounced:'OO-NAY', meaning:'To “lever.” This is the action MUA (stroker & sometimes others) takes to help HO`OKELE (steerer) turn the bow of the canoe going around the turn flag. This can be ANY movement of the paddle, from a J-stroke to paddling toward the hull. I have heard this term mis-pronounced UNI = OO-NEE. This word is not in the Hawaiian dictionary.'},
    {name:'KAHI', pronounced:'KAH-HEE', meaning:'To “cut. Holds the paddle still, blade “cutting” in the same line as the canoe. No “action” taken.'},
    {name:'PAHI', pronounced:'PAH-HEE', meaning:'Edge, the blade or knife edge.'},
    {name:"`E `E!", pronounced:'ay ay', meaning:'Get in the canoe!'},
    {name:"HO`OMAKAUKAU!", pronounced:'Hoh oh MAH cow cow', meaning:'Get ready or get set! Paddle across the gunwales (or poised to plant the blade in the water)'},
    {name:'HUKI!', pronounced:'HOO KEY', meaning:'Pull, GET INTO IT!'}
  ]
  const canoes = [
    {name:"wa'a", meaning:'generic term for canoe'},
    {name:"heihei:", meaning:'a race of any kind including a canoe race'},
    {name:"`au wa`a", meaning:'a fleet of canoes'},
    {name:"`auwa`a `a ho`apipi", meaning:'two canoes hastily joined to form or to use as a double canoe'},
    {name:"wa`a kaulua", meaning:'another term for double canoe'},
    {name:"kaukahi", meaning:'a single canoe with an outrigger'},
    {name:"kialoa", meaning:'a long, light, and swift canoe used for racing & display. This term may also refer to a beautiful woman and her shape. Queen Ka`ahumanu was referred to as “Kialoa” in her youth.'},
    {name:"Ko`okahi", meaning:'OC1'},
    {name:"Ko`olua", meaning:'OC2'},
    {name:"Ko`oha", meaning:'OC4'},
    {name:"Ko`eono", meaning:'OC6'},
    {name:"Wa`a `Apulu", meaning:'an old, worn-out canoe. Also an old person. You see, the old time Hawaiians DID have a real sense of humor'}
  ]
  const oc6responsibilities=[
    {title:'Stroke and Number Two', responsibility:'The stroke sits in the very front seat of the canoe. Paddlers one and two, are primarily concerned with ensuring the rhythm and pace of the paddle strokes, which seats, three through five follow. They paddle on opposite sides and as such neither has a paddle to follow. The stroke at the front of the canoe must set a more or less consistent pace which varies according to the nature of the race and water conditions, but usually between 65-75 strokes/minute, whilst the paddler behind in number two seat, must follow in perfect time, mirroring the strokes pace so as the power distribution remains equal and synchronized down the length of the canoe. The stroke’s job is crucial in ensuring the consistency of the crew working at an optimum pace and rhythm. When rounding markers, the stroke and number two work together to turn the front of the canoe.'},
    {title:'Seats Three and Four', responsibility:'Often referred to as Power Seats, the heavier, stronger paddlers will generally take these positions. It is their primary task to provide the brute power required to push the canoe along. Number four seat generally takes responsibility for ensuring the canoe remains as dry as possible, bailing when needs be.'},
    {title:'Seat Five', responsibility:'Again a power seat but also needs to have knowledge of steering to assist the steerer when necessary. They are also referred to as the keeper of the ama. This entails that they must eyeball the ama (the outer float) to make sure it is stable. If it looks at any time to be lifting threatening capsize, they must quickly react to save it. Failing this, numbers three and four need to recognise the predicament and also try to save a capsize. Number five must also take responsibility for bailing if required should there be an excess of water in the canoe as by the time water is collecting towards the aft end of the canoe, there is definitely too much water inboard.'},
    {title:'Steerer', responsibility:'The steerer, who is ideally the captain of the canoe calls the shots, motivates the crew and sets the canoe up for the best coarse and catching the swells. They plan and navigate a course and have a big responsibility during sprint races, where they must set the canoe up for a good turn around the buoys. They need to have a good paddling relationship with number 5 in protecting the ama and indeed with all the crew. Steering a 40ft plus canoe on the open ocean in rough water is an art form. Those that learn their trade well can be considered masters of a task which requires intimate understanding of the dynamics of the ocean and the nuances of the canoe and crew.'}
  ]
  const oc6characteristics = [
    {question:'What are the characteristics of a good stroke?', response:'Being stroke is first and foremost psychologically challenging as they have the position of not being able to follow anyone and must therefore remain at all times self motivated and alert. In many respects their role is mentally more challenging than any other in the canoe, with the exception of the steerer.<br>They must have a natural sense of timing and rhythm and have eyes in the backs of their head, being able to intuitively feel how the canoe is travelling and respond by increasing and decreasing the stroke rate where necessary. They need to be aerobically very fit as they may not pull as much water as those behind but they will be working hard on an aerobic level. Above all they need to be good natural athletes with a capacity to read the water and have an understanding of what the paddlers behind can tolerate as an effective, efficient stroke rate.'},
    {question:'What are the characteristics of a good number 2 paddler?', response:'Much like the stroke, a good sense of timing and rhythm. It is crucial that number 2 stay in time with the stroke, made all the harder by the fact that they cannot actually follow a blade in front of them, but only the paddlers body movement. Number 2 needs to talk to the stroke to encourage and keep them on task at all times. A good paddling relationship at the front of the canoe will ensure the rest of the canoe is firing well. Numbers 1 and 2 are the source and all that happens here, travels back along the canoe.<br>Number two will often take responsibility for counting the number of strokes per side and call out when it is time to switch sides. They should also be in a position to note how the stroke rate is going, in terms of number per minute and therefore can prompt the stroke if needs be if the rate seems to slow or fast.'},
    {question:'Why are paddlers 3 and 4 often the heaviest and strongest paddlers?', response:'In order to create a stable canoe, it is preferable to have your heaviest paddlers in the middle of the canoe between the two spars (iako). In this way their weight stabilises the canoe by ensuring that it sits reasonably deep in this mid section and therefore that the float (ama) on the outer spar (iako) maintains contact with the water.<br>Ideally three and four need to be concerned with little else, other than following the front two paddlers and applying maximum leverage. Beyond this,the canoe is widest at its mid point and therefore physically large paddlers can fit in these seats but often have trouble fitting into seats 1 or 2!'},
    {question:'Why does number 4 take responsibility for bailing?', response:'When water enters the canoe it will tend to pool first of all in the mid section of the canoe. Number 4 can recognise this and react by bailing. They can also sit up on the spar (iako) to do so, so that the canoe remains stable whilst they do this.'},
    {question:'So when does number 5 bail?', response:'When there is a serious amount of water and the pool has extended to the rear of the canoe.'},
    {question:'What are the characteristics of a good number 5 paddler?', response:'The number five paddler has a varied role and perhaps needs to be the most all around paddler. They should ideally be competent steerers and of course strong paddlers. They need to be able to be totally flexible in their paddling ability, so as they can eyeball the ama and protect it and change paddling sides rapidly and frequently if needs be.They may also need to paddle for long stretches at a time, much like the steerer, on the left side to protect the ama, so as the steerer can concentrate on steering. Their reactions must at all times be fully intuitive, working in with the steerer when it is needed.'},
    {question:'What are the characteristics of a good steerer?', response:'The steerer has without question the greatest degree of responsibility within the canoe, one that is often overlooked by other paddlers. They must steer a good coarse, read the ocean and work the canoe so its interacts and travels at its maximum potential at all times. They most motivate the crew, call changes to stroke rates if they feel it necessary and ensure the overall safety of the canoe.<br>Experience counts for a lot in this position. Time on the water in all conditions is crucial and an intuitive understanding of ocean dynamics is crucial to achieving maximum canoe speed. In this respect it is said that surfers often make the best steerers. Curiously the best steerers happen also to be more and more so, excellent solo outrigger canoeists.'
    },
    {question:'How important are timing and rhythm to the crews perform', response:'One of the fundamental secrets to making an outrigger canoe travel well, is precision of the crews timing and rhythm. All paddles entering and exiting the water at the same time, all paddlers pulling in unison and all using the same technique. The power from the paddles which travels from the paddle along the paddlers arms to their butts, is what drives the canoe forward and the power surge must be synchronised. Time in the canoe as a crew working on these fundamentals are paramount.'}
  ]

  return(
    <React.Fragment> 
      <div className="bgTraditionPage">
        <img src={bgImage} className="fullsize-bg-image"></img>
        <Suspense fallback={<h1>loading...</h1>}>
          <div><p className="text-center text-white pageTitle">Tradition</p></div>
            <div className="traditionContainer">
            <Tabs defaultActiveKey="terms" id="uncontrolled-tab-example">
              <Tab eventKey="terms" title="Terms">
                <section className="terms">
                  <p>In every sport or job there is a special language. For example, Navy terms, words are used in this specialty like no other.  This also works for paddling the Hawaiian canoe.</p>
                  <p>If Na Ho'okele (steerers) use the same language for commands universally, there would be little or no confusion on the part of the paddlers. These commands can and should be used to familiarize the crew with the language. The same language used consistently also gives Ho'okele (steerer) control of the canoe and used to the idea of giving commands.</p>
                              
                  <CardColumns className="terms">
                    {terms.map((term, i)=>(
                      <Card key={i}>
                        <Card.Body>
                          <Card.Title>{term.name}</Card.Title>
                          <Card.Subtitle className="mb-2 text-light">pronounced: {term.pronounced}</Card.Subtitle>
                          <Card.Text>{term.meaning}</Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </CardColumns>
                  <p>Many of these terms have other meaning as well as allegorical meanings or Kaona (the hidden meaning) other than used here.</p>                 
                </section>
              </Tab>
              <Tab eventKey="canoes" title="Types of canoes">
                <div className="canoeTypes">
                  <Carousel interval={10000} fade={true} indicators={false} controls={true} className="h-100 carousel_cards">
                      { canoes.map((canoe, i) => (
                        <Carousel.Item key={i}>
                          <Card>
                            <Card.Img src={canoeImgs[i]} className="img-fluid"></Card.Img>
                            <Card.Body>
                              <h1>{canoe.name}</h1>
                              <p>{canoe.meaning}</p>
                            </Card.Body>
                          </Card>
                        </Carousel.Item>
                      ))}
                  </Carousel>
                  <div className="individual_cards">
                    { canoes.map((canoe, i) => (
                        <Card key={i}>
                          <Card.Img src={canoeImgs[i]} className="img-fluid"></Card.Img>
                          <Card.Body>
                            <h1>{canoe.name}</h1>
                            <p>{canoe.meaning}</p>
                          </Card.Body>
                        </Card>
                    ))}                  
                  </div>
              </div>
              </Tab>
              <Tab eventKey="positions" title="Paddler Positions">
                <section className="positions">
                  <h1>Six paddlers in the canoe, who does what?</h1>
                  <p>Six paddlers in the canoe all working in unison, but each with a role to play. Each paddler from seat number 1-5, paddles alternately on the opposite side from each other.</p>
                  <div className="responsibility"> 
                    <CardColumns className="individual_cards">
                      {oc6responsibilities.map((responsibility, i) => (
                        <Card bg="info" key={i}>
                          <Card.Title>{responsibility.title}</Card.Title>
                          <Card.Text>{responsibility.responsibility}</Card.Text>
                        </Card>
                      ))}                    
                    </CardColumns>      
                  </div>
                </section>
              </Tab>
            </Tabs>            
            </div>
          

          </Suspense>
      </div>
    </React.Fragment>
  )
}

export { Tradition as default }