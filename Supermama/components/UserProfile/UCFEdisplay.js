import React, { useState, useEffect, useRef} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Pressable,
    TouchableOpacity,
    Image,
    Alert
  } from "react-native";
import {  
    Card, 
    Title, 
    Paragraph,
    IconButton
  } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';

function UCFEdisplay({navigation}){
   //check user
   const user = firebase.auth().currentUser;
   const flatlistRef = useRef();
 
   const onPressFunction = () => {
     flatlistRef.current.scrollToEnd({animating: true});
   };
 
   const [loading, setLoading] = useState(true); // Set loading to true on component mount
   const [bookmark, setBookmark] = useState([]); // Initial empty array of forums
   const [size, setSize] = useState('');
 
   const renderItem2 = ({item}) => {
     // //firebase reference
   const ref = firestore()
   .collection('bookmark')
   .doc(user.uid)
   .collection('userMarkFeed');
 
     async function deleteBook() {
       ref
         .doc(item.feedId)
         .delete()
         .then(() => {
           console.log('Feed bookmark deleted!');
         });
     }
     return(
      <SafeAreaProvider>
      <TouchableOpacity
         onPress={() => {
           navigation.navigate('Your Collect Feeds', {
             //pass params here
             item: {
               feedId: item.feedId,
             },
           });
         }}>
         <View>
        
           <Card>
             <Card.Content>
                <Paragraph>Saved - {item.title} </Paragraph>
                <View style={styles.delete}>
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
                 onPress: () => {
                   deleteBook()
                 },
               },
             ])
           }
         />
       </View>
             </Card.Content>
           </Card>
           </View>
             </TouchableOpacity>
         </SafeAreaProvider>
   );
 };



 useEffect(() => {
   const subscriber = firestore()
     .collection('bookmark')
     .doc(user.uid)
     .collection('userMarkFeed')
     .onSnapshot(
       querySnapshot => {
         const bookmark = [];
        

         querySnapshot.forEach(documentSnapshot => {
         
           bookmark.push({
             ...documentSnapshot.data(),
             key:documentSnapshot.id
           });

          
           //start at here 
           console.log('ID: ', documentSnapshot.id);
          
           
         });
   
         
         setBookmark(bookmark);
         setLoading(false);
         setSize(querySnapshot.size);
         
         
       });
   

   // Unsubscribe from events when no longer in use
   return () => subscriber();
 }, []);


 if (loading) {
   return <ActivityIndicator size="large" color="#FFC0CB" />;
 }



    return (
      <View style={styles.container}>
        <Title style={styles.word}>Total Bookmarks : {size}</Title>
        <FlatList
          ref={flatlistRef}
          data={bookmark}
          keyExtractor={item => item.feedId}
          renderItem={renderItem2}
        />
      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  word:{
    margin: 10,
    padding: 5,
  },
  delete: {
    marginLeft: -10,
  },
 
});


export default UCFEdisplay;