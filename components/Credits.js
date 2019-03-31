import React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  View
} from 'react-native';
import SK from '../assets/images/SK.png';

// Config
import colours from '../config/colours';
// Constants
// GA tracking

const Credits = () => (
  // <TouchableOpacity
  //   style={styles.creditsContainer}
  //   onPress={() => Linking.openURL(portfolio).then(() => {
  //     Expo.Amplitude.logEvent(`BUTTON: Credits - ${props.screen} Screen`);
  //     analytics.event(
  //       new Event('Button', 'Tap', `Credits - ${props.screen} Screen`)
  //     );
  //   })
  //   }
  // >
  <View style={styles.creditsContainer}>
    <Image source={SK} style={styles.creditsImage} />
    <Text style={styles.creditsText}>
      Design and development
      {'\n'}
      {' '}
        by K15
    </Text>
  </View>
);

export default Credits;

//  Styles
const styles = StyleSheet.create({
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
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
