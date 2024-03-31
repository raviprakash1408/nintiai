/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {jobDetails} from '../utils/JobDetails';
import useSubMenuedStore from '../store/subMenuStore';
import PDFDoc from './PDFDoc';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface ProcessFormProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function ProcessForm({navigation}: ProcessFormProps) {
  const {showMenu} = useSubMenuedStore();
  const [diagnosis, setDiagnosis] = useState(jobDetails[showMenu].diagnosis);
  const [prognosis, setPrognosis] = useState(jobDetails[showMenu].prognosis);
  const [pdfPage, setPdfPage] = useState(false);

  const handleDiagnosisChange = (text: string) => {
    setDiagnosis(text.toLowerCase());
    jobDetails[showMenu].diagnosis = text;
  };

  const handlePrognosisChange = (text: string) => {
    setPrognosis(text.toLowerCase());
    jobDetails[showMenu].prognosis = text;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <LinearGradient
        colors={['#000000', '#071f16']}
        start={{x: 0.5, y: 0.5}}
        style={styles.linearGradient}>
        {!pdfPage && (
          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={Platform.select({ios: 100, android: 300})}
            style={{flex: 1}}>
            <View
              style={{marginTop: hp(5), paddingHorizontal: wp(3), gap: hp(2)}}>
              <Text
                style={{fontSize: wp(5), fontWeight: '500', color: 'white'}}>
                {jobDetails[showMenu].jobName}
              </Text>
              <Image
                source={require('../assets/icons/surgery.png')}
                style={{width: '100%', borderRadius: 10}}
              />
              <TouchableOpacity
                style={{
                  paddingVertical: wp(4),
                  paddingHorizontal: 6,
                  backgroundColor: '#00ffa3',
                  borderRadius: wp(30),
                  alignItems: 'center',
                  marginHorizontal: wp(8),
                }}
                onPress={() => setPdfPage(true)}>
                <Text
                  style={{fontSize: wp(4), fontWeight: '600', color: 'black'}}>
                  Save document
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal: wp(4), marginTop: hp(5), gap: 5}}>
              <Text
                style={{fontSize: wp(5), fontWeight: '500', color: 'white'}}>
                Diagnosis
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={diagnosis}
                  onChangeText={handleDiagnosisChange}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>
            <View style={{paddingHorizontal: wp(4), marginTop: hp(2), gap: 5}}>
              <Text
                style={{fontSize: wp(5), fontWeight: '500', color: 'white'}}>
                Prognosis
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={prognosis}
                  onChangeText={handlePrognosisChange}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
        {pdfPage &&
          diagnosis &&
          prognosis &&
          jobDetails[showMenu]?.description && (
            <PDFDoc
              diagnosis={diagnosis}
              prognosis={prognosis}
              description={jobDetails[showMenu].description || ''}
              navigation={navigation}
            />
          )}
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  inputContainer: {
    minHeight: hp(20),
    maxHeight: hp(22),
    borderColor: '#52526B',
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    color: 'white',
    fontSize: wp(4),
    padding: 10,
    flex: 1,
  },
});
