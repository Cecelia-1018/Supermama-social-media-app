import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {Button, IconButton, Avatar} from 'react-native-paper';
import auth, {firebase} from '@react-native-firebase/auth';
import ForYouX from './ForYouX';
import firestore from '@react-native-firebase/firestore';
import RNRestart from 'react-native-restart';
import {FlatList} from 'react-native-gesture-handler';
const logout = () => {
  return firebase.auth().signOut(), RNRestart.Restart();
};

const ForYou = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const ref = useRef();
  const onPressFunction = () => {
    ref.current.scrollToEnd({animating: true});
  };
  const [userEnt, setUserEnt] = useState([]);
  // const user = firebase.auth().currentUser;
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(async documentSnapshot => {
          const following = await firestore()
            .collection('following')
            .doc(user.uid)
            .collection('userFollowing')
            .doc(documentSnapshot.id)
            .get();

          setUserEnt(value => [
            ...value,
            {
              ...documentSnapshot.data(),
              following: following.exists,
              key: documentSnapshot.id,
            },
          ]);
        });
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [user.uid]);

  const renderPostItem = ({item}) => {
    return (
      <View style={styles.item}>
        {item.following ? (
          <>
            {/* <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile View', {
                  //pass params here
                  item: {
                    username: item.name,
                    bio: item.bio,
                    userId: item.userId,
                  },
                });
              }}> */}
            <View style={[styles.line]}>
              <Text style={[styles.user]}>{item.name}</Text>
              <Text style={[styles.bio]}> {item.bio}</Text>
              <Text style={[{fontSize: 0}]}>{item.key}</Text>
            </View>
            {/* </TouchableOpacity> */}
          </>
        ) : null}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        data={userEnt}
        keyExtractor={item => item.userId}
        renderItem={renderPostItem}
      />
    </View>
  );
};

export default ForYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    margin: 10,
    padding: 10,
    borderColor: 'pink',
    borderWidth: 2,
  },
  user: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  bio: {
    fontSize: 15,
  },
});
