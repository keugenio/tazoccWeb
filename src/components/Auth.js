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
    let {children} = this.props;
    if (this.state.helloUser)
      return (
        <Card className="auth">
          <Card.Img src="/images/A-with-tribal_300.png" className="rounded authIcon"/>
          <Card.Body><Card.Title>Hello!</Card.Title></Card.Body>
        </Card>
      )
    else {
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
}

export default Auth