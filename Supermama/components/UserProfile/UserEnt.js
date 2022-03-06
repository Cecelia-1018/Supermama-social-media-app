import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button, IconButton, Avatar} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const EntertainmentHome = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const postRef = useRef();
  const onPressFunction = () => {
    postRef.current.scrollToEnd({animating: true});
  };
  const [entertainment, setEntertainment] = useState([]);
  const [entId, setEntId] = useState([]);

  const ref = firestore().collection('entertainment');

  // * step 3a call image from storage (rmb import useEffect at top)

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
            <View style={[{flexDirection: 'row', alignItems: 'center'}]}></View>
            <View style={[styles.grid]}>
              <View style={[{flexDirection: 'column', alignItems: 'center'}]}>
                <Image style={styles.image} source={{uri: item.image}} />
                <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                  <IconButton
                    icon="pen"
                    color="#FE7E9C"
                    size={20}
                    onPress={() => {
                      navigation.navigate('Edit Entertainment', {
                        item: {
                          hashtag: item.hashtag,
                          description: item.description,
                          entId: item.entertainmentId,
                        },
                      });
                    }}
                  />

                  <IconButton
                    color="#FE7E9C"
                    size={20}
                    icon={require('../Forum/delete-bin.png')}
                    onPress={() =>
                      Alert.alert('Confirmation', 'Confirm to delete?', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Confirm',
                          onPress: () =>
                            ref
                              .doc(item.entertainmentId)
                              .delete()
                              .then(() => {
                                console.log('Entertainment deleted!');
                              }),
                        },
                      ])
                    }
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </>
        {/* ) : null} */}
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('entertainment')
      .where('userId', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const entertainment = [];
        const varName = [];

        querySnapshot.forEach(documentSnapshot => {
          varName.push(documentSnapshot.data().userId);
          entertainment.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setEntertainment(entertainment);
        setEntId(varName);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        ref={postRef}
        data={entertainment}
        keyExtractor={item => item.entertainmentId}
        renderItem={renderPostItem}
        initialNumToRender={entertainment.length}
        maxToRenderPerBatch={entertainment.length}
        windowSize={5}
        horizontal={false}
        numColumns={2}
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
    padding: 5,
    marginVertical: 4,
    marginHorizontal: 3,
    borderRadius: 10,
  },
  user: {textAlignVertical: 'top', fontSize: 15, color: 'black'},
  description: {fontSize: 17, color: 'black'},
  image: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: 170,
    height: 170,
    margin: 5,
    borderRadius: 10,
  },
  like: {textAlignVertical: 'center', color: 'black'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},

  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
});
