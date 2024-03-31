/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Fragment, useState} from 'react';

// import RegisterForm from '../components/RegisterForm';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

export default function Signup({navigation}: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, setRegister] = useState(false);
  const [success, setSuccess] = useState('');
  // @ts-ignore
  const handleNameChange = text => {
    setName(text);
  };
  // @ts-ignore
  const handleEmailChange = text => {
    setEmail(text.toLowerCase());
  };
  // @ts-ignore
  const handlePasswordChange = text => {
    setPassword(text);
  };

  const signUp = async () => {
    setRegister(true);
    try {
      if (name && email && password) {
        const response = await fetch(
          'https://ninti-backend.onrender.com/api/auth/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name,
              email: email,
              password: password,
            }),
          },
        );

        const data = await response.json();
        console.log(data);

        // Handle response according to your requirements
        if (response.ok) {
          setName('');
          setEmail('');
          setPassword('');
          setRegister(false);
          setSuccess('Signed up successfully!');
        } else {
          // Handle error case
          Alert.alert('Error', 'Failed to sign up. Please try again later.');
        }
      }
    } catch (error) {
      setRegister(false);
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };
  return (
    <Fragment>
      <SafeAreaView style={{backgroundColor: '#000000', flex: 1}}>
        <LinearGradient
          colors={['#000000', '#000000', '#071f16']}
          start={{x: 0.5, y: 0.5}}
          style={styles.linearGradient}>
          <KeyboardAwareScrollView>
            <View style={{alignItems: 'center'}}>
              <Image source={require('../assets/icons/Logo.png')} />
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 26,
                fontWeight: '800',
                marginBottom: 20,
              }}>
              Signup
            </Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="black"
              style={{
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: 'black',
                marginHorizontal: 4,
                borderRadius: 10,
                height: 50,
                marginVertical: 10,
              }}
              value={name}
              onChangeText={handleNameChange}
            />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="black"
              style={{
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: 'black',
                marginHorizontal: 4,
                borderRadius: 10,
                height: 50,
                marginVertical: 10,
              }}
              value={email}
              onChangeText={handleEmailChange}
            />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="black"
              style={{
                backgroundColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 5,
                color: 'black',
                marginHorizontal: 4,
                borderRadius: 10,
                height: 50,
                marginVertical: 10,
              }}
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#078f16',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
                borderRadius: 10,
                marginHorizontal: 4,
                flexDirection: 'row',
                gap: 5,
              }}
              disabled={register}
              onPress={signUp}>
              {register && <ActivityIndicator color={'white'} />}
              <Text style={{color: 'white', fontSize: 22, fontWeight: '600'}}>
                Sign Up
              </Text>
            </TouchableOpacity>
            {success && (
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  fontWeight: '500',
                  textAlign: 'center',
                  paddingTop: 10,
                }}>
                {success}
              </Text>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: '#078f16',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 30,
                borderRadius: 10,
                marginHorizontal: 4,
              }}
              disabled={register}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={{color: 'white', fontSize: 22, fontWeight: '600'}}
                onPress={() => navigation.navigate('Login')}>
                Go to login
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </LinearGradient>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: '#071f16'}} />
    </Fragment>
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
