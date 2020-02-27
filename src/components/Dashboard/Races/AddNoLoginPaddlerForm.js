import React, {useState} from 'react';
import { connect } from 'react-redux';
import { InputGroup, Row, Col, Button, Form, Card, FormGroup} from 'react-bootstrap';
import { addNewPaddler, addPaddlerToRace, updateRace } from '../../../store/store';
import { dbAllPaddlers, dbRacesToPaddlers } from '../../Firebase';
import moment from 'moment';
import Swal from 'sweetalert2';
import uuid from 'uuid';

function mapStateToProps({races}) {
  return { races };
}

const AddNoLoginPaddlerForm = (props) => {
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('female');
  const [validated, setValidated] = useState(false);
  

  const handleSubmit = (evt) => {
    const form = evt.currentTarget;
    evt.preventDefault();
    if (form.checkValidity() === false) {
      evt.preventDefault();
      evt.stopPropagation();

    }
    else {
      // add paddler to auth firestore
      const birthday = moment().subtract(age, "years").valueOf();
      let newPaddler = {name:displayName, birthday, sex:sex, scoraID:'', uid:('XXXX-'+ uuid())}

      dbAllPaddlers.doc(newPaddler.uid).set({
        ...newPaddler
      }).then(doc=>{
          // add new paddler to paddlers in store
          props.dispatch(addNewPaddler(newPaddler))          
        })
      dbRacesToPaddlers.add({
        enabled:true, paddlerID:newPaddler.uid, raceID:props.raceID
        }).then(d=>{
          // add paddler to race
          props.dispatch(addPaddlerToRace({
            raceToPaddlerID:d.id, paddlerID:newPaddler.uid, paddlerName:newPaddler.name, age:age, sex:newPaddler.sex
          }))
        })
        .then(()=>{
          // udpate race.paddleCount in the store
          let currRace = props.races.find(race=>race.id==props.raceID)
          currRace = {...currRace, paddlerCount:currRace.paddlerCount++}
          props.dispatch(updateRace(currRace))          
        })
        .then(()=>{
          Swal.fire({
            title:'success',
            icon:'success',
            text:'paddler added!',
            timer:1000
          })
        })
        .then(()=>{
          // call close Modal from parent
          props.handleCloseModal();
        })        
    }
    setValidated(true);    
  }
  return (
    <div className="mx-auto">
      <Form className="p-4" onSubmit={handleSubmit}  noValidate validated={validated}>
        <Row className="d-flex justify-content-center">
          <Col lg={6} className="border border-dark p-3 mx-auto">
            <Card variant="light">
              <Card.Body className="flex-column">
                <InputGroup className="d-flex align-items-centera border border-success p-3">
                  <InputGroup.Prepend className="mr-3 my-auto">Paddler Name</InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{fontSize:'2rem'}}
                    />
                  <Form.Control.Feedback type="invalid">
                    Please enter a name for the paddler.
                  </Form.Control.Feedback>                    
                </InputGroup>
                <Row>               
                  <Col lg={4}>
                    <InputGroup className="d-flex align-items-center border border-success mt-3 p-3">
                      <InputGroup.Prepend className="mr-3 my-auto">Age</InputGroup.Prepend>
                        <Form.Control
                          type="number"
                          placeholder="Age"
                          required
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          style={{fontSize:'2rem'}}
                          />
                        <Form.Control.Feedback type="invalid">
                          Please enter the age of the paddler.
                        </Form.Control.Feedback>
                    </InputGroup>
                  </Col>
                  <Col lg={4}>
                    <InputGroup className="d-flex align-items-center border border-success mt-3 p-3">
                      <InputGroup.Prepend className="mr-3 my-auto">Sex</InputGroup.Prepend>
                        <Form.Control as="select" value={sex} onChange={(e)=>setSex(e.target.value)} style={{fontSize:'2rem'}}>
                          <option value="female">female</option>
                          <option value="male">male</option>
                        </Form.Control>
                      </InputGroup>
                  </Col>                  
                </Row>                                
              </Card.Body>
            </Card>
            <div className="text-center">
              <Button variant="warning" type="submit" style={{fontSize:'2rem'}}>
                Add New Paddler
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default connect(mapStateToProps)(AddNoLoginPaddlerForm);