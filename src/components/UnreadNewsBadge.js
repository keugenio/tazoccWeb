import React from 'react'
import {Button, Badge} from 'react-bootstrap';
import { connect } from 'react-redux';
import store from '../store/store';

class UnreadNewsBadge extends React.Component {

  render() {
    return (
      <Button variant="primary" href="/news">
        unread News 
        <Badge className = "ml-2" variant="warning">{this.props.amountUnread}</Badge>
      </Button>
    )  
    
  }
}

const MapStateToProps = (({readNewsArticles})=>({
  amountUnread:readNewsArticles.amountUnread
}))
export default connect(MapStateToProps)(UnreadNewsBadge)