/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  Button
} from 'react-native';

// eslint-disable-next-line import/no-extraneous-dependencies
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import axios from 'axios';

const Images = [
  { uri: '../assets/images/citizen.png' },
  { uri: '../assets/images/citizen.png' },
  { uri: '../assets/images/citizen.png' },
  { uri: '../assets/images/citizen.png' }
];

const { width, height } = Dimensions.get('window');

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const API_URL = 'https://hire-find.herokuapp.com/api/iter';

export default class Map extends Component {
  static get propTypes() {
    return {
      navigation: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      markers: [
        // {
        //   coordinate: {
        //     latitude: 10.844170,
        //     longitude: 106.770320
        //   },
        //   title: 'UTE HCMC',
        //   description: 'That is my university',
        //   image: Images[0]
        // },
        // {
        //   coordinate: {
        //     latitude: 10.844170,
        //     longitude: 106.770320
        //   },
        //   title: 'Second Best Place',
        //   description: 'This is the second best place in Portland',
        //   image: Images[1]
        // },
        // {
        //   coordinate: {
        //     latitude: 10.846540,
        //     longitude: 106.777820
        //   },
        //   title: 'Third Best Place',
        //   description: 'This is the third best place in Portland',
        //   image: Images[2]
        // },
        // {
        //   coordinate: {
        //     latitude: 10.848650,
        //     longitude: 106.771490
        //   },
        //   title: 'Fourth Best Place',
        //   description: 'This is the fourth best place in Portland',
        //   image: Images[3]
        // }
      ],

      region: null,
      lastLat: null,
      lastLong: null
    };
  }

  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  async componentDidMount() {
    this.watchID = navigator.geolocation.watchPosition(({ coords }) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      // eslint-disable-next-line prefer-const
      let region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      };
      this.onRegionChange(region, region.latitude, region.longitude);
    });

    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3);
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0)index = 0;
      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const { coordinate } = this.state.markers[index];
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta
            },
            350
          );
        }
      }, 10);
    });
  }

  async __findMe() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      let region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      };
      this.onRegionChange(region, region.latitude, region.longitude);
    });

    const data = this.props.navigation.getParam('details').geometry.location;

    await axios.get(`${API_URL}`,{
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        lat: data.lat,
        lng: data.lng
      },
      match: {
        hardware: true
      },
      sort: {
        exp: -1
      }
    }).then(({data: {cops}}) => {
      let res = cops;
      console.log(res[0])
      let newmark = {
        coordinate: {
          latitude: res[0].location.coordinates[1],
          longitude: res[0].location.coordinates[0]
        },
        title: 'UTE HCMC',
        description: 'That is my university',
        image: Images[0]
      };
      this.setState({
        markers: [...this.state.markers, newmark]
      });
      console.log(this.state);
    }).catch(err => console.log(err));
  }

  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      region,
      // If there are no new values set use the the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onMapPress = (e) => {
    let region = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5
    };
    this.onRegionChange(region, region.latitude, region.longitude);
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH)
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: 'clamp'
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp'
      });
      return { scale, opacity };
    });

    // const { navigation } = this.props;
    // const itemId = navigation.getParam('details');
    return (
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          region={this.state.region}
          style={styles.container}
          showsUserLocation
          showsCompass
          onPress={this.onMapPress}
        >
          {this.state.markers.map((marker, index) => {
            const scaleStyle = { transform: [{ scale: interpolations[index].scale }] };
            const opacityStyle = {
              opacity: interpolations[index].opacity
            };
              // eslint-disable-next-line no-unused-expressions
              <Marker
                coordinate={{
                  latitude: (this.state.lastLat + 0.00050) || -36.82339,
                  longitude: (this.state.lastLong + 0.00050) || -73.03569
                }}
              >
                <View>
                  <Text style={{ color: '#000' }}>
                    { this.state.lastLong } / { this.state.lastLat }
                  </Text>
                </View>
              </Marker>;
              return (
                <MapView.Marker key={index} coordinate={marker.coordinate}>
                  <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.ring, scaleStyle]} />
                    <View style={styles.marker} />
                  </Animated.View>
                </MapView.Marker>
              );
          })}
        </MapView>
        <View
          style={{
            position: 'absolute', // use absolute position to show button on top of the map
            top: '40%', // for center align
            alignSelf: 'flex-end', // for align to right
            backgroundColor: 'cyan'
          }}
        >
          <Button onPress={() => this.__findMe()} title="Find Me" />
        </View>

        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >

          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={require('../assets/images/citizen.png')}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden'
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  textContent: {
    flex: 1
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold'
  },
  cardDescription: {
    fontSize: 12,
    color: '#444'
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)'
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)'
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red',
  },
  pinText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10
  }
});
