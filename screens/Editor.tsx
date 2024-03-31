/* eslint-disable react-native/no-inline-styles */
import {SafeAreaView, StatusBar} from 'react-native';
import React, {Fragment} from 'react';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import EditorForm from '../components/EditorForm';

interface EditorProps {
  navigation: NavigationProp<ParamListBase>;
}

const Editor: React.FC<EditorProps> = ({navigation}) => {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#000000'}}>
        <EditorForm navigation={navigation} />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: '#071f16'}} />
    </Fragment>
  );
};

export default Editor;
