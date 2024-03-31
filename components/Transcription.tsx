/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import useTranscriptionStore from '../store/transcriptionControlStore';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface TranscriptionProps {
  back: () => void;
  navigation: NavigationProp<ParamListBase>;
}

const Transcription = ({back, navigation}: TranscriptionProps) => {
  const {transcript, pauseTranscription, stopTranscription} =
    useTranscriptionStore();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when transcript updates
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [transcript]);
  return (
    <LinearGradient
      colors={['#000000', '#000000', '#071f16']}
      start={{x: 0.5, y: 0.5}}
      style={styles.linearGradient}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={back}
          style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <Image
            source={require('../assets/icons/left-arrow.png')}
            style={{width: wp(6)}}
          />
          <Text style={{color: 'white', fontSize: wp(4), fontWeight: '800'}}>
            Back
          </Text>
        </TouchableOpacity>
        {transcript && stopTranscription && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Editor')}
            style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
            <Text style={{color: 'white', fontSize: wp(4), fontWeight: '800'}}>
              Next
            </Text>
            <Image
              source={require('../assets/icons/right-arrow.png')}
              style={{width: wp(6)}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Feed from ninti.Mic</Text>
          <View style={styles.subtitleContainer}>
            <Text style={styles.subtitleText}>
              Its the preview from ninti.Glass
            </Text>
          </View>
        </View>
        <View style={styles.qrContainer}>
          <Image source={require('../assets/icons/recording.png')} />
        </View>
        <View style={{paddingTop: hp(2), gap: hp(3), alignItems: 'center'}}>
          <View
            style={{
              height: hp(6),
              borderRadius: wp(6),
              backgroundColor: '#202020',
              minWidth: wp(90),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: '500',
                color: 'white',
                textAlign: 'center',
              }}>
              Live Preview - Transcription
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
            }}>
            <Button title={pauseTranscription ? 'Resume' : 'Pause'} />
            <Button title={stopTranscription ? 'Stopped' : 'Stop'} />
          </View>
          <Image source={require('../assets/icons/bars.png')} />
        </View>
        <View style={{height: 330, paddingVertical: 20}}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: 300,
              width: '100%',
              paddingVertical: 5,
            }}>
            <View style={{paddingHorizontal: 6, marginBottom: 10}}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: 'white',
                  textAlign: 'auto',
                }}>
                {transcript}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Transcription;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  titleContainer: {
    gap: 4,
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'grey',
    textAlign: 'center',
    maxWidth: '70%',
  },
  bigTitleText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
  },
  qrContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    marginBottom: 10,
  },
  scanImage: {
    position: 'absolute',
    top: '40%',
  },
});
