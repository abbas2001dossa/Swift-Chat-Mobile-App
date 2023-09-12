import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import RegisterScreen from './Screens/RegisterScreen'
import LoginScreen from './Screens/LoginScreen'
import HomeScreen from './Screens/HomeScreen'
import { Provider } from 'react-redux';
import {Store} from './Store';
import FriendsScreen from './Screens/FriendsScreen'
import ChatScreen from './Screens/ChatScreen'
import ChatMessageScreen from './Screens/ChatMessageScreen'


const StackNavigator = () => {
    const Stack=createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator>

            <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}></Stack.Screen>
            <Stack.Screen name='Home' component={HomeScreen} ></Stack.Screen>
            <Stack.Screen name="Friends" component={FriendsScreen}></Stack.Screen>
            <Stack.Screen name='Chats' component={ChatScreen}></Stack.Screen>
            <Stack.Screen name="Messages" component={ChatMessageScreen}></Stack.Screen>

        </Stack.Navigator>
      </Provider>  
    </NavigationContainer>
  )
}

export default StackNavigator