import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {
  Button,
  Card,
  IconButton,
  Title,
  Colors,
  Avatar,
} from 'react-native-paper';

function ProfileView({navigation, route}) {
  const user = firebase.auth().currentUser;
  //navigation
  const {item} = route.params;

  //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState(undefined);

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + item.userId) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);
  const onFollow = useCallback(
    async follow => {
      console.log('follow');
      await firestore()
        .collection('following')
        .doc(user.uid)
        .collection('userFollowing')
        .doc(item.userId)
        .set({});
      follow(true);
    },
    [item.userId, user.uid],
  );

  const onUnfollow = useCallback(
    async follow => {
      await firestore()
        .collection('following')
        .doc(user.uid)
        .collection('userFollowing')
        .doc(item.userId)
        .delete();
      follow(false);
    },
    [user, item],
  );

  return (
    <ScrollView>
      <View style={styles.scroll}>
        <View style={styles.userRow}>
          <Avatar.Image size={90} source={{uri: imageUrl}} />
          <Text>{item.username}</Text>
          <Text>{item.bio}</Text>
          {item.following ? (
            <Button
              style={[styles.follow]}
              color="black"
              mode="outlined"
              onPress={() => onUnfollow(item.following)}>
              Following
            </Button>
          ) : (
            <Button
              style={[styles.follow]}
              color="black"
              mode="outlined"
              onPress={() => onFollow(item.following)}>
              Follow
            </Button>
          )}
        </View>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Cover
              source={{
                uri: 'https://img.freepik.com/free-vector/group-people-illustration-set_52683-33806.jpg?size=626&ext=jpg&ga=GA1.2.253552068.1642731557',
              }}
            />
            <Card.Actions>
              <Button
                mode="default"
                onPress={() => {
                  navigation.navigate('View Entertainment Posts', {
                    item: {
                      userId: item.userId,
                    },
                  });
                }}>
                Entertainment Posts
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Cover
              source={{
                uri: 'https://img.freepik.com/free-vector/blogging-illustration-concept_114360-788.jpg?w=900',
              }}
            />
            <Card.Actions>
              <Button
                mode="default"
                onPress={() => {
                  navigation.navigate('View Feed Posts', {
                    item: {
                      userId: item.userId,
                    },
                  });
                }}>
                Feed Posts
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Cover
              source={{
                uri: 'https://img.freepik.com/free-vector/ecommerce-campaign-concept-illustration_114360-8202.jpg?w=996',
              }}
            />
            <Card.Actions>
              <Button
                mode="default"
                onPress={() => {
                  navigation.navigate('View Product Posts', {
                    item: {
                      userId: item.userId,
                    },
                  });
                }}>
                Products
              </Button>
            </Card.Actions>
          </Card>

          <Card style={styles.card}>
            <Card.Cover
              source={{
                uri: 'https://img.freepik.com/free-vector/self-care-illustration-concept_23-2148526939.jpg?w=740',
              }}
            />
            <Card.Actions>
              <Button
                mode="default"
                onPress={() => {
                  navigation.navigate('View Collection Posts');
                }}>
                Collections
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

export default ProfileView;

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
    flex: 1,
  },
  userRow: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  content: {
    flex: 3,
    backgroundColor: '#d8d8db',
  },
  followButton: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
});
