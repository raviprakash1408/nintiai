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

// import LoginForm from '../components/LoginForm';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // @ts-ignore
  const handleEmailChange = text => {
    setEmail(text.toLowerCase());
  };
  // @ts-ignore
  const handlePasswordChange = text => {
    setPassword(text);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (email && password) {
        const controller = new AbortController(); // For timeout
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        const response = await fetch(
          'https://ninti-backend.onrender.com/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId); // Clear timeout if the request completes in time

        const data = await response.json();

        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          navigation.navigate('Home');
        } else {
          Alert.alert(
            'Error',
            'Failed to log in. Please check your credentials.',
          );
        }
      }
    } catch (error) {
      if (error) {
        Alert.alert('Error', 'Login request timed out. Please try again.');
      } else {
        Alert.alert('Error', 'An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); // Hide loader irrespective of the outcome
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
              Login
            </Text>
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
                gap: 4,
              }}
              onPress={handleLogin}>
              {loading && <ActivityIndicator color={'white'} />}
              <Text style={{color: 'white', fontSize: 22, fontWeight: '600'}}>
                Login
              </Text>
            </TouchableOpacity>
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
              onPress={() => navigation.navigate('Signup')}>
              <Text style={{color: 'white', fontSize: 22, fontWeight: '600'}}>
                Go to signup
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
