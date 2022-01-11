import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import { 
  Card, 
  Title, 
  Paragraph,
  Avatar,
  TextInput
} from 'react-native-paper';



function DetailsForum({navigation,route}) {
  
  //navigation
  const {item} = route.params;

  //answer
  const [txtAns, setTxtAnswer] = React.useState('');


  return (
    <View style={{flex: 1}}>
    <Card>
    <Card.Content>
      <Title>{item.title}</Title>
      <Paragraph>{item.description}</Paragraph>
      <Text>0 Replies</Text>
    </Card.Content>
    </Card>

    <Card>
    <Card.Content>
    <Title>Answers 0</Title>
    <View style={{alignContent: "space-between"}}>
      <Avatar.Image size={24} style={styles.avatar}  source={require('../UserProfile/sample.jpg')} />
      <TextInput
      value={txtAns}
      onChangeText={setTxtAnswer}
      mode="outlined"
      label="Answer"
      placeholder="Type your answer"
      outlineColor="#FFC0CB"
      style={styles.inputAns}
      activeOutlineColor="#FE7E9C"
    />
    </View>
    </Card.Content>
    </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
   flexGrow: 0,
   flexShrink: 1,
   flexBasis: "auto",
  },
  inputAns:{
    fontSize: 10,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "auto",
  },
  
});

export default DetailsForum;