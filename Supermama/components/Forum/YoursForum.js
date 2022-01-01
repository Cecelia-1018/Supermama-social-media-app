import React, { useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
  TouchableOpacity
} from "react-native";
import {  
  Button,
  Card, 
  Title, 
  Paragraph 
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import EditForum from './EditForum';


function YoursForum({navigation}){

  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums
  
  const renderItem = ({item}) => {
   return(
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Detail Forum', {
            //pass params here
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
                onPress={() => {
                  navigation.navigate('Edit Forum', {
                    item: {
                      title: item.title,
                      description: item.description,
                      forumId: item.forumId,
                    },
                  });
                }}
              > Edit </Button>

              <Button onPress={() => {
                  navigation.navigate('Delete Forum', {
                    item: {
                      forumId: item.forumId,
                    },
                  });
                }}
              >Delete</Button>

            </Card.Actions>
          </Card>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
      .onSnapshot(
        querySnapshot => {
          const forums = [];

          querySnapshot.forEach(documentSnapshot => {
            forums.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
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

  const createTwoButtonAlert = () =>{
    Alert.alert('Confirmation', 'Confirm to delete?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Confirm', onPress: () => console.log('Confirm Pressed') },
    ]);
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