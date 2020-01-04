import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import GoogleApiKey from './keys/googleMapsKey';

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };  
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });    
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };  
  render() {
    return (
      <Map 
        google={this.props.google}
        zoom={17}
        style={style}
        initialCenter={{
          lat: 33.434428,
          lng: -111.931940
        }}>
 
        <Marker onClick={this.onMarkerClick}
          name={'Team Arizona practice site. Meet inside the boat yard before practice to help setup canoes.'} 
          icon={'/images/mapPushPin.png'}
          position={{lat: 33.434585, lng: -111.931789
          }}
        />

        <Marker
          onClick={this.onMarkerClick}
          name={'Carvana glass structure'}
          position= {{lat: 33.436720, lng: -111.926640}}
          icon={'/images/carvana.png'}
        />
        <Marker
          onClick={this.onMarkerClick}
          name={'If you come late, meet at the docks'}
          position= {{lat: 33.433644, lng: -111.931278}}
          icon={'/images/canoe_icon.png'}
        />

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: (GoogleApiKey.key)
})(MapContainer)

const style = {
  maxWidth: '90%',
  maxHeight: '80%'
}