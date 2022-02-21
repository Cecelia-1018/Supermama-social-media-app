import React, {useState, useEffect} from 'react';
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
import {Button, Card, IconButton, Title, Colors, Avatar} from 'react-native-paper';

function ProfileView({navigation, route}){
    //navigation
    const {item} = route.params;
    
    //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState(undefined);
  
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + item.userId) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }, []);



     return (
     <View> 
     <Avatar.Image size={64} source={{uri: imageUrl}} />
     <Text>{item.username}</Text>
     <Text>{item.bio}</Text>

     </View>
     );
}

export default ProfileView;
