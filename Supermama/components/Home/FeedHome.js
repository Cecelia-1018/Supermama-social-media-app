import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

const FeedHome = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const feedRef = useRef();
  const [feed, setFeed] = useState([]);

  const renderFeedItem = ({item}) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Feed Detail', {
              item: {
                title: item.title,
                description: item.description,
                feedId: item.feedId,
                details: item.details,
                hashtag: item.hashtag,
                userid: item.userId,
                username: item.username,
              },
            });
          }}>
          <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
            <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
              {/* <Avatar.Image size={50} source={item.avatar_url} /> */}
              <Image
                source={require('./AddPost_img.jpg')}
                style={styles.image}
              />
            </View>
            <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
              <Text style={[styles.user]}> {item.title}</Text>
              <Text style={[styles.description]}> {item.description}</Text>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text style={[styles.hash]}> #{item.hashtag}</Text>
                <Text style={[styles.user]}> {item.username}</Text>
              </View>
            </View>
          </View>
          <IconButton
            style={[styles.bookmark]}
            icon={'book'}
            color="black"
            size={25}
            // onPress={() => navigation.navigate('Bookmark')}
          />
          <Text style={[{fontSize: 0}]}> {item.details}</Text>
          <Text style={[{fontSize: 0}]}> {item.hyperlink}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('feed')
      .onSnapshot(querySnapshot => {
        const feed = [];

        querySnapshot.forEach(documentSnapshot => {
          feed.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setFeed(feed);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={feedRef}
        data={feed}
        keyExtractor={item => item.feedId}
        renderItem={renderFeedItem}
      />
    </View>
  );
};

export default FeedHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 3,
    borderRadius: 30,
    borderBottomWidth: 1,
    borderColor: 'pink',
    backgroundColor: 'white',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  user: {textAlignVertical: 'top', fontSize: 15, color: 'black'},
  description: {fontSize: 17, color: 'black'},
  hash: {textAlignVertical: 'top', fontSize: 10, color: 'grey'},
  bookmark: {position: 'absolute', right: 5, top: 12},
});
