import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import ForYouX from './ForYouX';
import SigninScreen from './SigninScreen';
import SignupScreen from './SignupScreen';
import {View} from 'react-native';

const RootStack = createStackNavigator();

const MainSign = ({navigation}) => (
  <RootStack.Navigator>
    <RootStack.Screen
      name="ForYouX"
      component={ForYouX}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="SigninScreen"
      component={SigninScreen}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="SignupScreen"
      component={SignupScreen}
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);

export default MainSign;
