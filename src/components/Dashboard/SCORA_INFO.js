import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { dbAllPaddlers } from '../Firebase';
import Swal from 'sweetalert2';

import { setSelectedPaddler, editSelectedPaddler } from '../../store/store'

class SCORA_INFO extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoraID:'SCXXX state',
      scoraWaiver:false,
      scoraSmartWaiver:false,
      huliDrill:false,
      oldScoraID:'',
      oldScoraWaiver:false,
      oldScoraSmartWaiver:false,
      oldHuliDrill:false,   
      showEditable:false   
    }

  }
  toggleSave = () => {
    //hide editable fields
    this.setState({showEditable:false})

    // write data to firestore and update store

    dbAllPaddlers.doc(this.props.selectedPaddler.paddlerID).set({
      ...this.props.selectedPaddler, 
      scoraID:this.state.scoraID,
      scoraWaiver:this.state.scoraWaiver,
      scoraSmartWaiver:this.state.scoraSmartWaiver,
      huliDrill:this.state.huliDrill        
    })
    .then(()=>{
      // update the selected paddlers info in the store from the database
      this.props.dispatch(setSelectedPaddler({
        ...this.props.selectedPaddler, 
        scoraID:this.state.scoraID,
        scoraWaiver:this.state.scoraWaiver,
        scoraSmartWaiver:this.state.scoraSmartWaiver,
        huliDrill:this.state.huliDrill        
      }));      
      //enable the select paddler input in the Search Component
      this.props.dispatch(editSelectedPaddler(true))  
    })
    .then(()=>{
      // clear state
      this.setState({scoraID:'', scoraSmartWaiver:false, scoraWaiver:false, huliDrill:false, oldHuliDrill:false, oldScoraID:false, oldScoraSmartWaiver:false, oldScoraWaiver:false, })
    })
    .catch(error=>{
      Swal.fire({
        icon: 'error',
        title: "Oops...",
        text: error,
        confirmButtonText: 'OK',
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }                  
      })     
    })


  
  }
  toggleEdit = () => {
    //display the editable fields
    this.setState({showEditable:true})
    // write the current values of the selected Paddler into state to update form
    const {scoraID, scoraWaiver, scoraSmartWaiver, huliDrill} = this.props.selectedPaddler;
    this.setState({
      scoraID:scoraID || 'SC', scoraWaiver: scoraWaiver || false, scoraSmartWaiver: scoraSmartWaiver || false, huliDrill: huliDrill | false,
      oldHuliDrill:huliDrill || false, oldScoraID:scoraID || false, oldScoraSmartWaiver:scoraSmartWaiver || false, oldScoraWaiver:scoraWaiver});

    //disable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(false))
  }
  toggleCancel = () => {
    // hide editable fields
    this.setState({showEditable:false})
    const {oldHuliDrill, oldScoraID, oldScoraSmartWaiver, oldScoraWaiver} = this.state;
    this.setState({scoraID:oldScoraID, scoraWaiver:oldScoraWaiver, scoraSmartWaiver:oldScoraSmartWaiver, huliDrill:oldHuliDrill});

    //enable the select paddler input in the Search Component
    this.props.dispatch(editSelectedPaddler(true))    
  }
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.checked})
  }
  handleChangeSCORAID = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  componentDidMount(){
    const {scoraID, scoraSmartWaiver, scoraWaiver, huliDrill} = this.props.selectedPaddler;
  }
  render(){
    return (
      <Card className="scoraInfo">  
        <Card.Title className="d-flex justify-content-between">
          {this.props.selectedPaddler && (<div>SCORA Info for {this.props.selectedPaddler.name}</div>)}
          {!this.props.selectedPaddler && (<div>Select a paddler to view SCORA Info</div>)}
          <div>
            {this.state.showEditable && (<Button onClick={this.toggleSave} className="btn-danger" ><FontAwesomeIcon icon="save" /></Button>)}
            {this.props.selectedPaddler && !this.state.showEditable && (<Button onClick={this.toggleEdit} className={this.state.showEdit}><FontAwesomeIcon icon="edit"/></Button>) }
            {this.state.showEditable && (<Button onClick={this.toggleCancel} className="btn-dark" >x</Button>)}          
          </div>
        </Card.Title>
        <Card.Body>
          {!this.state.showEditable && (
            <div>
              <Row>
                <Col lg={6} xs={12} className="flex-row text-dark">
                  <div className="input-group input-group-lg d-flex align-items-center">
                    SCORA ID:<div className="ml-2">{this.props.selectedPaddler.scoraID || 'none'}</div>    
                  </div>     
                </Col>
              </Row>
              <Row>
                <Col lg={4} xs={4} className="flex-row">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" name="scoraWaiverView" checked={this.props.selectedPaddler.scoraWaiver || false} disabled/>
                    <label className="form-check-label" htmlFor="scoraWaiver">SCORA Waiver</label>
                  </div>
                </Col>
                <Col lg={4} xs={4} className="flex-row">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" name="scoraSmartWaiverView" checked={this.props.selectedPaddler.scoraSmartWaiver || false} disabled/>
                    <label className="form-check-label" htmlFor="scoraSmartWaiver">SCORA Waiver</label>
                  </div>
                </Col>
                <Col lg={4} xs={4} className="flex-row">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" name="huliDrill" checked={this.props.selectedPaddler.huliDrill || false} disabled/>
                    <label className="form-check-label" htmlFor="scoraWaiver">Huli Drill</label>
                  </div>
                </Col>              
              </Row>
            </div>)}

            {this.state.showEditable && (
              <div>
                <Row>
                  <Col lg={6} xs={12} className="flex-row text-dark">
                    <div className="input-group input-group-lg d-flex align-items-center">
                      SCORA ID:
                      <input
                        type="text"
                        className="form-control ml-4"
                        name="scoraID"
                        placeholder="SCORA ID"
                        onChange={this.handleChangeSCORAID}
                        value={this.state.scoraID}
                      />     
                    </div>     
                  </Col>
                </Row>
                <Row>
                  <Col lg={4} xs={4} className="flex-row">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" name="scoraWaiver" checked={this.state.scoraWaiver} onChange={this.handleChange}/>
                      <label className="form-check-label" htmlFor="scoraWaiver">SCORA Waiver</label>
                    </div>
                  </Col>
                  <Col lg={4} xs={4} className="flex-row">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" name="scoraSmartWaiver" checked={this.state.scoraSmartWaiver} onChange={this.handleChange}/>
                      <label className="form-check-label" htmlFor="scoraSmartWaiver">SCORA Waiver</label>
                    </div>
                  </Col>
                  <Col lg={4} xs={4} className="flex-row">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" name="huliDrill" checked={this.state.huliDrill} onChange={this.handleChange}/>
                      <label className="form-check-label" htmlFor="scoraWaiver">Huli Drill</label>
                    </div>
                  </Col>              
                </Row>
              </div>)}            
        </Card.Body>
      </Card>
    )
  }
}

const MapStateToProps = ({selectedPaddler, selectedPaddlerEditable})=> ({
  selectedPaddler, selectedPaddlerEditable
})

export default connect(MapStateToProps)(SCORA_INFO)