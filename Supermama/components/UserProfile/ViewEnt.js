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

const ViewEnt = ({navigation, route}) => {
   //navigation
  const {item} = route.params;
    
  const user = firebase.auth().currentUser;
  const postRef = useRef();
  const onPressFunction = () => {
    postRef.current.scrollToEnd({animating: true});
  };
  const [entertainment, setEntertainment] = useState([]);
  const [entId, setEntId] = useState([]);

  const [imageUrl, setImageUrl] = useState(undefined);

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
      .where('userId', '==', item.userId)  
      .where('post','==',true) 
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
      />
    </View>
  );
};

export default ViewEnt;

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
    width: 250,
    height: 250,
    margin: 5,
    borderRadius: 10,
  },
  like: {textAlignVertical: 'center', color: 'black'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'},

  follow: {position: 'absolute', right: 5, top: 18, color: 'black'},
});
