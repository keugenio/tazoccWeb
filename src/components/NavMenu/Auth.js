import React from 'react'
import {Card} from 'react-bootstrap';

class Auth extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: null
    }
  }

  render(){

    const { username } = this.state;
    return(
      <div style={{fontSize:'1.5rem', marginRight:'2rem'}}>
        <div className="App-intro">
          { !username &&
            <div>
              login
            </div>
          }
          {username &&
            <p>Welcome back, {username}</p>
          }
        </div>
      </div>
    )
  }
}

export default Auth