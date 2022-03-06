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

const EntertainmentHome = ({navigation}) => {
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
    const subscriber = firestore()
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

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [user.uid]);

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
      <View style={styles.item}>
        {/* {!user || item.userId !== user.uid ? ( */}
        <>
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
                <Text style={[styles.user]}> {item.username}</Text>
                <Text style={[styles.user]}> #{item.hashtag}</Text>
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
            <View style={[{flexDirection: 'row'}]}>
              {item.like ? (
                <IconButton
                  icon={'heart'}
                  color="black"
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
            <View style={[{flexDirection: 'row'}]}>
              <Icon
                type="ionicon"
                name={
                  Platform.OS === 'ios'
                    ? 'ios-chatbubbles-outline'
                    : 'md-chatbubbles-outline'
                }
              />
            </View>
            <Icon
              type="ionicon"
              name={
                Platform.OS === 'ios'
                  ? 'ios-paper-plane-outline'
                  : 'md-paper-plane-outline'
              }
              style={{transform: [{rotate: '40deg'}]}}
            />
          </View>
        </>
        {/* ) : null} */}
      </View>
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
  like: {textAlignVertical: 'center', color: 'black'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},

  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
});
