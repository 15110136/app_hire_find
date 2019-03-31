import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import keys from '../config/keys';


export default class MapInput extends Component {
  static get propTypes() {
    return {
      // notifyChange: PropTypes.object.isRequired
    };
  }

  render() {
    // const { notifyChange } = this.props;
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2}
        autoFocus
        returnKeyType="search"
        keyboardAppearance="light"
        listViewDisplayed={false}
        fetchDetails
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          console.log(details);
          // notifyChange(details.geometry.location);
        }}
        query={{
          key: keys,
          language: 'vi'
        }}
        debounce={1000}
      />
    );
  }
}
