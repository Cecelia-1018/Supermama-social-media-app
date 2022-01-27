import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {Card, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import auth, {firebase} from '@react-native-firebase/auth';
import EntertainmentHome from './EntertainmentHome';
import PostImagePicker from './PostImagePicker';
import storage from '@react-native-firebase/storage';

function AddEntertainment({navigation, props}) {
  const user = firebase.auth().currentUser;
  let upImage = {uri: '../UserProfile/sample.jpg'};
  setEntImage = image => {
    upImage.setFieldValue('imageUri', image.uri);
  };

  const [txtHashtag, setTxtHashtag] = useState('');
  const [txtDes, setTxtDes] = useState('');
  //image

  const ref = firestore().collection('entertainment');

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

  async function addEntertainmentCol() {
    await ref
      .doc(entDocId)
      .set({
        userId: user.uid,
        entertainmentId: entId,
        description: txtDes,
        hashtag: txtHashtag,
        imageUri: upImage,
      })
      .then(() => {
        Alert.alert('Success ✅', 'Post Added Success');
      });
    setTxtHashtag('');
    setTxtDes('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Picture And Words</Text>
        <Text style={styles.header_text}>
          Share to people who know about you
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.text_footer}>Username</Text>
        <Text style={[styles.text_footer, {marginTop: 20}]}>Hashtag</Text>
        <View style={styles.action}>
          <Feather name="hash" color="grey" size={25} style={{marginTop: 10}} />
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
        <PostImagePicker image={upImage} onImagePicked={setEntImage} />
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
      </View>
    </View>
  );
}

export default AddEntertainment;

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
