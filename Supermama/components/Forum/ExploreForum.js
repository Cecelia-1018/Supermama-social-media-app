import React, { useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable
} from "react-native";
import firestore from '@react-native-firebase/firestore';

function ExploreForum(){
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
    <View style = {styles.container}>
    <FlatList
      ref={flatlistRef}
      data={forums}
      renderItem={({ item }) => (
        <View>
          <Text>Title: {item.title}</Text>
          <Text>Description: {item.description}</Text>
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


export default ExploreForum;