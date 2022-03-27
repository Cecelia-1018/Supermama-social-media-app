import React, {useState} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import StoreCart from './StoreCart';
import StoreComplete from './StoreComplete';

const Tab = createMaterialTopTabNavigator();

function Cart() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarIndicatorStyle: {backgroundColor: '#f0ccd2'},
        tabBarStyle: {backgroundColor: 'white'},
      }}>
      <Tab.Screen name="Pending" component={StoreCart} />
      <Tab.Screen name="Complete" component={StoreComplete} />
    </Tab.Navigator>
  );
}

export default Cart;
