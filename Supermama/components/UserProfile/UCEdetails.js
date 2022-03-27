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

function UCEdetails({route}){
   //user
   const user = firebase.auth().currentUser;
   const {item} = route.params;
   const [entertainment, setEntertainment] = useState([]);

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

   useEffect(() => {
    const subscriber = firestore()
      .collection('entertainment')
      .where('entertainmentId', 'in', [item.entId])
      .onSnapshot(querySnapshot => {
        const entertainment = [];

        querySnapshot.forEach(documentSnapshot => {
          entertainment.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setEntertainment(entertainment);
        
       
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

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
      .set({});
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

  

  const renderItem = ({item}) => {
    return(
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
    )
  }

 
    return  (
      <View style={styles.container}>
       <FlatList
        // ref={flatlistRef}
        data={entertainment}
        keyExtractor={item => item.entId}
        renderItem={renderItem}
        windowSize={5}
      />

</View>
     
  

    );
}

export default UCEdetails;

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
  description: {fontSize: 17, color: 'black', marginLeft: 25},
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 190,
    height: 210,
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
