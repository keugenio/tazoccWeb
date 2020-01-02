import React from 'react'
import {Button, Badge} from 'react-bootstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class UnreadNewsBadge extends React.Component {  
  render() {   
    return (
      <Button variant="primary" href="/news" className="titleHoverMessage" title={`${this.props.amountUnread} unread articles`}>
        <FontAwesomeIcon icon="newspaper" />
        <Badge className = "ml-2" variant="warning" title="logout" >{this.props.amountUnread }</Badge>
      </Button>
    )  
    
  }
}

const MapStateToProps = (({user})=>({
  amountUnread:user.amountStillNeedsToRead
}))
export default connect(MapStateToProps)(UnreadNewsBadge)