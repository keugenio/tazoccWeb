import React, {useState} from 'react'
import bgImage from '../bgImages/bg_home.jpg';
import {Modal, Button} from 'react-bootstrap';
import EmailUs from './EmailUs';
import JoinUs from './JoinUs';

const Home = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return(
    <React.Fragment>
    <div className="container-fluid homepage">
      <div className="offset-1 title">Team Arizona</div>
      <div className="text-wrapper offset-1 animated-words display-3 sub-title mt-4f">
          <span>Outrigger Canoe Club</span>
          <span>Ohana</span>
          <span>Outrigger Voyagers</span>
          <span>Outrigger Racers</span>
          <span>Lives Aloha</span>
      </div>    
      <img src={bgImage} className="fullsize-bg-image"></img>
      <div className="homepageButtons">
        <Button className="join" href="#joinUs">join us</Button>
        <Button variant="primary" onClick={handleShow} className="join">
          Contact TAZ
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact TAZ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmailUs />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>      
    </div>
    <div><JoinUs/></div>
    </React.Fragment>
  )
}

export { Home as default }