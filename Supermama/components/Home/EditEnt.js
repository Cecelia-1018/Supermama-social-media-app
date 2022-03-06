import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import {Card, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Icon} from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';

// * Step 1 : Import   step 5 at Certificate.js
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {PostImagePicker} from './PostImagePicker';
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';

import uploadImage from './uploadImage';

// * Step 2 : Write a image change

function EditEnt({navigation, route}) {
  const {item} = route.params;
  const user = firebase.auth().currentUser;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  const [txtHashtag, setTxtHashtag] = useState(item.hashtag);
  const [txtDes, setTxtDes] = useState(item.description);
  const [entDocId, setEntDocId] = useState(item.entId);
  const ref = firestore().collection('entertainment').doc(item.entId);
  const resetData = e => {
    e.preventDefault();
    setTxtHashtag(item.hashtag);
    setTxtDes(item.description);
  };

  async function updateEntertainmentCol() {
    await ref
      .update({
        description: txtDes,
        hashtag: txtHashtag,
      })
      .then(() => {
        Alert.alert('Success ✅', 'Post Updated Success');
      });
    setTxtHashtag('');
    setTxtDes('');
    navigation.goBack();
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
        {/* <Text style={[styles.text_footer, {marginTop: 10}]}>Image</Text>
          <Image source={{uri: imageUrl}} /> */}
        <View style={styles.button}>
          <Button
            mode="outlined"
            onPress={() => {
              updateEntertainmentCol();
            }}
            color="#FE7E9C">
            Update
          </Button>
          <Button mode="outlined" color="#FE7E9C" onPress={resetData}>
            Reset
          </Button>
          <Button
            mode="outlined"
            color="#FE7E9C"
            onPress={() => navigation.goBack()}>
            Back
          </Button>
        </View>
      </View>
    </View>
  );
}

export default EditEnt;

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
    flex: 3,
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
