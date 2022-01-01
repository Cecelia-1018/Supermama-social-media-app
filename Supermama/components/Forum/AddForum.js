import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
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
  
  //declare forum id with 'F + datetime'
  const [forumDocId, setForumDocId] = useState('');
  const [txtForumId, setForumId] = useState('');

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setForumDocId(
     'F' + date + month + year 
      +  hours +  min +  sec
    );
    setForumId(
     'F' + date + month + year 
      +  hours +  min +  sec
    );

  }, []);


  async function addForumCol() {
    await ref.doc(forumDocId).set({
      //add id here
      forumId: txtForumId,
      title: txtTil,
      description: txtDes,
      
    }).then(()=>{
      console.log('Forum added!');
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
            label="Description"
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