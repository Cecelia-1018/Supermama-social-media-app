import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  RefreshControl,
  Linking,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
// import {Avatar} from './Avatar';
// import {utils} from '@react-native-firebase/app';
// import storage from '@react-native-firebase/storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VerifyProScreen from '../VerifyPro/VerifyProScreen';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Button, Card, IconButton, Title, Colors, Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart';
//import SigninScreen from '../Home/SigninScreen';

const Drawer = createDrawerNavigator();
const Tab = createMaterialTopTabNavigator();

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

function LogOut() {
  const logoutClick = () => {
    firebase.auth().signOut(), RNRestart.Restart();
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Button onPress={logoutClick} color="#FE7E9C">
        You will be logged out once click.
      </Button>
      <TouchableOpacity onPress={logoutClick}>
        <Image
          style={{width: 300, height: 510}}
          source={require('./logout.jpg')}
        />
      </TouchableOpacity>
      <Text
        style={{color: 'blue', fontSize: 10}}
        onPress={() => Linking.openURL('http://www.freepik.com')}>
        Designed by / Freepik
      </Text>
    </View>
  );
}

function GuestProfile() {
  const navigation = useNavigation();
  const [value, setValue] = useState('');

  useEffect(() => {
    // Resetting default value for the input on restart
    setValue('Default Value');
  }, []);

  const onButtonClick = () => {
    RNRestart.Restart();
  };

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
      <Button onPress={onButtonClick} color="#FE7E9C">
        Press refresh if you signed in.{' '}
      </Button>
      <Image style={styles.tinyLogo} source={require('./Mobile-login.jpg')} />
      <Text
        style={{color: 'blue'}}
        onPress={() => Linking.openURL('http://www.freepik.com')}>
        Designed by / Freepik
      </Text>
    </View>
  );
}


function ProfileInfo() {
  const navigation = useNavigation();

  
  const user = firebase.auth().currentUser;

  const [txtUserId, setTxtUserId] = React.useState(user.uid);
  
  //reference of user
  const ref = firestore().collection('users');

  //check this user exist or not
  ref.get().then((snap) => {
       if(!snap.empty) {
          // work with documents
          console.log("user existed!");
       } else {
         // Create some documents
          ref.doc(txtUserId).set({
          userId: txtUserId,
          name: user.email,
          bio: "Kindly add up your bio.",
    })
    .then(() => {
      console.log('User Info added!');
    });
       }
    })
  //firebase with create users 
  
 
  
  //display data
  const [userCol, setUserCol] = useState();
  const {uid} = auth().currentUser;

  const getUser = async () => {
    try {
      const documentSnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .get();

      const userData = documentSnapshot.data();
      setUserCol(userData);
    } catch {
      //do whatever
    }
  };

  // Get user on mount
  useEffect(() => {
    getUser();
  }, []);
  

  return (
    <View style={styles.scroll}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.userRow}>
        <IconButton
          style={[styles.editButton]}
          color={Colors.grey600}
          size={20}
          icon="pen"
          onPress={() => {
                    navigation.navigate('Edit Profile', {
                      userCol: {
                        name: userCol && userCol?.name,
                        bio: userCol && userCol?.bio,
                        userId: userCol && userCol?.userId,
                      },
                    });
                  }}/>
        <Avatar.Image size={100} source={require('./sample.jpg')} />
        <Text> {userCol && userCol?.name}</Text>
        <Text> {userCol && userCol?.bio}</Text>
      
        <Button
          mode="contained"
          onPress={() => alert('Button clicked')}
          color="#f0ccd2"
          style={styles.followButton}>
          Follow
        </Button>
      </View>
      <View style={styles.content}>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: {fontSize: 12},
            tabBarIndicatorStyle: {backgroundColor: '#f0ccd2'},
            tabBarStyle: {backgroundColor: 'white'},
          }}>
          <Tab.Screen name="Posts" component={Posts} />
          <Tab.Screen name="Collections" component={Collections} />
          <Tab.Screen name="Products" component={Products} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

function Posts() {
  return <Text>Post</Text>;
}

function Collections() {
  return <Text>Collections</Text>;
}

function Products() {
  return <Text>Products</Text>;
}

class Profile extends React.Component {
  render() {
    const user = firebase.auth().currentUser;
    if (user) {
      return <ProfileInfo />;
    } else {
      return <GuestProfile />;
    }
  }
}

class logOut extends React.Component {
  render() {
    const user = firebase.auth().currentUser;
    if (user) {
      return <LogOut />;
    } else {
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
      <Drawer.Screen name="Log Out" component={logOut} />
    </Drawer.Navigator>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    flex: 1,
  },
  userRow: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#d8d8db',
  },
  followButton: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  editButton: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});
