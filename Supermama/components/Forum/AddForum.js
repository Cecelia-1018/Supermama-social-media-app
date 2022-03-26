import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert,SafeAreaView,ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TextInput, Card, Title, Button, Snackbar,Switch, Paragraph, Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import YoursForum from './YoursForum';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import SelectDropdown from 'react-native-select-dropdown';
 

function AddForum({navigation}) {
  //input
  const [txtTil, setTxtTitle] = React.useState('');
  const [txtDes, setTxtDes] = React.useState('');
  const [txtHashtag, setHashtag] = React.useState('optional');
  const [txtCategory, setCategory] = React.useState('');

  //declare forum id with 'F + datetime'
  const [forumDocId, setForumDocId] = useState('');
  const [txtForumId, setForumId] = useState('');

  //set date time for each forum post
  const [forumDate, setForumDate] = useState('');
  const [forumTime, setForumTime] = useState('');

  useEffect(() => {
    const d = new Date();
    var hours = d.getHours(); //To get the Current Hours
    var min = d.getMinutes(); //To get the Current Minutes
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();

    setForumDocId('F' + hours + min);
    setForumId('F' + hours + min);
    setForumDate(date);
    setForumTime(time);

    
  }, []);


  //switch
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  //categories
  const categories = ['Education','Food','Female Disease','Heathcare','Life','Pregnancy','Parenting','Other'];

  //firebase
  const ref = firestore().collection('forums');

  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  

  //add userId
  const user = firebase.auth().currentUser;

  //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState('null'); //add anonymous avatar
  
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
  }, []);

  async function addForumCol() {
    if (user) {
      if (!txtTil.trim()) {
        alert('Please enter your question title.');
        return;
      } else if (!txtDes.trim()) {
        alert('Please describe a bit your problem.');
        return;
      } else if (!txtHashtag.trim()) {
        alert('Please add a hashtag.');
        return;
      } else if (!txtCategory.trim()) {
        alert('Please select category.');
        return;
      } else {
        if(!isSwitchOn){
          await ref
          .doc(forumDocId)
          .set({
            //add id here
            forumId: txtForumId,
            title: txtTil,
            description: txtDes,
            hashtag: txtHashtag, 
            category: txtCategory,
            date: forumDate,
            time: forumTime,
            photoUrl: imageUrl,
            username: user.displayName,
            userId: user.uid,
          })
          .then(() => {
            console.log('Forum added!');
          });
        setTxtTitle('');
        setTxtDes('');
        setHashtag('');
        setCategory('');
        // setUserName('');
        onToggleSnackBar();
        navigation.navigate('Yours');
        }else{
        

        await ref
          .doc(forumDocId)
          .set({
            //add id here
            forumId: txtForumId,
            title: txtTil,
            description: txtDes,
            hashtag: txtHashtag, 
            category: txtCategory,
            date: forumDate,
            time: forumTime,
            photoUrl: 'https://thumbs.dreamstime.com/b/iconic-image-social-networks-anonymous-very-personal-character-social-profile-over-pure-purple-background-148178926.jpg',
            username: 'Anonymous',
            userId: user.uid,
          })
          .then(() => {
            console.log('Forum added!');
          });
        setTxtTitle('');
        setTxtDes('');
        setHashtag('');
        setCategory('');
        // setUserName('');
        onToggleSnackBar();
        navigation.navigate('Yours');
        }
        
      }
    } else {
      console.log('cannot add on');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
      <Card>
      <Card.Content>
          <Title>Enter Your Question </Title>
          <TextInput
            value={txtTil}
            onChangeText={setTxtTitle}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
        </Card.Content>
       
        <Card.Content>
          <Title>Give more describe your question</Title>
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
      <Card.Content>
          <Title>Add a hashtag </Title>
          <TextInput
            value={txtHashtag}
            onChangeText={setHashtag}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
          <Text>Give a meaningful hashtag name for other easy search.</Text>
          </Card.Content>
          <Card.Content>
          <Title>Select Category</Title>
          
          <SelectDropdown
            data={categories}
            dropdownBackgroundColor='#FFC0CB'
            onSelect={selectedItem => setCategory(selectedItem)}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            defaultButtonText="Select Category"
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
         
        </Card.Content>

       
        
        <Card.Content>
        <Title>Switch On or Off Anonymous mode</Title>
        <Paragraph>This will hide your name and profile picture for this forum post.</Paragraph>
        <View style={{marginLeft: 15}}> 
        <Switch 
        value={isSwitchOn} 
        onValueChange={onToggleSwitch}
        color='#FE7E9C'/>
        </View>
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
    
    </ScrollView>
     
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
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
  dropdown1BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFC0CB",
  },
  dropdown1BtnTxtStyle: { color: "#444", textAlign: "left" },
  dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
  dropdown1RowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
});

export default AddForum;
