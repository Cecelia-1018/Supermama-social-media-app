import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TextInput, Card, Title, Button, Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import YoursForum from './YoursForum';
import auth, {firebase} from '@react-native-firebase/auth';

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

  useEffect(() => {
    var head = Date.now().toString();
    var tail = Math.random().toString().substr(2);

    setForumDocId('F' + head + tail);
    setForumId('F' + head + tail);
  }, []);

  async function addForumCol() {
    //add userId
    const user = firebase.auth().currentUser;
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
            label: 'See Post', //add to navigate to forum post detail page
            onPress: () => {
              // Do something
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
