import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import firebase, { allUsers } from '../Firebase';

import SCORA_INFO from '../Dashboard/SCORA_INFO';
import Search from './Search';

const AdminControl = (props) => {    
    return (
        (
          <div className="adminContainer">
            <Row>
              <Col>
                

              </Col>
            </Row>
            <Row>
              <Col lg={6} xs={12}>

              </Col>
              <Col lg={6} xs={12}>
                <Row>
                  <Col lg={6} xs={12}>
                    bio component 
                  </Col>
                  <Col lg={6} xs={12}>
                    bio image
                  </Col>              
                </Row>
              </Col>
            </Row>
            <Row>
              races component       
            </Row>
          </div>
    )

  )
}

const MapStateToProps = ({selectedPaddler, paddlers}) => ({
  selectedPaddler,
  paddlers
})
export default connect(MapStateToProps)(AdminControl)
