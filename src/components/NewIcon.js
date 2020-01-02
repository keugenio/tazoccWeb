import React from 'react'
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewIcon = (props) => {
  const {id, readNews} = props;
  let show=readNews? !readNews.includes(id): false;
  if (show) 
    return (
      <Badge variant="warning" className="ml-auto text-dark d-flex">
        new  <FontAwesomeIcon icon="star" className="ml-2"/>
      </Badge>
    )
  return null
}

const MapStateToProps = ({ user}) => ({
   readNews:user.readNews
})

export default connect (MapStateToProps)(NewIcon)