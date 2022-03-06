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
const EditFeed = ({navigation, route}) => {
  const {item} = route.params;
  const user = firebase.auth().currentUser;
  const [txtHashtag, setTxtHashtag] = useState(item.hashtag);
  const [txtDes, setTxtDes] = useState(item.description);
  const [txtTitles, setTxtTitles] = useState(item.title);
  const [txtDetails, setTxtDetails] = useState(item.details);

  //image

  const ref = firestore().collection('feed').doc(item.feedId);

  const [feedId, setFeedId] = useState('');
  const [feedDocId, setFeedDocId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const resetData = e => {
    e.preventDefault();
    setTxtHashtag(item.hashtag);
    setTxtDes(item.description);
    setTxtDetails(item.details);
    setTxtTitles(item.title);
  };
  async function updateFeedCol() {
    await ref

      .update({
        title: txtTitles,
        description: txtDes,
        hashtag: txtHashtag,
        details: txtDetails,
      })
      .then(() => {
        Alert.alert('Success ✅', 'Feed Updated Success');
      });
    setTxtHashtag('');
    setTxtDes('');
    setTxtTitles('');
    setTxtDetails('');
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Profesional Feed</Text>
        <Text style={styles.header_text}>Share it with others</Text>
      </View>

      <View style={styles.footer}>
        <ScrollView>
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

          <View style={styles.button}>
            <Button
              mode="outlined"
              onPress={() => {
                updateFeedCol();
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
        </ScrollView>
      </View>
    </View>
  );
};

export default EditFeed;

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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
