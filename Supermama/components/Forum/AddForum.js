import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TextInput, Card, Title, Button, Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import YoursForum from './YoursForum';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

function AddForum({navigation}) {
  //input
  const [txtTil, setTxtTitle] = React.useState('');
  const [txtDes, setTxtDes] = React.useState('');

  //firebase
  const ref = firestore().collection('forums');

  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  //declare forum id with 'F + datetime'
  const [forumDocId, setForumDocId] = useState('');
  const [txtForumId, setForumId] = useState('');

  //set date time for each forum post
  const [forumDate, setForumDate] = useState('');
  const [forumTime, setForumTime] = useState('');

  useEffect(() => {
    var head = Date.now().toString();
    var tail = Math.random().toString().substr(2);
    
    const d = new Date()
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();

    setForumDocId('F' + head + tail);
    setForumId('F' + head + tail);
    setForumDate(date);
    setForumTime(time);

    
  }, []);

  //add userId
  const user = firebase.auth().currentUser;

  //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState(undefined);
  
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }, []);

  //get username
  //display data
  const [userCol, setUserCol] = useState([]);
  const [username, setUserName] = useState('');
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .where('userId', 'in', [user.uid])
      .onSnapshot(querySnapshot => {
        const userCol = [];

        querySnapshot.forEach(documentSnapshot => {
          userCol.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        
        setUserCol(userCol);
        setUsername(userCol.name);
  });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);


  async function addForumCol() {
    if (user) {
      if (!txtTil.trim()) {
        alert('Please enter your question title.');
        return;
      } else if (!txtDes.trim()) {
        alert('Please describe a bit your problem.');
        return;
      } else {
        await ref
          .doc(forumDocId)
          .set({
            //add id here
            forumId: txtForumId,
            title: txtTil,
            description: txtDes,
            date: forumDate,
            time: forumTime,
            photoUrl: imageUrl,
            username: username,
            userId: user.uid,
          })
          .then(() => {
            console.log('Forum added!');
          });
        setTxtTitle('');
        setTxtDes('');
        onToggleSnackBar();
        navigation.navigate('Yours');
      }
    } else {
      console.log('cannot add on');
    }
  }

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Title </Title>
          <TextInput
            value={txtTil}
            onChangeText={setTxtTitle}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
        </Card.Content>
        <Card.Content>
          <Title>Description</Title>
          <TextInput
            value={txtDes}
            onChangeText={setTxtDes}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
            multiline={true}
            numberOfLines={5}
          />
        </Card.Content>
      </Card>

      <View style={styles.btnContainer}>
        <Button
          mode="contained"
          onPress={() => {
            addForumCol();
          }}
          color="#FE7E9C"
          style={styles.submitButton}>
          Submit
        </Button>
          <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'See Post', 
            onPress: () => {
              navigation.goBack();
            },
          }}>
          Forum post added!
        </Snackbar>

        <Button
          mode="contained"
          color="#f0ccd2"
          style={styles.submitButton}
          onPress={() => navigation.goBack()}>
          Back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row-reverse',
  },
  submitButton: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default AddForum;
