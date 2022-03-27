import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const user = firebase.auth().currentUser;
  const [userEnt, setUserEnt] = useState([]);
  const ref = useRef();

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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Chat Details', {
                //pass params here
                item: {
                  username: item.name,
                  bio: item.bio,
                  userId: item.userId,
                  following: item.following,
                  cuUsername: user.name,
                  cuUid: user.uid,
                },
              });
            }}>
            <View style={[styles.line]}>
              <Text style={[styles.user]}>{item.name}</Text>
              <Text style={[styles.bio]}> {item.bio}</Text>
              <Text style={[{fontSize: 0}]}>{item.key}</Text>
            </View>
          </TouchableOpacity>
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

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    margin: 10,
    padding: 10,
    borderColor: 'pink',
    borderBottomWidth: 2,
  },
  user: {
    fontSize: 20,
    fontStyle: 'italic',
  },
  bio: {
    fontSize: 15,
  },
});
