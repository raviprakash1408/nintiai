/* eslint-disable react-native/no-inline-styles */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function GetStarted({navigation}: any) {
  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#17694a', '#000000', '#000000']}
        start={{x: 0.5, y: 0.1}}
        style={styles.linearGradient}>
        <View style={{flex: 1, alignContent: 'space-between'}}>
          <View style={styles.container}>
            <View style={styles.background}>
              <Image
                source={require('../assets/icons/Logo.png')}
                style={styles.image}
              />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'space-between', padding: 10}}>
            <View>
              <View>
                <Text style={styles.title}>ninti.ai</Text>
              </View>
              <View>
                <Text style={[styles.content, styles.wrapper]}>
                  Delivers Unmached
                </Text>
              </View>
              <View>
                <Text style={[styles.content1, styles.wrapper]}>
                  Precision & Insight for
                </Text>
              </View>
              <View>
                <Text style={[styles.content2, styles.wrapper]}>
                  Superior Medical
                </Text>
              </View>
              <View>
                <Text style={[styles.content3, styles.wrapper]}>Outcomes</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
            <View />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 5,
    marginBottom: 10,
  },
  background: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    width: 167,
    height: 173,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 183,
    height: 190,
  },
  imgwrapper: {
    width: 167,
    height: 173,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  title: {
    fontSize: 41,
    fontWeight: '700',
    fontFamily: 'Anek Bangla',
    color: '#F0FFF7',
    marginLeft: 10,
  },
  content: {
    width: '100%',
    fontSize: 33,
    fontWeight: '400',
    fontFamily: 'Anek Bangla',
    color: '#F0FFF7',
  },
  content1: {
    width: '100%',
    fontSize: 33,
    fontWeight: '400',
    fontFamily: 'Anek Bangla',
    color: '#d9d9d9',
  },
  content2: {
    width: '100%',
    fontSize: 33,
    fontWeight: '400',
    fontFamily: 'Anek Bangla',
    color: '#a6a6a6',
  },
  content3: {
    width: '100%',
    fontSize: 33,
    fontWeight: '400',
    fontFamily: 'Anek Bangla',
    color: '#8c8c8c',
  },
  wrapper: {
    marginVertical: 5,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Poppins',
    color: '#000',
  },
});
