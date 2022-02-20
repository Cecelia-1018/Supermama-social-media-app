import React, {useState} from 'react';
import {View} from 'react-native';
import {Avatar, Button, IconButton, Colors} from 'react-native-paper';
import {Text, TabView} from 'react-native-elements';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import StoreCategory from './StoreCategory';
import StoreAdd from './StoreAdd';

const RootStack = createStackNavigator();

// function Cart() {
//   return <Text h1>Cart</Text>;
// }
function StoreHome({navigation}) {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Super Mama Store"
        component={StoreCategory}
        options={{
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <IconButton
                icon="plus"
                color={Colors.black}
                size={25}
                onPress={() => navigation.navigate('Add Products')}
              />
              <IconButton
                icon="cart"
                color={Colors.black}
                size={25}
                onPress={() => navigation.navigate('Cart')}
              />
            </View>
          ),
        }}
      />
      {/* <RootStack.Screen
        name="Add Products"
        component={StoreAdd}
        options={{headerShown: true}}
      /> */}
      {/* <RootStack.Screen
        name="Cart"
        component={Cart}
        options={{headerShown: true}}
      /> */}
    </RootStack.Navigator>
  );
}

export default StoreHome;
