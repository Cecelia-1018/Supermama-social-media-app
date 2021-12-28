import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { 
  TextInput, 
  Card , 
  Title, 
  Button,
  Snackbar
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';


//alert confimation
const createTwoButtonAlert = () =>
  Alert.alert('Confirmation', 'Confirm to submit?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Confirm', onPress: () => console.log('Confirm Pressed') },
]);

function AddForum({navigation}){
  //input
  const [txtTil, setTxtTitle] = React.useState('');
  const [txtDes, setTxtDes] = React.useState('');
  
  //firebase
  const ref = firestore().collection('forums');

  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  async function addForumCol() {
    await ref.add({
      //add id here
      title: txtTil,
      description: txtDes,
      
    });
    setTxtTitle('');
    setTxtDes('');
  }

  async function forumPosted(){
    addForumCol();
    onToggleSnackBar();

  }

  
 
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Title </Title>
          <TextInput
            label="Title"
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
            label="Title"
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
          onPress={() => forumPosted()}
          color="#FE7E9C"
          style={styles.submitButton}>
          Submit 
        </Button>
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'See Post',   //add to navigate to forum post detail page
          onPress: () => {
            // Do something
          },
        }}>
        Forum post created!
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
  btnContainer:{
    flexDirection: "row-reverse",
  },
  submitButton:{
   marginLeft:15,
   marginRight: 15,
   marginBottom: 10,
   marginTop: 10
  },
})

export default AddForum;