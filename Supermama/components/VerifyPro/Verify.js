import React,{useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Image,FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';
import {  
  Card, 
  Title, 
  Paragraph,
} from 'react-native-paper';

function Verify() {

  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const user = firebase.auth().currentUser;
  
  const [verify, setVerify] = React.useState([]);

   // * step 3 declare picture url for displaying (rmb import useState at top)
   const [imageUrl, setImageUrl] = useState(undefined);
  
   // * step 3a call image from storage (rmb import useEffect at top)
   useEffect(() => {
     if(user){
     storage()
       .ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + "Verify" +user.uid) //name in storage in firebase console
       .getDownloadURL()
       .then((url) => {
         setImageUrl(url);
         
       })
       .catch((e) => console.log('Errors while downloading => ', e));
     }
   }, []);
 

  const renderItem = ({item}) => {
    return (
      <View>
        <Card>
          <Card.Content>
          <Paragraph><Text style={styles.baseText}>Verification Status :</Text> <Text style={{color:'red'}}>{item.status}</Text> </Paragraph>  
          <Paragraph><Text style={styles.baseText}>Professional Field  :</Text> {item.proField} </Paragraph> 
          <Paragraph><Text style={styles.baseText}>Applied Datetime    :</Text> {item.datetime} </Paragraph> 
          {imageUrl? ( <Image style={styles.tinyLogo} source={{uri: imageUrl}}/>) : ( <Image style={styles.tinyLogo} source={{uri: imageUrl}}/>)}
         
          </Card.Content>
        </Card>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('verifyPro')
      .where('userId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const verify = [];
  
          querySnapshot.forEach(documentSnapshot => {
            verify.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
          setVerify(verify);
         
  
        });
    
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  
  

  return (
    <View style={styles.container}>
        <FlatList
        ref={flatlistRef}
        data={verify}
        keyExtractor={item => item.verifyProId}
        renderItem={renderItem}
      />
    </View>
  );
  

}



export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  baseText: {
    fontWeight: 'bold'
  },
  tinyLogo: {
    width: 350,
    height: 350,
    margin: 5,
  },
  
});
