import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { 
  TextInput, 
  Button,
  Title,
  Card
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

  // //display user profile picture
  // const [imageUrl, setImageUrl] = useState(undefined);
  
  // useEffect(() => {
  //   storage()
  //     .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + item.userId) //name in storage in firebase console
  //     .getDownloadURL()
  //     .then((url) => {
  //       setImageUrl(url);
  //     })
  //     .catch((e) => console.log('Errors while downloading => ', e));
  // }, []);



   //input
  const [txtName, setTxtName] = React.useState(item.name);
  const [txtBio, setTxtBio] = React.useState(item.bio);

  const ref = firestore().collection('users').doc(item.userId);
  async function updateUserCol() {
    await ref.update({
      name: txtName,
      bio: txtBio,
    }).then(()=>{
      console.log('user info updated!');
    });
    setTxtName('');
    setTxtBio('');
  }
  

  return (
    <View style={styles.container}>
      {/* <View style={styles.userRow}>
      <Avatar onChange={onAvatarChange} source={{uri: imageUrl}} />
      <Text>Press image to upload photo.</Text>
      </View> */}
      
      <Card>
        <Card.Content>
          <Title>Name</Title>
          <TextInput
            label="username"
            value={txtName}
            onChangeText={setTxtName}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
        </Card.Content>
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
