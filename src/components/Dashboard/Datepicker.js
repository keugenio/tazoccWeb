import React from 'react';
import { Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Datepicker = ({daysThatHadPractices, handleCalendarChange}) => {
  return (
      <Card text="dark" border="dark">
        <Card.Body className="d-flex justify-content-center">
          <DatePicker
            onChange={handleCalendarChange}
            defaultValue={new Date()}

            inline
          />                    
        </Card.Body>
      </Card>                    
  );
};

export default Datepicker;