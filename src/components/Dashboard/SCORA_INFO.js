import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col } from 'react-bootstrap';

class SCORA_INFO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoraID:'SC',
      scoraWaiver:false,
      scoraSmartWaiver:false,
      huliDrill:false,
      scoraEdit:false,
      readOnly:true
    }

  }
  componentDidMount(props){
    // find the paddler from the store and load up scora info
    const paddler = props.paddlers.find(paddler=>paddler.id === props.paddlerID)
    // const {scoraID, scoraWaiver, scoraSmartWaiver, huliDrill } =  paddler
    // this.setState({scoraID, scoraWaiver, scoraSmartWaiver, huliDrill })
  }  
  render(){
    return (
      <Card >  
        <Card.Title>SCORA Info</Card.Title>
        <Card.Body>
          <Row>
            <Col lg={3} xs={12} className="flex-row">
              <div className="input-group input-group-lg">
              SCORA ID:
                <input
                  type="text"
                  className="form-control"
                  name="scoraID"
                  placeholder="SCORA ID"
                  value={this.state.scoraID}
                  onChange={this.handleChange}
                  readOnly
                />     
              </div>     
            </Col>
            <Col lg={3} xs={12} className="flex-row">SCORA Waiver:{this.scoraWaiver}</Col>
            <Col lg={3} xs={12} className="flex-row">Smart Waiver:{this.scoraSmartWaiver}</Col>
            <Col lg={3} xs={12} className="flex-row">Huli Drill:{this.huliDrill}</Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }
}

const MapStateToProps = ({paddlers, selectedPaddler})=> ({
  paddlers, selectedPaddler
})

export default connect(MapStateToProps)(SCORA_INFO)