import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import auth, {firebase} from '@react-native-firebase/auth';
import {PostImagePicker} from '../Home/PostImagePicker';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const AddFeed = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const [txtHashtag, setTxtHashtag] = useState('');
  const [txtDes, setTxtDes] = useState('');
  const [txtTitles, setTxtTitles] = useState('');
  const [txtDetails, setTxtDetails] = useState('');
  const [txtLink, setTxtLink] = useState('');
  //image

  const ref = firestore().collection('feed');

  const [feedId, setFeedId] = useState('');
  const [feedDocId, setFeedDocId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setFeedId('FE' + date + hours + min + sec);
    setFeedDocId('FE' + date + hours + min + sec);
  }, []);

  const onImageChange = (image: ImageOrVideo) => {
    console.log(image);
    let Id = feedId;
    //* step 2 a : upload image to storage
    let reference = storage().ref(
      'gs://supermama-6aa87.appspot.com/Product/' + Id,
    ); //2
    let task = reference.putFile(image.path.toString());

    task
      .then(async res => {
        const imageU = await storage()
          .ref(res.metadata.fullPath)
          .getDownloadURL();
        setImageUrl(imageU);
        console.log('Image uploaded to the bucket!');
      })
      .catch(e => console.log('uploading image error =>', e));
  };
  useEffect(() => {
    if (user) {
      storage()
        .ref('gs://supermama-6aa87.appspot.com/Product/' + feedId) //name in storage in firebase console
        .getDownloadURL()
        .then(url => {
          setImageUrl(url);
          console.log(imageUrl);
        })
        .catch(e => console.log('Errors while downloading => ', e));
    }
  }, [feedId, imageUrl, user]);

  async function addFeedCol() {
    await ref
      .doc(feedDocId)
      .set({
        userId: user.uid,
        username: user.displayName,

        feedId: feedId,
        title: txtTitles,
        description: txtDes,
        hashtag: txtHashtag,
        details: txtDetails,
        hyperlink: txtLink,
        image: imageUrl,
        post: Boolean(false),
      })
      .then(() => {
        Alert.alert('Success ✅', 'Feed Added Success');
      });
    setTxtHashtag('');
    setTxtDes('');
    setTxtTitles('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Profesional Feed</Text>
        <Text style={styles.header_text}>Share it with others</Text>
      </View>

      <View style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>{user.displayName}</Text>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Title</Text>
          <View style={styles.action}>
            <TextInput
              label="Title"
              value={txtTitles}
              onChangeText={setTxtTitles}
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
              numberOfLines={4}
              color="black"
              placeholder="not more than 70 characters"
            />
          </View>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Hashtag</Text>
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
          <Text style={[styles.text_footer, {marginTop: 10}]}>Details</Text>
          <View style={styles.action}>
            <TextInput
              label="Details"
              value={txtDetails}
              onChangeText={setTxtDetails}
              multiline={true}
              numberOfLines={10}
              color="black"
            />
          </View>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Hyperlink</Text>
          <View style={styles.action}>
            <TextInput
              label="Hyperlink"
              value={txtLink}
              onChangeText={setTxtLink}
              color="black"
              placeholder="hyperlink if have"
              selectTextOnFocus={true}
            />
          </View>
          <Text style={[styles.text_footer, {marginTop: 10}]}>Image</Text>
          <PostImagePicker
            onChange={onImageChange}
            source={imageUrl ? {uri: imageUrl} : require('./plus.png')}
          />
          <View style={styles.button}>
            <Button
              mode="outlined"
              onPress={() => {
                addFeedCol(), navigation.goBack();
              }}
              color="#FE7E9C">
              Submit
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddFeed;

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
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
