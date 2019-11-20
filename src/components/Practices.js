import React from 'react'
import GoogleApiWrapper from './GoogleApiWrapper';
import mapRoute from './mapRoute';

console.log(mapRoute);



const Practices = () => {
  const stopEvent = (e) => {
    alert('pepe')
    e.stopPropagation();
  }
  return(
    <React.Fragment> 
      <div className="bgPracticeOverlay">
        <img src="/images/bg_nightime.jpg" className="fullsize-bg-image"></img>
        <div><p className="text-center text-white pageTitle">Practices</p></div>
        <div className="d-flex container-fluid p-5">
          <div className="col-md-6">
            <div className="practiceText">
              <h2>Team Arizona holds Open Practices</h2>
              <ul className="practiceTimes">
                <li>
                  <strike>Tuesday Evenings 6:30pm  (Open Practice)</strike> Cancelled till January 2020
                </li>
                <li>
                  Thursday Evenings 6:30pm (Open Practice)
                </li>
                <li>
                  Saturday Mornings 7:00am (Open Practice)
                </li>                        
              </ul>
              <p><strong>Practices are held on the north side of Tempe Town Lake at the marina.</strong></p>
              <p><strong>Directions to the marina:</strong></p>
              <ul>
                <li>From Loop 202 in Tempe, exit on Scottsdale Road and head North.  You must<strong> immediately</strong> get into the leftmost lane.  You&#8217;ll see the Carvana glass structure to your left.</li>
                <li>Turn at the first left on E. Gilbert Dr.</li>
                <li>Follow E. Gilbert Drive westward and the marina entrance is right after the overpass.</li>
                <li>Park anywhere in the parking lot and we gather on the west side of the boatyard.  Look for the blue and white canoes.</li>
              </ul>
            </div> 
          </div>       
          <div className="col-md-6">
          <div className="d-flex justify-content-center">
            <button className="btn btn-warning" data-toggle="modal" data-target="#MapModal">View Map</button>
          </div>            
          </div>
        </div>
      </div>

      <div className="modal fade" id="MapModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"  onClick={stopEvent} >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content h-75">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Team Arizona Practice Site</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <GoogleApiWrapper />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>        
        
      </React.Fragment>
  )
}

export { Practices as default }