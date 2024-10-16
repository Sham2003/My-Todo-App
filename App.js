import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import TodoScreen from './screens/TodoScreen';
import ProfileScreen from './screens/ProfileScreen';
import { enableScreens } from 'react-native-screens';
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Todo" component={TodoScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    </GestureHandlerRootView>
  );
}
