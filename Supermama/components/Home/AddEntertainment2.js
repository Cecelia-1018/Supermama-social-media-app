import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Card, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';

// * Step 1 : Import   step 5 at Certificate.js
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {PostImagePicker} from './PostImagePicker';
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';

// * Step 2 : Write a image change

function AddEntertainment2() {
  const user = firebase.auth().currentUser;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setAvatarUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

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

  const [txtHashtag, setTxtHashtag] = useState('');
  const [txtDes, setTxtDes] = useState('');
  const [txtUrl, setTxtUrl] = useState(undefined);

  const ref = firestore().collection('entertainment');

  async function addEntertainmentCol() {
    await ref
      .doc(entDocId)
      .set({
        userId: user.uid,
        username: user.displayName,
        entertainmentId: entId,
        description: txtDes,
        hashtag: txtHashtag,
        avatar: avatarUrl,
        image: imageUrl,
      })
      .then(() => {
        Alert.alert('Success ✅', 'Post Added Success');
      });
    setTxtHashtag('');
    setTxtDes('');
  }

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
  const [imageUrl, setImageUrl] = useState(undefined);
  // * step 3a call image from storage (rmb import useEffect at top)

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/Entertainment/' + entId) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
        console.log(ImageUrl);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Picture And Words</Text>
        <Text style={styles.header_text}>
          Share to people who know about you
        </Text>
      </View>
      <View style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>{user.displayName}</Text>
          <Text style={[styles.text_footer, {marginTop: 20}]}>Hashtag</Text>
          <View style={styles.action}>
            <Feather
              name="hash"
              color="grey"
              size={25}
              style={{marginTop: 10}}
            />
            <TextInput
              label="Hashtag"
              value={txtHashtag}
              onChangeText={setTxtHashtag}
              color="black"
            />
          </View>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Description</Text>
          <View style={styles.action}>
            <TextInput
              label="Description"
              value={txtDes}
              onChangeText={setTxtDes}
              multiline={true}
              numberOfLines={3}
              color="black"
            />
          </View>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Image</Text>
          <PostImagePicker
            onChange={onImageChange}
            source={imageUrl ? {uri: imageUrl} : require('./plus.png')}
          />
          {imageUrl ? null : <Text>Press image to upload photo.</Text>}
          <View style={styles.button}>
            <Button
              mode="outlined"
              onPress={() => {
                addEntertainmentCol();
              }}
              color="#FE7E9C">
              Submit
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default AddEntertainment2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  header_text: {
    color: 'grey',
    marginTop: 5,
  },
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -10,
    paddingLeft: 12,
    paddingBottom: 2,
    color: '#05375a',
  },
  button: {
    marginTop: 30,
    justifyContent: 'space-evenly',
  },
});
