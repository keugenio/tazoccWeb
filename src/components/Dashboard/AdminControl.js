import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import {dbAllPaddlers} from '../Firebase';
import { addPaddlerToAllPaddlers, clearAllPaddlers } from '../../store/store';
import "babel-polyfill";
import SCORA_INFO from '../Dashboard/SCORA_INFO';
import Search from './Search';
import LoadingIcon from '../LoadingIcon';
import PaddlerBio from './PaddlerBio';
import RacesAdmin from './Races/RacesAdmin';
import EditRole from '../Auth/EditRole';
import Attendance from './Attendance';

class AdminControl extends React.Component{
  constructor(){
    super();
    this.state = {
      loading:true
    }
  }
  async componentDidMount(props){
    await dbAllPaddlers.get()
      .then(paddlers=>{
        paddlers.forEach(paddler=>{
          dbAllPaddlers.doc(paddler.id).get().then(doc=>{
            this.props.dispatch(addPaddlerToAllPaddlers(doc.data()))
          })
        })
        this.setState({loading:false})     
      })
  }
  componentWillUnmount(){
    this.props.dispatch(clearAllPaddlers())
  }
  render(){
    if (this.state.loading)
      return (<LoadingIcon/>)
    else 
      return (
        <div className="adminContainer">
          <Card bg="dark" text="white" className="dashboard">
            <Card.Title className="bg-warning text-white">Admin Dashboard</Card.Title>
            <Card.Body>
              <Row className="border-light border rounded p-4 mx-1 my-4">
                <Col lg={8} xs={12}>
                  {this.props.selectedPaddler && (<PaddlerBio />)}
                  <SCORA_INFO />
                </Col>
                <Col lg={4} xs={12}>
                  <Search />
                </Col>
              </Row>
              {this.props.user.role == "superAdmin" && (
                <Row>
                  <Col lg={6}>
                    <EditRole />
                  </Col>
                </Row>
              )}
              <Row>
                <Col>
                  <RacesAdmin currentPage = {this.props.location.pathname}/>
                  <Attendance />
                </Col>   
              </Row>
            </Card.Body>
          </Card>
      </div>
    )};
}

const MapStateToProps = ({selectedPaddler, paddlers, user}) => ({
  selectedPaddler,paddlers, user
})
export default connect(MapStateToProps)(AdminControl)
