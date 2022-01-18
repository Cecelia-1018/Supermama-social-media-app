import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Apply from './Apply';
import Verify from './Verify';

const Tab = createMaterialTopTabNavigator();



function VerifyProScreen() {
  return (
     <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Apply" component={Apply} />
      <Tab.Screen name="Verify" component={Verify} />
    </Tab.Navigator>
  );
}

export default VerifyProScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});