/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StatusBar} from 'react-native';
import React, {Fragment} from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import ProcessForm from '../components/ProcessPage';

interface ProcessDocProps {
  navigation: NavigationProp<ParamListBase>;
}

const ProcessDoc: React.FC<ProcessDocProps> = ({navigation}) => {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}}>
        <ProcessForm navigation={navigation} />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: '#071f16'}} />
    </Fragment>
  );
};

export default ProcessDoc;
