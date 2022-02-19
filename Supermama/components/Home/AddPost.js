import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';

import AddFeed from './AddFeed';
import AddEntertainment from './AddEntertainment2';
import {createStackNavigator} from '@react-navigation/stack';
const RootStack = createStackNavigator();

function posting({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={{width: 360, height: 470}}
          source={require('./AddPost_img.jpg')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}>Share Your Life With</Text>
        <ScrollView style={styles.choices}>
          <Button
            onPress={() => navigation.navigate('Upload Image')}
            color="#FE7E9C">
            Picture and Words
          </Button>
          <Button
            onPress={() => navigation.navigate('AddFeed')}
            color="#FE7E9C">
            Professional Feed
          </Button>
        </ScrollView>
      </View>
    </View>
  );
}

const AddPost = ({navigation}) => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Add Post" component={posting} />

      <RootStack.Screen name="AddFeed" component={AddFeed} />
    </RootStack.Navigator>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD1DC',
  },
  header: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'grey',
  },
  choices: {
    marginTop: 15,
  },
});
