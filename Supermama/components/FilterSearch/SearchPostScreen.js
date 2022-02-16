import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

function SearchVideo() {
  return <Text>video</Text>;
}

function SearchEntertainments() {
  return <Text>entertainment</Text>;
}

function SearchProducts() {
  return <Text>Products</Text>;
}

function SearchPostScreen() {
  return (
     <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Search Video" component={SearchVideo} />
       <Tab.Screen name="Search Entertainment" component={SearchEntertainments} />
        <Tab.Screen name="Search Product" component={SearchProducts} />
      
    </Tab.Navigator>
  );
}

export default SearchPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});