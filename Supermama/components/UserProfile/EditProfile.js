import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import { 
  TextInput, 
  Button,
  Title,
  Card,
  Snackbar,
} from 'react-native-paper';
import {Avatar} from './Avatar';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import ProfileScreen from './ProfileScreen';
import auth, {firebase} from '@react-native-firebase/auth';




function EditProfile({navigation, route}){
 
  //navigation
  const {item} = route.params;

  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  
  //declare input bio
  const [txtBio, setTxtBio] = React.useState(item.bio);

  //reset input bio
  const resetData = (e) => {
    e.preventDefault();
    setTxtBio(item.bio);
  }

  const ref = firestore().collection('users').doc(item.userId);
  async function updateUserCol() {
    if(!txtBio.trim()) {
      alert('Please enter your bio.');
      return;
    }else{
    await ref.update({
      bio: txtBio,
    }).then(()=>{
      console.log('user info updated!');
    });
    setTxtBio('');
    onToggleSnackBar();
    }
  }

  
  

  return (
    <View style={styles.container}>
    
      <Card>
        <Card.Content>
          <Title>Bio</Title>
          <TextInput
            label="bio"
            value={txtBio}
            onChangeText={setTxtBio}
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
          onPress={() => updateUserCol()}
          color="#FE7E9C"
          style={styles.submitButton}>
          Submit 
        </Button>
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'View Change',
          onPress: () => navigation.goBack(),
        }}>
        Update Successfully
      </Snackbar>

       <Button  mode="contained"
          color="#F4A1BE"
          style={styles.submitButton} onPress={resetData}>Reset</Button>
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
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   flex: 1,
  },
  userRow: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
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
});
