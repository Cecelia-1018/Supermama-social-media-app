import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import {Button, Card, IconButton, Title, Colors} from 'react-native-paper';

function ProfileView({navigation, route}){
    //navigation
    const {item} = route.params;
     return (
     <View> 
     <Text>{item.username}</Text>
     <Text>{item.bio}</Text>

     </View>
     );
}

export default ProfileView;
