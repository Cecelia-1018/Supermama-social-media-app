import React,{useState, useEffect} from 'react';
import {View, Text, StyleSheet,SafeAreaView,ScrollView, StatusBar,Alert,} from 'react-native';
import { 
  Button,
  RadioButton,
 } from "react-native-paper";
// * Step 1 : Import   step 5 at Certificate.js
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Certificate} from './Certificate';  // rmb to create a Certificate js and copy the code from avatar.js so that you may resize you image
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// * Step 2 : Write a image change
const onImageChange = (image: ImageOrVideo) => {
  console.log(image);

  const user = firebase.auth().currentUser;
  if(user){
  let Id = "Verify" + user.uid;

  //* step 2 a : upload image to storage
  let reference = storage().ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + Id); //2
  let task = reference.putFile(image.path.toString());

  task
    .then(() => {
      console.log('Image uploaded to the bucket!');
    })
    .catch(e => console.log('uploading image error =>', e));
  }
};

function Apply({navigation}){

  const user = firebase.auth().currentUser;

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

  //radio button
  const [value, setValue] = React.useState('');
  const [applied, setApplied] = React.useState(undefined);
  const [verify, setVerify] = React.useState([]);

  //firebase
  const ref = firestore().collection('verifyPro');
  
  const id = 'VP'+user.uid;

  async function addVerifyProCol(){
    if(user){
      if(!value.trim()){
        alert('Please select one of the field for submission.');
        return;
      } else if (!imageUrl){
        alert('Upload your certificate before submit.')
      } else {
        await ref.doc(id)
        .set({
          verifyProId: id,
          proField: value,
          userId: user.uid,
        })
        .then(() =>{
          console.log('Verify Pro added!')
        });
        setValue('');
        navigation.navigate('Verify');
      }
    }
  }

   //alert confimation
  const createTwoButtonAlert = () =>
  Alert.alert('Confirmation', 'Confirm to submit?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Confirm', onPress: () => addVerifyProCol() },
  ]);

  
  
  useEffect(() => {
    const subscriber = firestore()
      .collection('verifyPro')
      .where('userId', 'in', [user.uid])
      .onSnapshot(querySnapshot => {
        const verify = [];
         console.log('applied exists: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          verify.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
       
        setVerify(verify);
        if(querySnapshot.size > 1){
        setApplied(true);
        }
        
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);


  return (
 
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.instruction}>Step 1: Click the picture to upload certificate. {'\n'} </Text>
        {/* * step 4 place image change at screen */}
       <View style={styles.imageContainer}> 
       <Certificate onChange={onImageChange} source={imageUrl? {uri: imageUrl} : require('../UserProfile/addimg.png')} />
        {imageUrl ?  null : <Text>Press image to upload photo.</Text>}
        </View>

        <Text style={styles.instruction}>Step 2: Select your professional field. {'\n'} </Text>
        
        <RadioButton.Group onValueChange={value => setValue(value)} value={value}  >
            <RadioButton.Item color='pink' label="Art / Design" value="Art / Design" />
            <RadioButton.Item color='pink' label="Career Counselling" value="Career Counselling" />
            <RadioButton.Item color='pink' label="Early Child Education" value="Early Child Education" />
            <RadioButton.Item color='pink' label="Entrepreneurship" value="Entrepreneurship" />
            <RadioButton.Item color='pink' label="Fashion Design & Merchandising" value="Fashion Design & Merchandising" />
            <RadioButton.Item color='pink' label="Finance and Banking" value="Finance and Banking" />
            <RadioButton.Item color='pink' label="Healthcare/Medicine" value="Healthcare/Medicine" />
            <RadioButton.Item color='pink' label="Human Resources" value="Human Resources" />
            <RadioButton.Item color='pink' label="Information Technology" value="Information Technology" />
            <RadioButton.Item color='pink' label="Law" value="Law" />
            <RadioButton.Item color='pink' label="Nutrition / Fitness" value="Nutrition / Fitness" />
            <RadioButton.Item color='pink' label="Primary / Secondary Education" value="Primary / Secondary Education" />
            <RadioButton.Item color='pink' label="Social Work" value="Social Work" />
            <RadioButton.Item color='pink' label="Others" value="Others" />
        </RadioButton.Group>
        
        {applied ? null : <Button mode="contained" onPress={createTwoButtonAlert}  color="#f0ccd2" style={styles.imageContainer}>
            Submit
          </Button>}
         
        
        
       
   
     </ScrollView>
    </SafeAreaView>

  );
};

export default Apply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  instruction:{
    marginTop: 15,
    marginLeft:15,
    marginRight: 15,
    fontWeight: "bold",
    color: "black",
  },
  imageContainer: {
    margin: 12,
  },
  
});