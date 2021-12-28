import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from "react-native";
import firestore from '@react-native-firebase/firestore';

function ExploreForum(){
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
              key:documentSnapshot.id,
            });
          });
          
          setForums(forums);
          setLoading(false);

        });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={forums}
      renderItem={({ item }) => (
        <View style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>ID: {item.id}</Text>
          <Text>Title: {item.title}</Text>
          <Text>Description: {item.description}</Text>
        </View>
      )}
    />
  );

}

export default ExploreForum;