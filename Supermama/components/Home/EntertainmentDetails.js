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
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import EntCom from './EntCom.js';
import LinearGradient from 'react-native-linear-gradient';

function EntertainmentDetails({route}) {
  //user
  const user = firebase.auth().currentUser;
  const {item} = route.params;

  //reference entid
  const [entId, setEntId] = useState(item.entId);
  const [postId, setPostId] = useState(item.userId);

  const [avatarUrl, setAvatarUrl] = useState(undefined);
  const [following, setFollowing] = useState(false);

  const ref = firestore().collection('commentEnt');
  const [CommentId, setCommentId] = useState('');
  const [commentDocId, setCommentDocId] = useState('');
  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [txtComment, setTxtComment] = useState('');
  const [comment, setComment] = useState([]);
  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setCommentId('C' + date + hours + min + sec);
    setCommentDocId('C' + date + hours + min + sec);
  }, []);
  async function addReviewCol() {
    if (!txtComment.trim()) {
      alert('Please put a review');
    } else {
      await ref
        .doc(commentDocId)
        .set({
          userId: user.uid,
          username: user.displayName,
          reviewId: CommentId,
          review: txtComment,
          entId: entId,
        })
        .then(() => {
          console.log('Comment Added!');
        });
      setTxtComment('');
    }
  }
  const reviewRender = ({item}) => {
    return (
      <SafeAreaProvider>
        <View style={styles.comment}>
          <Card>
            <Card.Content>
              <Text style={{color: 'black', fontSize: 18}}>
                {item.username}
              </Text>
              <Text style={{color: 'black', fontSize: 15}}>{item.review}</Text>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaProvider>
    );
  };

  const [replyNum, setReplyNum] = useState('');
  useEffect(() => {
    const subscriber = firestore()
      .collection('commentEnt')
      .where('entId', 'in', [item.entId])
      .onSnapshot(querySnapshot => {
        const comment = [];

        querySnapshot.forEach(documentSnapshot => {
          comment.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setComment(comment);
        setReplyNum(querySnapshot.size);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [item.entId]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')

      .onSnapshot(querySnapshot =>
        querySnapshot.forEach(
          documentSnapshot =>
            documentSnapshot.id == postId && setFollowing(true),
        ),
      );
    return () => subscriber();
  }, [user, setFollowing, postId]);

  const onFollow = useCallback(async () => {
    console.log('follow');
    await firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')
      .doc(item.userId)
      .set({
        userId: item.userId,
      });
    setFollowing(true);
  }, [setFollowing, user, item]);

  const onUnfollow = useCallback(async () => {
    await firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')
      .doc(item.userId)
      .delete();
    setFollowing(false);
  }, [setFollowing, user, item]);

  //bookmark
  const [bookmark, setBookmark] = useState(false);
  const [bookmarkId, setbookmarkId] = useState(item.entId);
  //reference id
  // const [entId, setentId] = useState(item.entId);
  //start at here to refer waiyi again after exam
  useEffect(() => {
    const subscriber = firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkEntertainment')

      .onSnapshot(querySnapshot =>
        querySnapshot.forEach(
          documentSnapshot => documentSnapshot.id == entId && setBookmark(true),
        ),
      );
    return () => subscriber();
  }, [user, setBookmark, entId]);

  const onBookmark = useCallback(async () => {
    console.log('bookmark');
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkEntertainment')
      .doc(item.entId)
      .set({
        entId: item.entId,
        image: item.image,
      });
    setBookmark(true);
  }, [setBookmark, user, item]);

  const onUnBookmark = useCallback(async () => {
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkEntertainment')
      .doc(item.entId)
      .delete();
    setBookmark(false);
  }, [setBookmark, user, item]);

  return (
    <View style={styles.container}>
      <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
        <View
          style={[
            {
              flexGrow: 0,
              flexShrink: 1,
              flexBasis: 'auto',
              marginLeft: 10,
              marginTop: 10,
            },
          ]}>
          <Avatar.Image size={50} source={{uri: item.avatar}} />
        </View>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
          <Text style={[styles.user]}>   {item.username}</Text>
          <LinearGradient
                  colors={['#EF629F','#EECDA3']}
                  // style={styles.box1}
                  start={{x: 0.0, y: 0.5}}
                  end={{x: 1.0, y:0.5}}
                  style={{borderRadius: 5,marginLeft: 10,paddingRight: 5, paddingLeft: 2, alignSelf: 'flex-start'}}>
          <Text style={[styles.user2]}> #{item.hashtag}</Text>
          </LinearGradient>
        </View>
      </View>
      <Text style={[styles.description]}>{item.description}</Text>
      <View style={[styles.grid]}>
        <Image style={styles.image} source={{uri: item.image}} />
      </View>

      {bookmark ? (
        <IconButton
          icon="book"
          color="red"
          style={[styles.bookmark]}
          size={20}
          onPress={() => onUnBookmark()}
        />
      ) : (
        <IconButton
          icon="book"
          color="#FE7E9C"
          style={[styles.bookmark]}
          size={20}
          onPress={() => onBookmark()}
        />
      )}

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

      <View style={[styles.commentcolumn]}>
        <Text style={[styles.description]}>Comment {replyNum}</Text>
      </View>
      {user ? (
        <View style={styles.action}>
          <TextInput
            label="Comment"
            value={txtComment}
            onChangeText={setTxtComment}
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
            multiline={true}
            numberOfLines={2}
            color="black"
            placeholder="Your Review"
          />
          <IconButton
            style={[styles.send]}
            icon={'send'}
            color="black"
            size={25}
            onPress={() => {
              addReviewCol();
            }}
          />
        </View>
      ) : null}
      <FlatList
        ref={flatlistRef}
        data={comment}
        keyExtractor={item => item.entId}
        renderItem={reviewRender}
        initialNumToRender={comment.length}
        maxToRenderPerBatch={comment.length}
        windowSize={5}
      />
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
  user: {textAlignVertical: 'top', fontSize: 15, color: 'black',fontWeight: 'bold'},
  user2: {textAlignVertical: 'top', fontSize: 15, color: 'black'},
  description: {fontSize: 17, color: 'black', marginLeft: 25},
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    margin: 5,
    borderRadius: 10,
  },

  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},
  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
  bookmark: {position: 'absolute', right: 120, top: 20},
  send: {position: 'absolute', right: 10, top: 10},
  commentcolumn: {
    borderColor: 'pink',
    borderBottomWidth: 2,
    margin: 10,
  },
  comment: {
    borderColor: 'black',
    borderBottomWidth: 1,
  },
});
