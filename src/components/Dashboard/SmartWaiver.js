import React, { useState } from 'react';
import { Button, Modal, Card, Image } from 'react-bootstrap';
import smartWavierImg from '../../images/smartWaiver.png';

const SmartWaiver = (props) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div>
      <Button onClick={()=>setShowModal(true)}>SCORA Waiver</Button>
      <Modal show={showModal} onHide={()=>setShowModal(false)} >
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">SCORA Waiver</Modal.Title>  
        </Modal.Header>
        <Modal.Body>
        <Card>
          <Card.Body className="text-dark dislay-3">
            {props.selectedPaddler && <span>Your SCORA ID is <b>{props.selectedPaddler.SCORAID}</b></span>}
            <p>Good news!! You only have to complete 1 waiver!</p>
            <ol>
              <li>remember your SCORA ID {} and use that to complete your form</li>
              <li>log into <a href="https://SCORAregistration.com" target="_blank">https://SCORAregistration.com</a></li>
              <li>From the Paddlers section:
                <ul>
                  <li>new paddlers will register a new account, returning paddlers will click MY ACCOUNT</li>
                  <li>if you haven't completed your waiver you'll get an image like the one below, if you don't you're done!!</li>
                </ul>
              </li>
              <Image src={smartWavierImg} className="img-fluid border" style={{opacity:"50%"}}/> 
              <li>every week, we get updated by SCORA and we will mark that you have completed your from. We will update this site when that happens.</li>
            </ol>
          </Card.Body>
        </Card>
        </Modal.Body>
        </Modal>
    </div>

  );
};

export default SmartWaiver;