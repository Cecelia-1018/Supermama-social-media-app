import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {TextInput, Card, Title,Switch, Paragraph, Button, Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import SelectDropdown from 'react-native-select-dropdown';
import storage from '@react-native-firebase/storage';

function EditForum({navigation, route}) {
  //snackbar
  const [visible, setVisible] = React.useState(false);
  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  //switch
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  
  //categories
  const categories = ['Education','Food','Female Disease','Heathcare','Life','Pregnancy','Parenting','Other'];

  //navigation
  const {item} = route.params;
  //add userId
  const user = firebase.auth().currentUser;

  //input
  const [txtTil, setTxtTitle] = React.useState(item.title);
  const [txtDes, setTxtDes] = React.useState(item.description);
  const [txtHashtag, setHashtag] = React.useState(item.hashtag);
  const [txtCategory, setCategory] = React.useState(item.category);
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


  const resetData = (e) => {
    e.preventDefault();
    setTxtTitle(item.title);
    setTxtDes(item.description);
    setHashtag(item.hashtag);
    setCategory(item.category);
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
      } else if (!txtHashtag.trim()) {
        alert('Please add a hashtag.');
        return;
      } else if (!txtCategory.trim()) {
        alert('Please select category.');
        return;
      } else {

      if(!isSwitchOn){

      await ref
        .update({
          title: txtTil,
          description: txtDes,
          hashtag: txtHashtag, 
          category: txtCategory,
          photoUrl: imageUrl,
          username: user.displayName,
        })
        .then(() => {
          console.log('Forum updated!');
        });
        setTxtTitle('');
        setTxtDes('');
        setHashtag('');
        setCategory('');

      onToggleSnackBar();
      navigation.goBack();
      } else{
        await ref
        .update({
          title: txtTil,
          description: txtDes,
          hashtag: txtHashtag, 
          category: txtCategory,
          photoUrl: 'https://thumbs.dreamstime.com/b/iconic-image-social-networks-anonymous-very-personal-character-social-profile-over-pure-purple-background-148178926.jpg',
          username: 'Anonymous',
        })
        .then(() => {
          console.log('Forum updated!');
        });
        setTxtTitle('');
        setTxtDes('');
        setHashtag('');
        setCategory('');

      onToggleSnackBar();
      navigation.goBack();
      }
  }
}

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Your Question</Title>
          <TextInput
            value={txtTil}
            onChangeText={setTxtTitle}
            mode="outlined"
            outlineColor="#FFC0CB"
            activeOutlineColor="#FE7E9C"
          />
        </Card.Content>
        <Card.Content>
          <Title>Your Description</Title>
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
            defaultButtonText={item.category}
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
              navigation.goBack();
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

export default EditForum;
