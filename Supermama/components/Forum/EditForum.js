import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TextInput, Card, Title, Button, Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

function EditForum({navigation, route}) {
  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  //navigation
  const {item} = route.params;

  //input
  const [txtTil, setTxtTitle] = React.useState(item.title);
  const [txtDes, setTxtDes] = React.useState(item.description);

  const resetData = (e) => {
    e.preventDefault();
    setTxtTitle(item.title);
    setTxtDes(item.description);
  }

  //firebase
  const ref = firestore().collection('forums').doc(item.forumId);

  async function updateForumCol() {
     if (!txtTil.trim()) { 
      alert('Please enter your question title.');
        return;
      } else if (!txtDes.trim()) {
        alert('Please describe a bit your problem.');
        return;
      } else {
      await ref
        .update({
          title: txtTil,
          description: txtDes,
        })
        .then(() => {
          console.log('Forum updated!');
        });
      setTxtTitle('');
      setTxtDes('');
      onToggleSnackBar();
      navigation.goBack();
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
            updateForumCol()
          }}
          color="#FE7E9C"
          style={styles.updateButton}>
          Update
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
          Forum post updated!
        </Snackbar>
        
        <Button  mode="contained"
          color="#F4A1BE"
          style={styles.updateButton} onPress={resetData}>Reset</Button>
        <Button
          mode="contained"
          color="#f0ccd2"
          style={styles.updateButton}
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
  updateButton: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default EditForum;
