import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import firebase, {dbPaddlers} from '../Firebase';
import { setAllPaddlers } from '../../store/store';
import "babel-polyfill";
import SCORA_INFO from '../Dashboard/SCORA_INFO';
import Search from './Search';
import LoadingIcon from '../LoadingIcon';

class AdminControl extends React.Component{
  constructor(){
    super();
    this.state = {
      loading:true
    }
  }
  async componentDidMount(props){
    // load up the store with paddlers
    await dbPaddlers.on('value', snapshot => {
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
                <Col>
                  <Search />
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
            </Card.Body>
          </Card>
      </div>
    )};
}

const MapStateToProps = ({selectedPaddler, paddlers}) => ({
  selectedPaddler,
  paddlers
})
export default connect(MapStateToProps)(AdminControl)
