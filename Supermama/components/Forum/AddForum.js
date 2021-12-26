import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';

function AddForum({navigation}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Forum!</Text>
      <Button title="go back" onPress={() => navigation.goBack()}/>
        
    </View>
  );
}

export default AddForum;