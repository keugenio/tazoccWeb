import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import firebase, {dbAllPaddlers} from '../Firebase';
import { setAllPaddlers } from '../../store/store';
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
    // load up the store with paddlers
    await dbAllPaddlers.on('value', snapshot => {
      // snapshot is an object. convert to array
      let paddlers = Object.values(snapshot.val())
      
      this.props.dispatch(setAllPaddlers(paddlers))
      this.setState({loading:false})
    })
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
              <Row>
                <Col lg={8} xs={12}>
                  {this.props.selectedPaddler && (<PaddlerBio />)}
                  <SCORA_INFO />
                </Col>
                <Col lg={4} xs={12}>
                  <Search />
                  {this.props.user.role == "superAdmin" && (<EditRole />)}
                </Col>
              </Row>
              <Row>
                <Col>
                  <RacesAdmin />
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
