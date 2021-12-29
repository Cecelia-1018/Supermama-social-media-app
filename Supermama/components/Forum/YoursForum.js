import React, { useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
  
} from "react-native";
import {  
  Button,
  Card, 
  Title, 
  Paragraph 
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import EditForum from './EditForum';

//alert confimation for delete
const createTwoButtonAlert = () =>
  Alert.alert('Confirmation', 'Confirm to delete?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Confirm', onPress: () => console.log('Confirm Pressed') },
]);

function YoursForum({navigation}){
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums
  

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

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={forums}
        renderItem={({item}) => (
          <View>
            <Card>
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
              <Card.Actions>
              <Button onPress={() => navigation.navigate("Edit Forum")}>Edit</Button>
              <Button onPress={() => createTwoButtonAlert()}>Delete</Button>
            </Card.Actions>
            </Card>
            
          </View>
        )}
      />
      {/* <Pressable android_ripple style={styles.button} onPress={onPressFunction}>
        <Text style={styles.arrow}>v</Text>
    </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
});


export default YoursForum;