import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import keys from '../config/keys';

const homePlace = {};
this.navigator.geolocation.getCurrentPosition(({ coords }) => {
  homePlace.description = 'Home';
  const location = {
    lat: coords.latitude,
    lng: coords.longitude
  };
  homePlace.geometry = location;
});
export default class MapInput extends Component {
  static get propTypes() {
    return {
      navigation: PropTypes.object.isRequired
    };
  }

  render() {
    const { navigation } = this.props;
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2}
        autoFocus
        returnKeyType="search"
        keyboardAppearance="light"
        listViewDisplayed={false}
        fetchDetails
        enablePoweredByContainer={false}
        renderDescription={row => row.description || row.formatted_address || row.name}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          navigation.navigate('Map', {
            details
          });
        }}
        query={{
          key: keys,
          language: 'vi'
        }}

        currentLocation// Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Vị trí hiện tại"

        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          type: 'cafe'
        }}
        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: 'formatted_address'
        }}
        predefinedPlaces={[homePlace]}
        styles={{
          description: {
            color: '#fff',
            fontWeight: 'bold'
          },
          predefinedPlacesDescription: {
            color: '#fff'
          }
        }}
        debounce={500}
      />
    );
  }
}
