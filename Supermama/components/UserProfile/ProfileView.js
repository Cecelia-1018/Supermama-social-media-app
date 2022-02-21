import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import {Button, Card, IconButton, Title, Colors, Avatar} from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

function Posts() {
  return <Text>Post</Text>;
}

function Collections() {
  return <Text>Collections</Text>;
}

function Products() {
  return <Text>Products</Text>;
}

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
     <View style={styles.scroll}>
     <View style={styles.userRow}>
     <Avatar.Image size={90} source={{uri: imageUrl}} />
     <Text>{item.username}</Text>
     <Text>{item.bio}</Text>
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

export default ProfileView;

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
});
