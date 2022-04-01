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
import {Button, IconButton} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

const UserFeed = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const feedRef = useRef();
  const [feed, setFeed] = useState([]);
  const ref = firestore().collection('feed');

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
                image: item.image,
              },
            });
          }}>
          <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
            <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
              <Image style={styles.image} source={{uri: item.image}} />
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
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              },
            ]}>
            <IconButton
              icon="pen"
              color="#FE7E9C"
              size={20}
              onPress={() => {
                navigation.navigate('Edit Feed', {
                  item: {
                    title: item.title,
                    description: item.description,
                    details: item.details,
                    hashtag: item.hashtag,
                    feedId: item.feedId,
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
                        .doc(item.feedId)
                        .delete()
                        .then(() => {
                          console.log('Feed deleted!');
                        }),
                  },
                ])
              }
            />
          </View>
          <Text style={[{fontSize: 0}]}> {item.details}</Text>
          <Text style={[{fontSize: 0}]}> {item.hyperlink}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('feed')
      .where('userId', '==', user.uid)
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

export default UserFeed;

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
