/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {IconButton, Avatar} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const EntertainmentHome = ({navigation}) => {
  // console.disableYellowBox = true;
  const user = firebase.auth().currentUser;
  const postRef = useRef();
  const onPressFunction = () => {
    postRef.current.scrollToEnd({animating: true});
  };
  const [entertainments, setEntertainments] = useState([]);

  // const [imageUrl, setImageUrl] = useState(undefined);
  // * step 3a call image from storage (rmb import useEffect at top)

  // fetch entertainments
  useEffect(() => {
    const subscriber = navigation.addListener('focus', () => {
      setEntertainments([]);
      firestore()
        .collection('entertainment')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(async documentSnapshot => {
            const like = await firestore()
              .collection('likeEnt')
              .doc(user.uid)
              .collection('userLike')
              .doc(documentSnapshot.data().entertainmentId)
              .get();

            setEntertainments(value => [
              ...value,
              {
                ...documentSnapshot.data(),
                like: like.exists,
                key: documentSnapshot.id,
              },
            ]);
          });
        });
    });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [user.uid, navigation]);

  const setLikeById = useCallback(
    (id, like) =>
      setEntertainments(
        entertainments.map(e => (e.entertainmentId === id ? {...e, like} : e)),
      ),
    [entertainments],
  );

  const onLike = useCallback(
    async id => {
      await firestore()
        .collection('likeEnt')
        .doc(user.uid)
        .collection('userLike')
        .doc(id)
        .set({});
      setLikeById(id, true);
    },
    [setLikeById, user.uid],
  );

  const onUnlike = useCallback(
    async id => {
      await firestore()
        .collection('likeEnt')
        .doc(user.uid)
        .collection('userLike')
        .doc(id)
        .delete();
      setLikeById(id, false);
    },
    [setLikeById, user.uid],
  );

  const renderPostItem = ({item}) => {
    return (
      <>
        {item.post ? (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Entertainment Details', {
                  item: {
                    username: item.username,
                    hashtag: item.hashtag,
                    description: item.description,
                    entId: item.entertainmentId,
                    avatar: item.avatar,
                    image: item.image,
                    userId: item.userId,
                  },
                });
              }}>
              <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
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
                  <Text style={[styles.user2]}>#{item.hashtag}</Text>
                  </LinearGradient>
                  
                </View>
                <View style={[{flexDirection: 'row',marginLeft: 50}]}>
                {item.like ? (
                  <IconButton
                    icon={'heart'}
                    color="red"
                    size={25}
                    onPress={() => onUnlike(item.entertainmentId)}
                  />
                ) : (
                  <IconButton
                    icon={'heart-outline'}
                    color="black"
                    size={25}
                    onPress={() => onLike(item.entertainmentId)}
                  />
                )}
              </View>
               
              </View>
              <Text style={[styles.description]}>{item.description}</Text>
              <View style={[styles.grid]}>
                <Image style={styles.image} source={{uri: item.image}} />
              </View>
            </TouchableOpacity>

            <View
              style={[
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                },
              ]}>
              
              {/* <View style={[{flexDirection: 'row'}]}>
                <Icon
                  type="ionicon"
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-chatbubbles-outline'
                      : 'md-chatbubbles-outline'
                  }
                />
              </View> */}
              {/* <Icon
                type="ionicon"
                name={
                  Platform.OS === 'ios'
                    ? 'ios-paper-plane-outline'
                    : 'md-paper-plane-outline'
                }
                style={{transform: [{rotate: '40deg'}]}}
              /> */}
            </View>
          </View>
        ) : null}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={postRef}
        data={entertainments}
        keyExtractor={item => item.entertainmentId}
        renderItem={renderPostItem}
        initialNumToRender={entertainments.length}
        maxToRenderPerBatch={entertainments.length}
        windowSize={5}
      />
    </View>
  );
};

export default EntertainmentHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 4,
    marginHorizontal: 3,
    borderRadius: 10,
  },
  user: {textAlignVertical: 'top', fontSize: 15, color: 'black',fontWeight: 'bold'},
  user2: {textAlignVertical: 'top', fontSize: 15, color: 'black'},
  description: {fontSize: 17, color: 'black'},
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 360,
    height: 360,
    margin: 5,
    borderRadius: 10,
  },
  like: {textAlignVertical: 'center', color: 'black'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},

  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
});
