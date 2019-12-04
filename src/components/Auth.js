import React, { useState }from 'react'
import {Card} from 'react-bootstrap';

const Auth = () => {
  const [helloUser, setHelloUser] = useState(null)
  if (helloUser)
    return (
      <Card className="auth">
        <Card.Img src="/images/A-with-tribal_300.png" className="rounded authIcon"/>
        <Card.Body><Card.Title>Hello!</Card.Title></Card.Body>
      </Card>
    )
  else
    return(
      <div style={{fontSize:'1.5rem', marginRight:'2rem'}}>
        Login
      </div>
    )
}

export default Auth