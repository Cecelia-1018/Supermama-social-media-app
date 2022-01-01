import * as React from 'react';
import {
  View,
  Text,
} from "react-native";
import { 
  Button,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

function DeleteForum({navigation,route}) {
  
  const {item} = route.params;

  //firebase
  const ref = firestore().collection('forums').doc(item.forumId);

  //delete 
  async function deleteForumCol() {
    await ref.delete().then(()=>{
      console.log('Forum deleted!');
    });
  }


  return (
  <View>
    <Text>Delete Forum</Text>
    <Button
      mode="contained"
      onPress={() => deleteForumCol()}
      color="#FE7E9C">
        Delete Test
    </Button>
  </View>
  );
}

export default DeleteForum;