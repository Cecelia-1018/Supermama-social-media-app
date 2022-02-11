import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  TextInput,
  Button,
  IconButton,
  Colors,
  Dialog,
  Portal,
} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import EntCom from './EntCom.js';

function EntertainmentDetails({route}) {
  //user
  const user = firebase.auth().currentUser;
  const {item} = route.params;

  //reference entid
  const [entId, setEntId] = useState(item.entId);
  const [postId, setPostId] = useState(item.userId);

  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const [follow, setFollow] = useState([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')

      .onSnapshot(querySnapshot => {
        const follow = [];

        querySnapshot.forEach(documentSnapshot => {
          follow.push(documentSnapshot.id);
          console.log(documentSnapshot.id);
        });

        setFollow(follow);
        console.log(follow);
        console.log(entId);
        if (follow == postId) setFollowing(true);
        console.log(following);
      });
    return () => subscriber();
  }, []);
  const onFollow = () => {
    console.log('follow');
    firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')
      .doc(item.userId)
      .set({})
      .then(setFollowing(true));
  };

  const onUnfollow = () => {
    firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')
      .doc(item.userId)
      .delete()
      .then(setFollowing(false));
  };

  return (
    <View style={styles.container}>
      <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
          <Avatar.Image size={50} source={{uri: item.avatar}} />
        </View>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
          <Text style={[styles.user]}> {item.username}</Text>
          <Text style={[styles.user]}> #{item.hashtag}</Text>
        </View>
      </View>
      <Text style={[styles.description]}>{item.description}</Text>
      <View style={[styles.grid]}>
        <Image style={styles.image} source={{uri: item.image}} />
      </View>

      {following ? (
        <Button
          style={[styles.follow]}
          color="black"
          mode="outlined"
          onPress={() => onUnfollow()}>
          Following
        </Button>
      ) : (
        <Button
          style={[styles.follow]}
          color="black"
          mode="outlined"
          onPress={() => onFollow()}>
          Follow
        </Button>
      )}
      {/* <EntCom /> */}
    </View>
  );
}

export default EntertainmentDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    padding: 5,
    margin: 3,
  },
  answer: {
    borderRadius: 5,
    padding: 5,
    margin: 3,
    fontSize: 15,
    color: 'black',
    borderColor: 'pink',
  },
  text: {
    fontSize: 10,
  },
  user: {textAlignVertical: 'top', fontSize: 15, color: 'black'},
  description: {fontSize: 17, color: 'black'},
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 190,
    height: 210,
    margin: 5,
    borderRadius: 10,
  },

  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
});
