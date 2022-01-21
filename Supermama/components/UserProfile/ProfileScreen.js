import React, {useState,useCallback} from 'react';
import {View, RefreshControl,Linking, Text, StyleSheet, StatusBar, Alert, Image} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Avatar} from './Avatar';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import VerifyProScreen from '../VerifyPro/VerifyProScreen';
import LogOut from './LogOut';
import auth, {firebase} from '@react-native-firebase/auth';
import {Button, Card, IconButton, Title} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function GuestProfile() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Title>Hey, get your sign in!</Title>
      <Button
        onPress={() => {
          navigation.navigate('SigninScreen');
        }}
        color="#FE7E9C">
        Go Sign In{' '}
      </Button>
      {/* <Button
        onPress={() => {
         navigation.navigate('Profile');
        }}
        color="#FE7E9C">
        Press if you signed in.{' '}
      </Button> */}
      <Image style={styles.tinyLogo} source={require('./Mobile-login.jpg')} />
      <Text style={{color: 'blue'}}
      onPress={() => Linking.openURL('http://www.freepik.com')}>
      Designed by  / Freepik
      </Text>
    </View>
  );
}

 const onAvatarChange = (image: ImageOrVideo) => {
    console.log(image);

    // user id
    let userId = 'U002';

    // upload image to server here
    let reference = storage().ref('gs://supermama-6aa87.appspot.com/' + userId); //2
    let task = reference.putFile(image.path.toString());

    task
      .then(() => {
        console.log('Image uploaded to the bucket!');
      })
      .catch(e => console.log('uploading image error =>', e));
  };

function ProfileInfo(){
  
   firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('user logged');
      
      }
   });
const user = firebase.auth().currentUser;
return (
      <View style={styles.scroll}>
      {/* <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          /> */}
      <StatusBar barStyle="dark-content" />
      <View style={styles.userRow}>
        <Avatar
          onChange={onAvatarChange}
          source={require('./sample.jpg')}
        />
       <Text> {user.email}</Text>
       {/* <Text>Need User Info</Text> */}
      </View>
      <View style={styles.content} />
    </View>
    );
  
}

class Profile extends React.Component{
   
  //  const [refreshing, setRefreshing] = useState("");
  //  const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);
  
  render() {
  
  const user = firebase.auth().currentUser;
  if (user) {
    return <ProfileInfo/>;
  }else {
    return <GuestProfile />;
  }
  
}
}


function ProfileScreen() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="User Profile" component={Profile} />
      <Drawer.Screen
        name="Apply Verify Professional"
        component={VerifyProScreen}
      />
      <Drawer.Screen name="Log Out" component={LogOut} />
    </Drawer.Navigator>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 0,
    flexDirection: "column",
    backgroundColor: 'white',
  },
  leftItem: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
  },
  rightItem: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 200,
    paddingLeft: 25,
    paddingTop: 15,
  },
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
