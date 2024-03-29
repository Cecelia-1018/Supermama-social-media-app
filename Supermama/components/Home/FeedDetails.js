import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Alert,
  Linking,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Button, TextInput, IconButton, Card, Avatar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

//check user

function FeedDetails({navigation, route}) {
  const user = firebase.auth().currentUser;
  // past value
  const {item} = route.params;
  //Comment
  const [txtComment, setTxtComment] = useState('');
  const commRef = firestore().collection('comment');
  const [CommentId, setCommentId] = useState('');
  const [commentDocId, setCommentDocId] = useState('');
  const [following, setFollowing] = useState(false);
  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [comment, setComment] = useState([]);
  const [feed, setFeed] = useState([]);
  const [postId, setPostId] = useState(item.userid);

  const [feedId, setFeedId] = useState(item.feedId);
  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setCommentId('C' + date + hours + min + sec);
    setCommentDocId('C' + date + hours + min + sec);
  }, []);

  async function addCommentCol() {
    await commRef
      .doc(commentDocId)
      .set({
        userId: user.uid,
        username: user.displayName,
        commentId: CommentId,
        comment: txtComment,
        feedId: feedId,
      })
      .then(() => {
        console.log('Comment added!');
      });
    setTxtComment('');
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')

      .onSnapshot(querySnapshot =>
        querySnapshot.forEach(
          documentSnapshot =>
            documentSnapshot.id === postId && setFollowing(true),
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
      .doc(item.userid)
      .set({
        userId: item.userid,
      });
    setFollowing(true);
  }, [setFollowing, item, user]);

  const onUnfollow = useCallback(async () => {
    await firestore()
      .collection('following')
      .doc(user.uid)
      .collection('userFollowing')
      .doc(item.userId)
      .delete();
    setFollowing(false);
  }, [setFollowing, user, item]);

  //   const CommentView = () => {
  //     setVisible(!visible);
  //   };

  const commentRender = ({item}) => {
    return (
      <SafeAreaProvider>
        <View style={styles.comment}>
          <Card>
            <Card.Content>
              <Text style={{color: 'black', fontSize: 18}}>
                {item.username}
              </Text>
              <Text style={{color: 'black', fontSize: 15}}>{item.comment}</Text>
            </Card.Content>
          </Card>
        </View>
      </SafeAreaProvider>
    );
  };
  const [replyNum, setReplyNum] = useState('');
  useEffect(() => {
    const subscriber = firestore()
      .collection('comment')
      .where('feedId', 'in', [item.feedId])
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
  }, []);

  //bookmark
  const [bookmark, setBookmark] = useState(false);
  const [bookmarkId, setbookmarkId] = useState(item.feedId);
  //reference id
  // const [entId, setentId] = useState(item.entId);
  //start at here to refer waiyi again after exam
  useEffect(() => {
    const subscriber = firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkFeed')

      .onSnapshot(querySnapshot =>
        querySnapshot.forEach(
          documentSnapshot =>
            documentSnapshot.id == feedId && setBookmark(true),
        ),
      );
    return () => subscriber();
  }, [user, setBookmark, feedId]);

  const onBookmark = useCallback(async () => {
    console.log('bookmark');
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkFeed')
      .doc(item.feedId)
      .set({
        feedId: item.feedId,
        title: item.title,
      });
    setBookmark(true);
  }, [setBookmark, user, item]);

  const onUnBookmark = useCallback(async () => {
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkFeed')
      .doc(item.feedId)
      .delete();
    setBookmark(false);
  }, [setBookmark, user, item]);

  return (
    <View style={[styles.container, styles.item]}>
      <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
          <Image source={{uri: item.image}} style={styles.image} />
        </View>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
          <Text style={[styles.title]}>{item.title}</Text>
          <Text style={[styles.description]}>{item.description}</Text>
          <LinearGradient
                  colors={['#EF629F','#EECDA3']}
                  // style={styles.box1}
                  start={{x: 0.0, y: 0.5}}
                  end={{x: 1.0, y:0.5}}
                  style={{borderRadius: 5,paddingRight: 5, paddingLeft: 2, alignSelf: 'flex-start'}}>
          <Text style={[styles.hash]}> #{item.hashtag}</Text>
          </LinearGradient>
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
      </View>
      
      
      

      <View style={[styles.follow]}>
        <Text style={[styles.user]}>{item.username}</Text>
        
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
        
      </View>
      {/* <View style={styles.commentcolumn}>
          <Text
            style={{color: 'black'}}
             onPress={() => Linking.openURL({item.hyperlink})}
          >
            {item.hyperlink}
          </Text>
        </View> */}
      <View style={[styles.content]}>
        <Text style={[styles.user]}>{item.details}</Text>
      </View>
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
            numberOfLines={4}
            color="black"
            placeholder="Your Comment"
          />
          <IconButton
            style={[styles.bookmark]}
            icon={'send'}
            color="black"
            size={25}
            onPress={() => {
              addCommentCol();
            }}
          />
        </View>
      ) : null}
      <FlatList
        ref={flatlistRef}
        data={comment}
        keyExtractor={item => item.commentId}
        renderItem={commentRender}
        initialNumToRender={comment.length}
        maxToRenderPerBatch={comment.length}
        windowSize={5}
      />
    </View>
  );
}

export default FeedDetails;

const styles = StyleSheet.create({
  container: {flex: 1},
  bookmark: {position: 'absolute', right: 2, top: 100},
  action: {
    marginTop: 10,
    color: 'pink',
  },
  commentcolumn: {
    borderColor: 'pink',
    borderBottomWidth: 2,
  },
  comment: {
    borderColor: 'black',
    borderBottomWidth: 1,
  },

  item: {
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 3,
    borderRadius: 30,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    borderBottomWidth: 1.5,
    borderColor: 'pink',
    textAlignVertical: 'top',
    fontSize: 25,
    color: 'black',
  },
  follow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  user: {textAlignVertical: 'top', fontSize: 20, color: 'black', marginTop: 10},
  description: {fontSize: 17, color: 'black'},
  hash: {textAlignVertical: 'top', fontSize: 10, color: 'black'},
  bookmark: {flexDirection: 'row',},
  question: {position: 'absolute', right: 50, top: 12},
});
