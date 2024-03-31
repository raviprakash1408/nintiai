import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import GetStarted from './components/GetStarted';
import Editor from './screens/Editor';
import ProcessDoc from './screens/ProcessDoc';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'GetStarted'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GetStarted" component={GetStarted} />
        {/* <Stack.Screen name="Signup" component={Signup} /> */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen name="Editor" component={Editor} />
        <Stack.Screen name="Process" component={ProcessDoc} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
