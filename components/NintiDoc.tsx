/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
interface NintiDocProps {
  back: () => void;
}

const NintiDoc = ({back}: NintiDocProps) => {
  return (
    <LinearGradient
      colors={['#000000', '#000000', '#071f16']}
      start={{x: 0.5, y: 0.5}}
      style={styles.linearGradient}>
      <TouchableOpacity
        onPress={back}
        style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
        <Image source={require('../assets/icons/left-arrow.png')} />
        <Text style={{color: 'white', fontSize: 21, fontWeight: '800'}}>
          Back
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Connect to NintiDoc</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>You can either connect</Text>
            <Text style={styles.subtitleText}>NintiMic / NintiGlass</Text>
          </View>
        </View>
        <Text style={styles.bigTitleText}>ninti.Glass</Text>
        <Text style={styles.subtitleText}>
          Open Ninti app in AR glass and show below pattern to join the meeting
        </Text>
        <View style={styles.qrContainer}>
          <Image
            source={require('../assets/icons/qr.png')}
            style={styles.qrImage}
          />
          <Image
            source={require('../assets/icons/scan.png')}
            style={styles.scanImage}
          />
          <Image source={require('../assets/icons/instrument.png')} />
        </View>
        <View style={{paddingTop: wp(3)}}>
          <Text style={styles.bigTitleText}>ninti.Mic</Text>
          <Text style={styles.subtitleText}>
            Turn on the device Say “Hello Ninti Connect”
          </Text>
          <Animatable.View animation="pulse" iterationCount="infinite">
            <Image
              source={require('../assets/icons/mic-btn.png')}
              style={{marginTop: -wp(10)}}
            />
          </Animatable.View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(3),
  },
  titleContainer: {
    gap: 4,
    alignItems: 'center',
    paddingBottom: hp(2),
  },
  titleText: {
    fontSize: wp(6),
    fontWeight: '400',
    color: 'white',
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: wp(4),
    fontWeight: '400',
    color: 'grey',
    textAlign: 'center',
    maxWidth: wp(70),
  },
  bigTitleText: {
    fontSize: wp(8),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    paddingVertical: hp(1),
  },
  qrContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  qrImage: {
    marginBottom: hp(1),
  },
  scanImage: {
    position: 'absolute',
    top: '40%',
  },
});

export default NintiDoc;
