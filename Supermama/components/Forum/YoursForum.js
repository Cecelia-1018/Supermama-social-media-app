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
import {Button, Card, Title, Paragraph} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import firestore from '@react-native-firebase/firestore';
import EditForum from './EditForum';

function YoursForum({navigation}) {
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
              },
            });
          }}>
          <View>
            <Card>
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button
                  color="#FE7E9C"
                  onPress={() => {
                    navigation.navigate('Edit Forum', {
                      item: {
                        title: item.title,
                        description: item.description,
                        forumId: item.forumId,
                      },
                    });
                  }}>
                  {' '}
                  Edit{' '}
                </Button>
                <Button
                  color="#FE7E9C"
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
                  }>
                  Delete
                </Button>
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
