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
  Button
} from 'react-native-paper';

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
  const [text, setText] = React.useState('');
  const [txtDes, setTxtDes] = React.useState('');
  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>Title </Title>
          <TextInput
            label="Title"
            value={text}
            onChangeText={text => setText(text)}
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
            onChangeText={txtDes => setTxtDes(txtDes)}
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
          onPress={createTwoButtonAlert}
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