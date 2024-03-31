/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {jobDetails} from '../utils/JobDetails';
import useSubMenuedStore from '../store/subMenuStore';
import useTranscriptionStore from '../store/transcriptionControlStore';

interface EditorProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function EditorForm({navigation}: EditorProps) {
  const {showMenu} = useSubMenuedStore();
  const [description, setDescription] = useState(
    jobDetails[showMenu].description,
  );
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to the bottom when component mounts or when description changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [description]);

  const handleDescriptionChange = (text: string) => {
    setDescription(text.toLowerCase());
    jobDetails[showMenu].description = text;
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const {setTranscript} = useTranscriptionStore();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <LinearGradient
          colors={['#000000', '#071f16']}
          start={{x: 0.5, y: 0.5}}
          style={styles.linearGradient}>
          <View style={{flex: 1}}>
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
                  backgroundColor: 'white',
                  borderRadius: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setTranscript('');
                  navigation.navigate('Process');
                }}>
                <Text
                  style={{fontSize: wp(4), fontWeight: '500', color: 'black'}}>
                  Process the doc - AI
                </Text>
                <Image source={require('../assets/icons/magicpen.png')} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                marginVertical: hp(5),
                paddingHorizontal: wp(3),
                gap: 5,
              }}>
              <Text
                style={{fontSize: wp(5), fontWeight: '500', color: 'white'}}>
                Full conversation
              </Text>
              <View
                style={{
                  flex: 1,
                  borderColor: '#52526B',
                  borderWidth: 1,
                  borderRadius: 10,
                }}>
                <ScrollView ref={scrollViewRef}>
                  <TextInput
                    style={{color: 'white', fontSize: wp(4), padding: 10}}
                    value={description}
                    onChangeText={handleDescriptionChange}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </ScrollView>
              </View>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  linearGradient: {
    flex: 1,
  },
  container: {
    borderRadius: 20,
    backgroundColor: '#202020',
    padding: 10,
  },
  completedContainer: {
    borderRadius: 20,
    borderColor: '#2FE48D',
    borderWidth: 2,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
