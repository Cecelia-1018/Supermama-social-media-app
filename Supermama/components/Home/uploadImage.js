import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

import {ImageOrVideo} from 'react-native-image-crop-picker';
import {PostImagePicker} from './PostImagePicker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

function uploadImage({navigation}) {
  const [entId, setEntId] = useState('');
  const [entDocId, setEntDocId] = useState('');

  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setEntId('E' + date + hours + min + sec);
    setEntDocId('E' + date + hours + min + sec);
  }, []);

  const onImageChange = (image: ImageOrVideo) => {
    console.log(image);
    let Id = entId;
    //* step 2 a : upload image to storage
    let reference = storage().ref(
      'gs://supermama-6aa87.appspot.com/Entertainment/' + Id,
    ); //2
    let task = reference.putFile(image.path.toString());

    task
      .then(() => {
        console.log('Image uploaded to the bucket!');
      })
      .catch(e => console.log('uploading image error =>', e));
  };

  // * step 3 declare picture url for displaying (rmb import useState at top)
  const [imageUrl, setImageUrl] = useState(null);
  // * step 3a call image from storage (rmb import useEffect at top)

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/Entertainment/' + entId) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
        console.log(imageUrl);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  return (
    <View>
      <Text>Choose an image for your post first</Text>
      <PostImagePicker
        onChange={onImageChange}
        source={imageUrl ? {uri: imageUrl} : require('./plus.png')}
      />
      {imageUrl ? null : <Text>Press image to upload photo.</Text>}
      <View style={styles.button}>
        <Button
          mode="outlined"
          onPress={() => {
            navigation.navigate('Create Post', {
              item: {
                entId: entId,
              },
            });
          }}
          color="#FE7E9C">
          Submit
        </Button>
      </View>
    </View>
  );
}

export default uploadImage;

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    justifyContent: 'space-evenly',
  },
});
