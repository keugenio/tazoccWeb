import React, { useState }from 'react';
import emailjs from 'emailjs-com';
import { Alert, Form, Row, Col } from 'react-bootstrap';

export default function EmailUs() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)  
  const [showForm, setShowForm] = useState(true)    

  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm('gmail', 'contactus', e.target, 'user_JRbB5TQ5j7onKY2KNjfSf')
      .then((result) => {
          setShowSuccess(true)
          setShowForm(false)
      }, (error) => {
        console.log(error);
        
          setShowError(true)
          setShowForm(false)
      });
  }

  return (
    <div>
      { showForm ?
        <Form className="contact-form" onSubmit={sendEmail}>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Name:
            </Form.Label>
            <Col sm="10">      
                <Form.Control type="text" placeholder="your name" name="from_name"/>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="2">
              Email:
            </Form.Label>  
            <Col sm="10">     
              <Form.Control type="email" placeholder="your email" name="from_email"/>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="12">
              Message:
            </Form.Label>
            <Col sm="12"> 
              <textarea name="message_html" className="w-100" rows="5"/>
            </Col>
          </Form.Group>
          <Row className="justify-content-center">
            <input type="submit" value="Send" className="btn btn-warning btn-lg"/>
          </Row>
        </Form>
        : null 
      }
      { showSuccess ? 
        <Alert show={showSuccess} variant="success">
          <Alert.Heading>Hey, your email was sent!</Alert.Heading>
          <p>
            We'll get back to you at the email you provided real soon.
          </p>
          <hr />
          <p className="mb-0">
            Your friends from TAZ
          </p>
        </Alert>
        : null
      }
      { showError ?
        <Alert show={showError} variant="danger">
          <Alert.Heading>Hey, your email wasn't sent!</Alert.Heading>
          <p>
            Close this and try again
          </p>
          <hr />
          <p className="mb-0">
            Your friends from TAZ
          </p>
        </Alert> 
        : null
      }
    </div>

  );
}

