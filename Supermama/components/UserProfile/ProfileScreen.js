import React,{useState} from 'react';
import {View, Text, Button, StyleSheet,StatusBar,Alert} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Avatar} from './Avatar';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'; 
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

  function VerifyPro() {
  return (
    <View>
      <Text>Not VP Yet!</Text>
    </View>
  );
}

function Profile(){
 const onAvatarChange = (image: ImageOrVideo) => {
    console.log(image);
    
    // user id
    let userId = 'U002';

    // upload image to server here
    let reference = storage().ref('gs://supermama-6aa87.appspot.com/' + userId);   //2
    let task = reference.putFile(image.path.toString());

    task.then(() =>{
        console.log('Image uploaded to the bucket!');
    }).catch((e) => console.log('uploading image error =>', e));

   
  };



  return (
    <View style={styles.scroll}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.userRow}>
        <Avatar
          onChange={onAvatarChange}
          source={require('./sample.jpg')}
        />
       <Text>Need User Info</Text>
      </View>
      <View style={styles.content} />
    </View>
  );
}

function ProfileScreen( ) {
  return (
  <Drawer.Navigator>
    <Drawer.Screen name="User Profile" component={Profile} />
    <Drawer.Screen name="Apply Verify Professional" component={VerifyPro} />
  </Drawer.Navigator>
    
 );

  
  

 
};

export default ProfileScreen;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    flex: 1,
  },
  userRow: {
    alignItems: 'center',
    padding: 15,
    marginTop: 70,
  },
  content: {
    flex: 1,
    backgroundColor: '#d8d8db',
  },
});
