import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Alert,
  Linking,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import {Button, TextInput, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

function FeedDetails({navigation, route}) {
  // past value
  const {item} = route.params;
  //Comment
  const [txtComment, setTxtComment] = useState('');
  const commRef = firestore().collection('comment');
  const [CommentId, setCommentId] = useState('');
  const [commentDocId, setCommentDocId] = useState('');
  //   // text Comment
  //   const [visible, setVisible] = useState(false);

  const commentRef = useRef();
  const [comment, setComment] = useState([]);
  const [feed, setFeed] = useState([]);
  const [reply, setReply] = useState(0);

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
        userId: item.userid,
        commentId: CommentId,
        comment: txtComment,
        feedId: feedId,
      })
      .then(() => {
        console.log('Comment added!');
      });
    setTxtComment('');
  }

  //   const CommentView = () => {
  //     setVisible(!visible);
  //   };

  const commentRender = ({item}) => {
    return (
      <View style={styles.comment}>
        <Text style={{color: 'black', fontSize: 18}}>Name</Text>
        <Text style={{color: 'black', fontSize: 15}}>{item.comment}</Text>
      </View>
    );
  };

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
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  return (
    <View style={styles.item}>
      <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
          {/* <Avatar.Image size={50} source={item.avatar_url} /> */}
          <Image source={require('./AddPost_img.jpg')} style={styles.image} />
        </View>
        <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
          <Text style={[styles.title]}> {item.title}</Text>
          <Text style={[styles.description]}> {item.description}</Text>
          <Text style={[styles.hash]}> #{item.hashtag}</Text>
        </View>
      </View>
      <IconButton
        style={[styles.question]}
        icon={'question'}
        color="black"
        size={25}
        // onPress={() => navigation.navigate('Bookmark')}
      />
      <IconButton
        style={[styles.bookmark]}
        icon={'book'}
        color="black"
        size={25}
        // onPress={() => navigation.navigate('Bookmark')}
      />
      <View style={[styles.follow]}>
        <Text style={[styles.user]}>Name</Text>
        <Button
          color="black"
          mode="outlined"
          onPress={() => console.log('Follow')}>
          Follow
        </Button>
      </View>
      <View style={[styles.content]}>
        <Text style={[styles.user]}>{item.details}</Text>
      </View>
      <View style={[styles.commentcolumn]}>
        <Text style={[styles.description]}>Comment {reply}</Text>
      </View>

      <View>
        <FlatList
          ref={commentRef}
          data={comment}
          keyExtractor={item => item.commentId}
          renderItem={commentRender}
        />
      </View>
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
    </View>
  );
}

export default FeedDetails;

const styles = StyleSheet.create({
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
  hash: {textAlignVertical: 'top', fontSize: 10, color: 'grey'},
  bookmark: {position: 'absolute', right: 15, top: 12},
  question: {position: 'absolute', right: 50, top: 12},
});
