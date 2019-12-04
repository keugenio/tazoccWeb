import React from 'react'
import {Button, Badge} from 'react-bootstrap';
import { connect } from 'react-redux';

class UnreadNewsBadge extends React.Component {
  constructor(){
    super();
    this.state = {
      numberOfUnreadArticles:0
    }
  }

  componentDidMount() {
      const {news, readNewsArticles} =  this.props;
      const numberOfUnreadArticles = ((news.length - readNewsArticles.length) >= 1) ? (news.length - readNewsArticles.length) : 0
      this.setState({numberOfUnreadArticles})
  }
  render() {

    return (
      <Button variant="primary" href="/news">
        unread News 
        <Badge className = "ml-2" variant="warning">{this.state.numberOfUnreadArticles}</Badge>
      </Button>
    )  
    
  }
}

const MapStateToProps = (({news, readNewsArticles})=>({
  news, readNewsArticles
}))
export default connect(MapStateToProps)(UnreadNewsBadge)