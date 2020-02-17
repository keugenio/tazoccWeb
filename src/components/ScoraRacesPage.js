import React from 'react';
import moment from 'moment';
import { CardColumns, Card, ListGroup } from 'react-bootstrap';
import ScoraRacesResults from './ScoraRacesResults';

const ScoraRacesPage = () => {
  return (
    <div className="scoraRacesPage container-fluid">
      <div><p className="text-center text-white pageTitle">{moment().subtract(1, "year").format('YYYY')} SCORA Race Results</p></div>
      <CardColumns>
        <Card bg="primary" className="text-light">
          <Card.Title>Crystal Pier</Card.Title>
          <Card.Body>
            <ListGroup>
              <ListGroup.Item><ScoraRacesResults race="cp_short" /></ListGroup.Item>
              <ListGroup.Item><ScoraRacesResults race="cp_coed" /></ListGroup.Item>
              <ListGroup.Item><ScoraRacesResults race="cp_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Card bg="primary" className="text-light">
          <Card.Title>Kahanamoku Klassic</Card.Title>
          <Card.Body>
            <ListGroup>
            <ListGroup.Item><ScoraRacesResults race="kk_short" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="kk_coed" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="kk_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        
        <Card bg="primary" className="text-light">
          <Card.Title>Battle of the Bay</Card.Title>
          <Card.Body>
            <ListGroup>
            <ListGroup.Item><ScoraRacesResults race="bob_short" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="bob_coed" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="bob_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card> 

        <Card bg="primary" className="text-light">
          <Card.Title>Iron Champ's</Card.Title>
          <Card.Body>
            <ListGroup>
            <ListGroup.Item><ScoraRacesResults race="iron_short" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="iron_coed" /></ListGroup.Item>
            <ListGroup.Item><ScoraRacesResults race="iron_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card> 
        
        <Card bg="primary" className="text-light">
          <Card.Title>Whitey Harrison</Card.Title>
          <Card.Body>
            <ListGroup>
                <ListGroup.Item><ScoraRacesResults race="whitey_coed" /></ListGroup.Item>
                <ListGroup.Item><ScoraRacesResults race="whitey_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Card bg="primary" className="text-light">
          <Card.Title>Paopao</Card.Title>
          <Card.Body>
            <ListGroup>
                <ListGroup.Item><ScoraRacesResults race="paopao_coed" /></ListGroup.Item>
                <ListGroup.Item><ScoraRacesResults race="paopao_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        
        <Card bg="primary" className="text-light">
          <Card.Title>Catalina</Card.Title>
          <Card.Body>
            <ListGroup>
                <ListGroup.Item><ScoraRacesResults race="catalina_coed" /></ListGroup.Item>
                <ListGroup.Item><ScoraRacesResults race="catalina_mens" /></ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>        
      </CardColumns>
    </div>
  );
};

export default ScoraRacesPage;