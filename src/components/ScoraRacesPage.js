import React from 'react';
import moment from 'moment';
import { CardColumns, Card, ListGroup } from 'react-bootstrap';
import ScoraRacesResults from './ScoraRacesResults';

const ScoraRacesPage = () => {
  return (
    <div className="scoraRacesPage container-fluid">
      <div><p className="text-center text-white pageTitle">{moment().subtract(1, "year").format('YYYY')} SCORA Race Results</p></div>
      <CardColumns>
        <Card bg="primary">
          <Card.Title>Crystal Pier</Card.Title>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item><ScoraRacesResults race="cp_short" /></ListGroup.Item>
              <ListGroup.Item><ScoraRacesResults race="cp_coed" /></ListGroup.Item>
              <ListGroup.Item><ScoraRacesResults race="cp_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </CardColumns>
    </div>
  );
};

export default ScoraRacesPage;