import React,{useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

// * Step 1 : Import   step 5 at Certificate.js
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Certificate} from './Certificate';  // rmb to create a Certificate js and copy the code from avatar.js so that you may resize you image
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';

// * Step 2 : Write a image change
const onImageChange = (image: ImageOrVideo) => {
  console.log(image);

  const user = firebase.auth().currentUser;

  let Id = "Verify" + user.uid;

  //* step 2 a : upload image to storage
  let reference = storage().ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + Id); //2
  let task = reference.putFile(image.path.toString());

  task
    .then(() => {
      console.log('Image uploaded to the bucket!');
    })
    .catch(e => console.log('uploading image error =>', e));
};

const Apply = () => {

  const user = firebase.auth().currentUser;

  // * step 3 declare picture url for displaying (rmb import useState at top)
  const [imageUrl, setImageUrl] = useState(undefined);
  
  // * step 3a call image from storage (rmb import useEffect at top)
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + "Verify" +user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }, []);


  return (
    <View style={styles.container}>
      <Text>ChatScreen</Text>
        {/* * step 4 place image change at screen */}
       <Certificate onChange={onImageChange} source={imageUrl? {uri: imageUrl} : require('../UserProfile/addimg.png')} />
        {imageUrl ?  null : <Text>Press image to upload photo.</Text>}
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default Apply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});