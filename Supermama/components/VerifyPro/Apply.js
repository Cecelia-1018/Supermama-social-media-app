import React,{useState, useEffect} from 'react';
import {View, Text, StyleSheet,SafeAreaView,ScrollView, StatusBar,Alert,} from 'react-native';
import { 
  Button,
  RadioButton,
  IconButton,
  TextInput,
  Card,
 } from "react-native-paper";
// * Step 1 : Import   step 5 at Certificate.js
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Certificate} from './Certificate';  // rmb to create a Certificate js and copy the code from avatar.js so that you may resize you image
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// * Step 2 : Write a image change
const onImageChange = (image: ImageOrVideo) => {
  console.log(image);

  const user = firebase.auth().currentUser;

  if(user){
  let Id = "Verify" + user.uid;

  //* step 2 a : upload image to storage
  let reference = storage().ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + Id); //2
  let task = reference.putFile(image.path.toString());

  task
    .then(() => {
      console.log('Image uploaded to the bucket!');
    })
    .catch(e => console.log('uploading image error =>', e));
  }
};

function Apply({navigation}){

  const user = firebase.auth().currentUser;
  const [verify, setVerify] = React.useState([]);

  //input
  const [txtLoc, setTxtLoc] = React.useState('');
  const [txtContact, setTxtContact] = React.useState('');
  const [txtWebUrl, setWebUrl]= React.useState('');

  // * step 3 declare picture url for displaying (rmb import useState at top)
  const [imageUrl, setImageUrl] = useState('');
  
  // * step 3a call image from storage (rmb import useEffect at top)
  useEffect(() => {
    if(user){
    storage()
      .ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + "Verify" +user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
    }
  }, []);

  const deleteFromFirebase = (url) => {
     //name in storage in firebase console
   //2.
   storage().ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + "Verify" +user.uid).delete()
      .then(() => {
        //3.
        setImageUrl(imageUrl.filter((image) => image !== url));
        alert("Picture is deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //radio button
  const [value, setValue] = React.useState('');
  const [applied, setApplied] = React.useState(false);
  
   //set date time for each forum post
   const [appliedDate, setAppliedDate] = useState('');
   const [appliedTime, setAppliedTime] = useState('');
   
   useEffect(() => {
     
     const d = new Date()
     var date = d.toLocaleDateString();
     var time = d.toLocaleTimeString();
    
     setAppliedDate(date);
     setAppliedTime(time);
     
   }, []);

   const datetime = appliedDate + appliedTime;
   
  //firebase
  const ref = firestore().collection('verifyPro');
  
  const id = 'VP'+user.uid;

  const pending = 'Pending';

  async function addVerifyProCol(){
    if(user){
      if(!value.trim()){
        alert('Please select one of the field for submission.');
        return;
      // } else if (imageUrl){
      //   alert('Upload your certificate before submit.')
      } else {

        const url = await storage().ref('gs://supermama-6aa87.appspot.com/VerifyPro/' + "Verify" +user.uid).getDownloadURL();
        await ref.doc(id)
        .set({
          verifyProId: id,
          proField: value,
          userId: user.uid,
          status: pending,
          photoURL: url.toString(),
          datetime: datetime,
          location: txtLoc,
          contact: txtContact,
          web: txtWebUrl,

        })
        .then(() =>{
          console.log('Verify Pro added!')
        });
       
        setValue('');
        setTxtLoc('');
        setTxtContact('');
        setWebUrl('');
        setImageUrl('');
        navigation.navigate('Verify');
      }
    }
  }

   //alert confimation
  const createTwoButtonAlert = () =>
  Alert.alert('Confirmation', 'Confirm to submit?', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Confirm', onPress: () => addVerifyProCol() },
  ]);



 
  
  useEffect(() => {
    const subscriber = firestore()
      .collection('verifyPro')
      .where('userId', 'in', [user.uid])
      .onSnapshot(querySnapshot => {
        const verify = [];
         console.log('applied exists: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          verify.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
       
        setVerify(verify);
        if(querySnapshot.size == 1){
        setApplied(true);
        }else{
          setApplied(false);
        }
        
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);


  return (
 
    <SafeAreaView style={styles.container}>
     <ScrollView style={styles.scrollView}>
     

           <View style={styles.imageContainer}> 
           {applied ?  null : 
           <View> 
           <Text style={styles.instruction}>Step 1: Click the blank to upload certificate. {'\n'} </Text>
           <Certificate onChange={onImageChange} source={{uri: imageUrl}} /> 
           </View>
           }
           
            </View>
    
            
            
        
        {applied ? (
          <View style={{alignItems: 'center',
          justifyContent: 'center',}}> 
        <Button mode="contained" disabled='true' onPress={createTwoButtonAlert}  color="#f0ccd2" style={styles.imageContainer}>
            Done Applied and Wait for Response
          </Button>
          <Text style={{margin: 20, }}> Your submission is done.</Text>
          <IconButton
                  color="red"
                  size={20}
                  icon={require('../Forum/delete-bin.png')}
                  onPress={() =>
                    Alert.alert('Confirmation', 'Confirm to delete your submission,"undo" is not allowed?', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'Confirm',
                        onPress: () => {
                          ref.doc(id)
                          .delete()
                          .then(() => {
                              console.log('submission deleted!');
                          }), 
                          deleteFromFirebase(imageUrl);
                        }

                      },
                    ])
                  }/> 
          </View>
          ) : ( 
            <View> 
            <Text style={styles.instruction}>Step 2: Select your professional field. {'\n'} </Text>
            
            <RadioButton.Group onValueChange={value => setValue(value)} value={value}  >
                <RadioButton.Item color='pink' label="Art / Design" value="Art / Design" />
                <RadioButton.Item color='pink' label="Career Counselling" value="Career Counselling" />
                <RadioButton.Item color='pink' label="Early Child Education" value="Early Child Education" />
                <RadioButton.Item color='pink' label="Entrepreneurship" value="Entrepreneurship" />
                <RadioButton.Item color='pink' label="Fashion Design & Merchandising" value="Fashion Design & Merchandising" />
                <RadioButton.Item color='pink' label="Finance and Banking" value="Finance and Banking" />
                <RadioButton.Item color='pink' label="Healthcare/Medicine" value="Healthcare/Medicine" />
                <RadioButton.Item color='pink' label="Human Resources" value="Human Resources" />
                <RadioButton.Item color='pink' label="Information Technology" value="Information Technology" />
                <RadioButton.Item color='pink' label="Law" value="Law" />
                <RadioButton.Item color='pink' label="Nutrition / Fitness" value="Nutrition / Fitness" />
                <RadioButton.Item color='pink' label="Primary / Secondary Education" value="Primary / Secondary Education" />
                <RadioButton.Item color='pink' label="Social Work" value="Social Work" />
                <RadioButton.Item color='pink' label="Others" value="Others" />
            </RadioButton.Group>
          
           
      <Card>
      <Card.Content>
      <Text style={styles.instruction2}>Step 3: Fill in your other details. {'\n'} </Text>
      <Text style={styles.instruction2}>Enter Your Workplace's Location (Optional)</Text>
          <TextInput
            value={txtLoc}
            onChangeText={setTxtLoc}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
        </Card.Content>
       
        <Card.Content>
        <Text style={styles.instruction2}>Enter Your Contact (Optional)</Text>
          <TextInput
            value={txtContact}
            onChangeText={setTxtContact}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
          <Text>Email / Phone No / Other contact method</Text>
        </Card.Content>
      <Card.Content>
      <Text style={styles.instruction2}>Give Your Company Website (Optional)</Text>
          <TextInput
            value={txtWebUrl}
            onChangeText={setWebUrl}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
          </Card.Content>
          </Card>
          <Button mode="contained" onPress={createTwoButtonAlert}  color="#f0ccd2" style={styles.imageContainer}>
            Submit
          </Button>
          </View>
          
         ) }
      
      
         
        
        
       
         </ScrollView>
     
    </SafeAreaView>

  );
};

export default Apply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  instruction:{
    marginTop: 15,
    marginLeft:15,
    marginRight: 15,
    fontWeight: "bold",
    color: "black",
  },
  instruction2:{
    marginTop: 15,
    marginLeft:5,
    marginRight: 15,
    fontWeight: "bold",
    color: "black",
  },
  imageContainer: {
    margin: 5,
  },

  
});