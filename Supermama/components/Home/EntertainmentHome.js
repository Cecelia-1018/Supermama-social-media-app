import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, IconButton, Avatar} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const EntertainmentHome = ({navigation, item}) => {
  const user = firebase.auth().currentUser;
  const postRef = useRef();
  const [entertainment, setEntertainment] = useState([]);
  const [entId, setEntId] = useState([]);
  const [imageUrl, setImageUrl] = useState(undefined);

  // * step 3a call image from storage (rmb import useEffect at top)

  const renderPostItem = ({item}) => {
    return (
      <View style={styles.item}>
        {!user || item.userId !== user.uid ? (
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
                <IconButton
                  icon={'heart-outline'}
                  color="black"
                  size={25}
                  // onPress={() => navigation.navigate('Bookmark')}
                />

                <Text style={[styles.like]}>10</Text>
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
                <Text style={[styles.like]}>111</Text>
              </View>
              <Icon
                type="ionicon"
                name={
                  Platform.OS === 'ios' ? 'ios-send-outline' : 'md-send-outline'
                }
              />
            </View>

            <IconButton
              style={[styles.bookmark]}
              icon={'book'}
              color="black"
              size={25}
              // onPress={() => navigation.navigate('Bookmark')}
            />

            <Button
              style={[styles.follow]}
              color="black"
              mode="outlined"
              onPress={() => console.log('Follow')}>
              Follow
            </Button>
          </>
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('entertainment')
      .onSnapshot(querySnapshot => {
        const entertainment = [];
        // const varName = [];

        querySnapshot.forEach(documentSnapshot => {
          // varName.push(documentSnapshot.data().entertainmentId);
          entertainment.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        // querySnapshot.forEach(documentSnapshot => {
        //   entertainment.push({
        //     ...documentSnapshot.data(),
        //     key: documentSnapshot.id,
        //   });
        // });

        setEntertainment(entertainment);

        console.log(entertainment);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('entertainment')
  //     .onSnapshot(querySnapshot => {
  //       const varName = [];

  //       querySnapshot.forEach(documentSnapshot => {
  //         varName.push(documentSnapshot.data().entertainmentId);
  //       });
  //       setEntId(varName);
  //     });
  //   console.log(entId);
  //   storage()
  //     .ref(
  //       'gs://supermama-6aa87.appspot.com/Entertainment/' +
  //         'E1644497239624204719',
  //     ) //name in storage in firebase console
  //     .getDownloadURL()
  //     .then(url => {
  //       setImageUrl(url);
  //     })
  //     .catch(e => console.log('Errors while downloading => ', e));
  // }, []);
  return (
    <View style={styles.container}>
      <FlatList
        ref={postRef}
        data={entertainment}
        keyExtractor={item => item.entertainmentId}
        renderItem={renderPostItem}
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
  bookmark: {position: 'absolute', right: 90, top: 12},
  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
});
