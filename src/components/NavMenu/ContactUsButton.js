import React, { useState } from 'react';
import { Modal, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EmailUs from '../EmailUs';

const ContactUsButton = (props) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="contactUsButton">
      {props.location=="navMenu" && <Button variant="link" className="titleHoverMessage bg-transparent" onClick={()=>setShow(true)} title="Have a Question? Ask us!">
        <div className="contactUsLink">
          Contact TAZ
        </div>
        <div className="contactUsLink" onClick={()=>setShow(true)} title="Have a Question? Ask us!">
          <FontAwesomeIcon icon="envelope-open-text" className="fa-2x"/>
        </div>
      </Button>}
      { props.location=="overlay" && <span onClick={()=>setShow(true)}>Contact TAZ</span>}

      <Modal show={show} centered onHide={()=>setShow(false)} className="contactUsModal">
        <Modal.Header className="bg-taz-blue text-white" closeButton>
          <Modal.Title>Contact TAZ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmailUs />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>  
    </div>   
  );
};

export default ContactUsButton;