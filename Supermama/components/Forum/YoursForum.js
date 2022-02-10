import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Button, 
  Card, 
  Title, 
  Paragraph,
  IconButton,
  Colors,
  Avatar
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import firestore from '@react-native-firebase/firestore';
import EditForum from './EditForum';
import auth, {firebase} from '@react-native-firebase/auth';

function YoursForum({navigation}) {
  //add user
  const user = firebase.auth().currentUser;

  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums

  //firebase reference
  const ref = firestore().collection('forums');

  const [isVisible, setIsVisible] = useState(false);

  const renderItem = ({item}) => {
    return (
      <SafeAreaProvider>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Detail Forum', {
              //pass params here
              item: {
                title: item.title,
                description: item.description,
                forumId: item.forumId,
                username: item.username,
                photoUrl: item.photoUrl,
                date: item.date,
                time: item.time,
              },
            });
          }}>
          <View>
            <Card>
              <Card.Content>
               <View style={{ flexDirection: "row",padding:5, margin: 3 }}>
                <Avatar.Image size={40} source={{uri: item.photoUrl}} />
                <View style={{ flexDirection: "column",paddingLeft:10}}>
                <Text> {item.username} </Text>  
                <Text> Posted by {item.date}  {item.time} </Text>
                </View>
              </View>
             
              <View style={{padding:2, margin: 2}}>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
              </View>
             
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="pen"
                  color="#FE7E9C"
                  size={20}
                  onPress={() => {
                    navigation.navigate('Edit Forum', {
                      item: {
                        title: item.title,
                        description: item.description,
                        forumId: item.forumId,
                      },
                    });
                  }}/>
                <IconButton
                  color="#FE7E9C"
                  size={20}
                  icon={require('./delete-bin.png')}
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
                            .doc(item.forumId)
                            .delete()
                            .then(() => {
                              console.log('Forum deleted!');
                            }),
                      },
                    ])
                  }/>
              </Card.Actions>
            </Card>
          </View>
        </TouchableOpacity>
      </SafeAreaProvider>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
      .where('userId','in',[user.uid])
      .onSnapshot(querySnapshot => {
        const forums = [];

        querySnapshot.forEach(documentSnapshot => {
          forums.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setForums(forums);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFC0CB" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={forums}
        keyExtractor={item => item.forumId}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default YoursForum;
