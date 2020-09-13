import React, {useState} from 'react'
import Iframe from 'react-iframe';
import bgImage from '../bgImages/bg_sunset.jpg';
import flyer from '../images/taz2020flyer.png';
import { Modal, Button, Row } from 'react-bootstrap';

const ShopTAZ = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return(
    <React.Fragment> 
      <div className="bgOverlayColor storePage">
        <img src={bgImage} className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">ShopTAZ</p></div>      

        <div className="storeContainer">
          <Row className="justify-content-md-center p-5">
            <Button variant="primary" size="large" onClick={handleShow}>Family and Friend's Code</Button>
          </Row>
          <Iframe url="store.html" className="store"/>
        </div>
      </div> 
      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center"><img alt="flyer 2020" src={flyer} style={{height:'75vh'}}></img></Modal.Body>
      </Modal>           
    </React.Fragment>
  )
}

export { ShopTAZ as default }

const iframeStyle = {
  minHeight: '90vh',
  background:'rgba(255,255,255,.5)',
  border:'none',
}
const modalStyle = {
  width:'100%!important'
}