import React from 'react';
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


const onAvatarChange = (image: ImageOrVideo) => {
  console.log(image);

  // user id
  let userId = 'U002';

  // upload image to server here
  let reference = storage().ref('gs://supermama-6aa87.appspot.com/' + userId); //2
  let task = reference.putFile(image.path.toString());

  task
    .then(() => {
      console.log('Image uploaded to the bucket!');
    })
    .catch(e => console.log('uploading image error =>', e));
};


function EditProfile({navigation, route}){

  //navigation
  const {userCol} = route.params;
   //input
  const [txtName, setTxtName] = React.useState(userCol.name);
  const [txtBio, setTxtBio] = React.useState(userCol.bio);
  

  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
      <Avatar onChange={onAvatarChange} source={require('./sample.jpg')} />
      <Text>Press image to upload photo.</Text>
      </View>
      
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
          onPress={() => navigation.goBack()}
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
