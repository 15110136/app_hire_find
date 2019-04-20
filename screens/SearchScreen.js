
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback, Text
} from 'react-native';
import * as Expo from 'expo';
import PropTypes from 'prop-types';
/* eslint-disable import/no-extraneous-dependencies */
// import { EvilIcons } from '@expo/vector-icons';

import LK_LOGO from '../assets/images/Icon-1024.png';
import SK from '../assets/images/SK.png';

// Config
import colours from '../config/colours';
import MapInput from '../components/MapInput';


// Cache images
function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Expo.Asset.fromModule(image).downloadAsync();
  });
}

export default class SearchScreen extends React.Component {
  static get propTypes() {
    return {
      navigation: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.state = { showLogo: true };
  }

  componentDidMount() {
    Expo.Amplitude.initialize('6460727d017e832e2083e13916c7c9e5');
    Expo.Amplitude.logEvent('SCREEN: Search');
  }


  // Load logos
  _loadAssetsAsync = async () => {
    const imageAssets = cacheImages([LK_LOGO, SK]);
    await Promise.all([...imageAssets]);
  };

  getInfo = () => {
    if (this.cached) {
      this.setState({ showLogo: false });
    }
  };

  submitAndClear = () => {
    this.setState({ showLogo: true });
    Keyboard.dismiss();
  };

  render() {
    const {
      isReady, showLogo
    } = this.state;
    const { navigation } = this.props;
    if (!isReady) {
      return (
        <Expo.AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
    return (
      <SafeAreaView style={styles.safeView}>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={this.submitAndClear} accessible={false}>
          <View style={styles.container}>
            {showLogo && <Image style={styles.logo} source={LK_LOGO} />}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View>
                <Text style={styles.text}>Nhập địa chỉ</Text>
              </View>
              <View style={styles.searchContainer}>
                <MapInput navigation={navigation} />
              </View>
              <Text style={styles.text}>hoặc chọn vị trí hiện tại của bạn</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

//  Styles
const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  safeView: {
    flex: 1,
    backgroundColor: colours.primaryBlack
  },
  container: {
    flex: 1,
    backgroundColor: colours.primaryBlack,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 30
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 60,
    marginTop: 40
  },
  searchContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: 280,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 20,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: colours.highlightBlack,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    color: colours.primaryWhite
  },
  Suggestions: {
    flex: 1,
    alignItems: 'center',

    color: colours.primaryWhite
  },
  creditsContainer: {
    flexDirection: 'row',
    width: 170
  },
  creditsText: {
    fontSize: 12,
    color: colours.secondaryGrey,
    textAlign: 'left',
    paddingLeft: 20
  },
  creditsImage: {
    width: 30,
    height: 30,
    opacity: 0.2,
    alignSelf: 'flex-start'
  }
});
