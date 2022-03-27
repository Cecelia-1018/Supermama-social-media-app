import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Alert,
} from 'react-native';
import {
  Button,
  TextInput,
  IconButton,
  Card,
  Avatar,
  Colors,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {ScrollView} from 'react-native-gesture-handler';

const user = firebase.auth().currentUser;
const StoreDetails = ({route, navigation}) => {
  const {item} = route.params;
  const [txtComment, setTxtComment] = useState('');
  const reRef = firestore().collection('review');
  const cartRef = firestore().collection('cart');
  const [CommentId, setCommentId] = useState('');
  const [commentDocId, setCommentDocId] = useState('');
  const [cartId, setCartId] = useState('');
  const [cartDocId, setCartDocId] = useState('');

  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [comment, setComment] = useState([]);
  const [product, setProduct] = useState([]);

  const [productId, setProductId] = useState(item.productId);
  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setCommentId('C' + date + hours + min + sec);
    setCommentDocId('C' + date + hours + min + sec);
  }, []);
  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setCartId('C' + date + hours + min + sec);
    setCartDocId('C' + date + hours + min + sec);
  }, []);
  async function addReviewCol() {
    if (!txtComment.trim()) {
      alert('Please put a review');
    } else {
      await reRef
        .doc(commentDocId)
        .set({
          userId: user.uid,
          username: user.displayName,
          reviewId: CommentId,
          review: txtComment,
          productId: productId,
        })
        .then(() => {
          console.log('Review Added!');
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
      .collection('review')
      .where('productId', 'in', [item.productId])
      .onSnapshot(querySnapshot => {
        const review = [];

        querySnapshot.forEach(documentSnapshot => {
          review.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setComment(review);
        setReplyNum(querySnapshot.size);
      });
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  async function addToCart() {
    await cartRef
      .doc(cartDocId)
      .set({
        usesrId: user.uid,
        username: user.displayName,
        cartId: cartId,
        productId: item.productId,
        productName: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: Number(1),
        payment: Boolean(false),
      })
      .then(() => {
        console.log('Add Cart');
      });
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground style={styles.image} source={{uri: item.imageUrl}} />
        <View style={styles.button}>
          <IconButton
            icon="cart"
            color={Colors.black}
            size={25}
            onPress={() => {
              addToCart();
            }}
          />
        </View>

        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 300}]}>
            <Text style={[styles.title]}> {item.name}</Text>
          </View>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 100}]}>
            <Text style={[styles.title]}> RM {item.price}</Text>
          </View>
        </View>
        <Text style={[styles.detail]}>Details: </Text>
        <Text style={[styles.det]}>{item.description}</Text>
      </ScrollView>
      <View style={[styles.commentcolumn]}>
        <Text style={[styles.description]}>Question {replyNum}</Text>
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
            style={[styles.bookmark]}
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
        keyExtractor={item => item.reviewId}
        renderItem={reviewRender}
        initialNumToRender={comment.length}
        maxToRenderPerBatch={comment.length}
        windowSize={5}
      />
    </View>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 51 / 2,
    width: 50,
    height: 50,
    position: 'absolute',
    right: 20,
    top: 20,
  },
  comment: {
    borderColor: 'black',
    borderBottomWidth: 1,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 380,
    height: 430,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    borderWidth: 2,
    borderColor: 'grey',
    height: 50,
    fontSize: 20,
    color: 'black',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  detail: {
    fontSize: 25,
    color: 'black',
    marginLeft: 10,
  },
  det: {
    fontSize: 20,
    color: 'grey',
    marginLeft: 10,
    marginTop: 10,
  },
  commentcolumn: {
    borderColor: 'pink',
    borderBottomWidth: 2,
  },
  description: {fontSize: 17, color: 'black'},
});
