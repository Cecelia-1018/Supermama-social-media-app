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

function EntertainmentDetails({route}) {
  //user
  const user = firebase.auth().currentUser;
  const {item} = route.params;

  //comment
  const [txtComment, setTxtComment] = useState('');
  const ref = firestore().collection('commEnt');

  const [ComDocId, setComDocId] = useState('');
  const [txtcomId, setComId] = useState('');
  const [comDate, setComDate] = useState('');
  const [comTime, setComTime] = useState('');
  //reference entid
  const [entId, setEntId] = useState(item.entId);

  useEffect(() => {
    var head = Date.now().toString();
    var tail = Math.random().toString().substr(2);

    const d = new Date();
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();

    setComDocId('FA' + head + tail);
    setComId('FA' + head + tail);
    setComDate(date);
    setComTime(time);
  }, []);
  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setAvatarUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  const [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/Entertainment/' + entId) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  async function addCommentCol() {
    if (!txtComment.trim()) {
      alert('Comment some content.');
    } else {
      await ref
        .doc(ComDocId)
        .set({
          //add id here
          commentId: txtcomId,
          comment: txtComment,
          date: comDate,
          time: comTime,
          entId: entId,
          userId: user.uid,
          username: user.displayName,
          avatarUrl: avatar,
        })
        .then(() => {
          console.log('Commented!');
        });
      setTxtComment('');
    }
  }

  //display part
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [comm, setComm] = useState([]);

  const renderCom = ({item}) => {
    return (
      <SafeAreaProvider>
        <View>
          <View style={styles.top}>
            <Avatar.Image size={30} source={{uri: item.avatar}} />
            <View
              style={{flexDirection: 'column', paddingLeft: 10, fontSize: 12}}>
              <Text style={styles.text}> {item.username} </Text>
              <Text style={styles.text}>
                {' '}
                {item.date} {item.time}{' '}
              </Text>
            </View>
          </View>
          <Text style={styles.comment}>{item.comment}</Text>
        </View>
      </SafeAreaProvider>
    );
  };

  const [replyNum, setReplyNum] = useState('');

  useEffect(() => {
    const subscriber = firestore()
      .collection('commEnt')
      .where('entId', 'in', [item.entId])
      .onSnapshot(querySnapshot => {
        const comment = [];

        querySnapshot.forEach(documentSnapshot => {
          comment.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setComm(comment);
        setReplyNum(querySnapshot.size);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFC0CB" />;
  }

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

      <Button title="Click Here" onPress={() => alert('Button clicked')} />
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
