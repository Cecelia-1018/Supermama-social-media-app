import React, {useRef, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

const user = firebase.auth().currentUser;
const StoreDetails = ({route, navigation}) => {
  const {item} = route.params;
  const [txtComment, setTxtComment] = useState('');
  const commRef = firestore().collection('comment');
  const [CommentId, setCommentId] = useState('');
  const [commentDocId, setCommentDocId] = useState('');

  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [comment, setComment] = useState([]);
  return (
    <View style={styles.container}>
      <Text>StoreDetails</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default StoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
