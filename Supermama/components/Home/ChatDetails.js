import React, {useCallback, useLayoutEffect, useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {View, Text, Button, StyleSheet} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({route}) => {
  const [messages, setMessages] = useState([]);
  const user = firebase.auth().currentUser;
  const {item} = route.params;

  const [imageUrl, setImageUrl] = useState('null');

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + item.userId) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: {uri: imageUrl},
        },
      },
    ]);
  }, []);

  //   useEffect(() => {
  //     const subscriber = firestore()
  //       .collection('chat')
  //       .doc(user.uid)
  //       .collection('userChatting')
  //       .where('userId', 'in', [item.userId])
  //       .onSnapshot(querySnapshot => {
  //         const answers = [];

  //         querySnapshot.forEach(documentSnapshot => {
  //           answers.push({
  //             ...documentSnapshot.data(),
  //             key: documentSnapshot.id,
  //           });
  //         });

  //         setAnswer(answers);
  //         setReplyNum(querySnapshot.size);
  //         setLoading(false);
  //       });

  //     // Unsubscribe from events when no longer in use
  //     return () => subscriber();
  //   }, []);

  //   if (loading) {
  //     return <ActivityIndicator size="large" color="#FFC0CB" />;
  //   }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
