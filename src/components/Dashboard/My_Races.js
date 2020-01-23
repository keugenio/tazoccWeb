import React from 'react';
import { Card, CardDeck } from 'react-bootstrap';
import Race from '../Dashboard/Races/Race';
import AddRaceToPaddler from '../Dashboard/AddRaceToPaddler';

const My_Races = (props) => {

  return (
    <Card text="dark" style={{fontSize:'2rem'}}  className="bg-white-3">
      <Card.Title className="text-white bg-primary d-flex justify-content-between">My Races<AddRaceToPaddler /></Card.Title>
      <Card.Body>
        <CardDeck>
        
        { props.availableRaces.map((race)=>{
          return (
            <Race 
              key={race.raceID}
              race={race}
              currentPage = {props.currentPage}
              />
          )
        })}
      
        </CardDeck>
      </Card.Body>
  </Card>
  );

}

export default My_Races;