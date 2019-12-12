import React from 'react';
import { connect } from 'react-redux';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import firebase from '../Firebase.js';
import { setSelectedPaddler } from '../../store/store';
import moment from 'moment';
import Monogram from '../Monogram';

class PaddlerBio extends React.Component{
  constructor(props) {
    super(props)
    this.state={
      showEditable:false
    }
  }
  componentDidMount(){

  }
  render (){
    return (
      <Card className="paddlerBio">
        <Card.Title  className="bg-success text-white d-flex justify-content-between">
          <div>About {this.props.selectedPaddler.name}</div>
          {this.props.selectedPaddler.image && (<div><Image src={this.props.selectedPaddler.image} fluid roundedCircle style={{width:"75px"}}/></div>)}
          {!this.props.selectedPaddler.image && (<Monogram name={this.props.selectedPaddler.name} />)}
        </Card.Title>
        <Card.Body>
          {!this.state.showEditable && (
            <div>
              <Row>
                <Col lg={4} xs={12} className="flex-row text-dark">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="duesPaid">Dues Paid for {moment().format('YYYY')}</label>
                    <span>
                      {this.props.selectedPaddler.duesPaid && <span>Yes</span> }
                      {!this.props.selectedPaddler.duesPaid && <span className="text-danger font-weight-bold">NO</span> }
                    </span>
                  </div> 
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="membershipType">Membership Type:</label>
                    <span name="membershipType">{this.props.selectedPaddler.membershipType || 'n/a'}</span>                  
                  </div>
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="age">age:</label>
                    <span name="age">{`${moment().diff('1968-01-12', 'years')},  ${moment('1968-01-12').format('MMM YYYY')}`} </span>
                  </div>                
                  <div className="form-check">
                    <label className="form-check-label" htmlFor="jerseySize">jersey size:</label>
                    <div name="jerseySize">{this.props.selectedPaddler.jerseySize || 'n/a'}</div>
                  </div>                  
                </Col>
                <Col lg={4} xs={3} className="flex-row">
                  <div className="form-check">
                    <div className="ml-4">{this.props.selectedPaddler.sex || 'no sex assigned yet'}</div>
                  </div>  
                </Col>                             
              </Row>
            </div>)}        </Card.Body>
      </Card>
  )}
}

const MapStateToProps = ({selectedPaddler}) => ({
  selectedPaddler
})
export default connect(MapStateToProps)(PaddlerBio)