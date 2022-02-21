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
  FlatList
} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Avatar} from './Avatar';
import {utils} from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import VerifyProScreen from '../VerifyPro/VerifyProScreen';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Button, Card, IconButton, Title, Colors} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import RNRestart from 'react-native-restart';

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
      {/* <Button onPress={onButtonClick} color="#FE7E9C">
        Press refresh if you signed in.{' '}
      </Button> */}
      <Image style={styles.tinyLogo} source={require('./Mobile-login.jpg')} />
      <Text
        style={{color: 'blue'}}
        onPress={() => Linking.openURL('http://www.freepik.com')}>
        Designed by / Freepik
      </Text>
    </View>
  );
}

const onAvatarChange = (image: ImageOrVideo) => {
  console.log(image);

  const user = firebase.auth().currentUser;

  let userId = user.uid;

  // upload image to server here
  let reference = storage().ref('gs://supermama-6aa87.appspot.com/UserProfile/' + userId); //2
  let task = reference.putFile(image.path.toString());

  task
    .then(() => {
      console.log('Image uploaded to the bucket!');
    })
    .catch(e => console.log('uploading image error =>', e));
};

function ProfileInfo() {

  const navigation = useNavigation();

  const user = firebase.auth().currentUser;

  const [txtUserId, setTxtUserId] = React.useState(user.uid);

  //display data
  const [userCol, setUserCol] = useState([]);
  const {uid} = auth().currentUser;
  
  //reference of user
  const ref = firestore().collection('users').doc(uid);

 


  //check this user exist or not
  ref.get().then(documentSnapshot => {
     

       if(documentSnapshot.exists) {
          // work with documents
          console.log("user existed!");
       } else {
          //firebase with create users 
          ref.set({
          userId: user.uid,
          name: user.displayName,
          bio: "Kindly add up your bio.",
    })
    .then(() => {
      console.log('User Info added!');
    });
       }
    })
 
  //display user profile picture
  const [imageUrl, setImageUrl] = useState(undefined);
  
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }, []);
  
  

  // Get user on mount
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .where('userId', 'in', [uid])
      .onSnapshot(querySnapshot => {
        const userCol = [];

        querySnapshot.forEach(documentSnapshot => {
          userCol.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        
        setUserCol(userCol);
  });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => {
    return(
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
                      item: {
                        name: item.name,
                        bio: item.bio,
                        userId: item.userId,
                      },
                    });
                  }}/>
        <Avatar onChange={onAvatarChange} source={imageUrl? {uri: imageUrl} : require('./addimg.png')} />
        {imageUrl ?  null : <Text>Press image to upload photo.</Text>}
        <Text> {item.name}</Text>
        <Text style={{alignItems: 'center'}}> {item.bio}</Text>
      
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

    )
  }
  

  return (
    <FlatList
        // ref={flatlistRef}
        data={userCol}
        keyExtractor={item => item.userId}
        renderItem={renderItem}
      />
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

function ProfileScreen({navigation}) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="User Profile" component={Profile} 
      options={{
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
                <IconButton
                  icon={require('../Forum/search.png')}
                  color={Colors.black}
                  size={25}
                  onPress={() => navigation.navigate('Search User')}
                />
                 
             
            </View>
          ),
        }}/>
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
