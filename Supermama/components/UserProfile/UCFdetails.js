import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import {  
  Card, 
  Title, 
  Paragraph,
  Avatar,
  IconButton,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function UCFdetails({navigation, route}) {
  //navigation
  const {item} = route.params;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums
  
  const flatlistRef = useRef();

  // //firebase reference
  // const ref = firestore().collection('forums');

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

   const renderItem = ({item}) => {
    return(
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
              <View style={{backgroundColor: "#fddde6",borderRadius: 5,padding:5, margin: 5}}>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
              </View>
   
              </Card.Content>
             
             
            </Card>
            </View>
          </TouchableOpacity>
          <View style={styles.delete}>
               <IconButton
                  
                  color="#FE7E9C"
                  size={20}
                  icon={require('../Forum/delete-bin.png')}
                  // onPress={() =>
                  //   Alert.alert('Confirmation', 'Confirm to delete?', [
                  //     {
                  //       text: 'Cancel',
                  //       onPress: () => console.log('Cancel Pressed'),
                  //       style: 'cancel',
                  //     },
                  //     {
                  //       text: 'Confirm',
                  //       onPress: () =>
                  //         ref
                  //           .doc(item.forumId)
                  //           .delete()
                  //           .then(() => {
                  //             console.log('Forum deleted!');
                  //           }),
                  //     },
                  //   ])
                  // }
                  />
                   </View>
          </SafeAreaProvider>
    );
  };

  

  useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
      .where('forumId','in',[item.forumId])
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
};

export default UCFdetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  delete:{
   margin: 10,
  },
});
