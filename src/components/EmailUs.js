import React from 'react';
import emailjs from 'emailjs-com';
import { Alert, Form, Row, Col } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

class EmailUs extends React.Component {
  constructor (props) {
    super(props)
    this.state= {
      showSuccess:false, showError:false, showForm:true,
      recaptchaToken:''
    }
  }

  onLoadRecaptcha = (recaptchaToken) => { 
    this.setState({recaptchaToken:recaptchaToken}) 
  }

  sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('gmail', 'contactus', e.target, 'user_JRbB5TQ5j7onKY2KNjfSf')
      .then((result) => {
        this.setState({showSuccess:true, showForm:false})
      }, (error) => {
        console.log(error);
        this.setState({showError:true, showForm:false})
      });
  }

  render() {
    return (
      <div>
        { this.state.showForm ?
          <Form className="contact-form" onSubmit={this.sendEmail}>
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
                <div className="reCaptcha">
                  <ReCAPTCHA
                      sitekey="6LcHk9MUAAAAAK7naDnDs6Fs-0PsMht_mn_76ogi"
                      onChange={this.onLoadRecaptcha}
                  />
                </div>
              </Col>
            </Form.Group>
            <Row className="justify-content-center">
              <input type="submit" value="Send" className="btn btn-warning btn-lg"/>
            </Row>
          </Form>
          : null 
        }
        { this.state.showSuccess ? 
          <Alert show={this.state.showSuccess} variant="success">
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
        { this.state.showError ?
          <Alert show={this.state.showError} variant="danger">
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
    )
  };
}
export default EmailUs

