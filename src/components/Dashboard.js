import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import { navigate } from '@reach/router';

class Dashboard extends React.Component {

  render () {
    const {loggedIn, userName} = this.props
    if (loggedIn)
      return (
        <React.Fragment>
          <Card className="dashboard">
            <Card.Title>Hello {userName}!</Card.Title>
            
          </Card>)
        </React.Fragment>  
      )  
    else 
        return (
          <React.Fragment>
          <Card className="dashboard">
            <Card.Title>Please Login to view this page</Card.Title>            
          </Card>)
        </React.Fragment>            
        )
  }
}

const MapStateToProps = ({user})=>({
  loggedIn: user.userID || false,
  userName: user.userName || ''
})
export default connect(MapStateToProps)(Dashboard)