import React,{useState} from 'react';
import {View, Text, StyleSheet,StatusBar,Alert, Image} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Avatar} from './Avatar';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'; 
import { createDrawerNavigator } from '@react-navigation/drawer';
import VerifyProScreen from '../VerifyPro/VerifyProScreen';
import LogOut from './LogOut';
import auth, {firebase} from '@react-native-firebase/auth';
import {Button,Card, IconButton, Title} from 'react-native-paper';

const Drawer = createDrawerNavigator();

function GuestProfile({navigation}){
  return(
   <View style={{ flex: 1,alignItems: 'center', justifyContent: 'center',backgroundColor: 'white' }}>
   
   <Title>Hey, get your sign in!</Title>
   <Button> Go Sign In </Button>
      <Image
        style={styles.tinyLogo}
        source={require('./Mobile-login.jpg')}
      />
      <Text>Designed by  / Freepik</Text>
    </View>
  );
}

function ProfileInfo(){
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

  // const user = firebase.auth().currentUser;
  // if (user) {
  //  console.log('User email: ', user.email);
  // }
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



function Profile(){
 const user = firebase.auth().currentUser;
 if(user) {
   return (
    <Text> {user.email}</Text>
   );
 }
 return (
   <GuestProfile/>
 );

}

function ProfileScreen( ) {
  return (
  <Drawer.Navigator>
    <Drawer.Screen name="User Profile" component={Profile} />
    <Drawer.Screen name="Apply Verify Professional" component={VerifyProScreen} />
    <Drawer.Screen name="Log Out" component={LogOut} />
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
