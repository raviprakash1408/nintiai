/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StatusBar} from 'react-native';
import React, {Fragment, useEffect} from 'react';
import Dashboard from '../components/Dashboard';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import useTranscriptionStore from '../store/transcriptionControlStore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

const Home: React.FC<HomeProps> = ({navigation}) => {
  const {startTranscription, stopTranscription} = useTranscriptionStore();

  // Function to delete the key from AsyncStorage
  // const deleteKeyFromAsyncStorage = async () => {
  //   try {
  //     await AsyncStorage.removeItem('token');
  //   } catch (error) {
  //     console.error('Error deleting key:', error.message);
  //   }
  // };

  // useEffect(() => {
  //   deleteKeyFromAsyncStorage();
  // }, []);

  useEffect(() => {}, [stopTranscription, startTranscription]);
  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}}>
        <Dashboard navigation={navigation} />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: '#071f16'}} />
    </Fragment>
  );
};

export default Home;
