import React from 'react'
import { connect } from 'react-redux';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NewIcon = ({readNewsArticles, id}) => {
  const show = !readNewsArticles.readNews.includes(id)
  if (show) 
    return (
      <Badge variant="warning" className="ml-auto text-dark d-flex">
        new  <FontAwesomeIcon icon="star" className="ml-2"/>
      </Badge>
    )
  return null
}

const MapStateToProps = ({news, readNewsArticles}) => ({
  news, readNewsArticles
})

export default connect (MapStateToProps)(NewIcon)