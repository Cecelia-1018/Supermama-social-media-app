import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import auth, {firebase} from '@react-native-firebase/auth';
import ForYouX from './ForYouX';
import RNRestart from 'react-native-restart';
const logout = () => {
  return firebase.auth().signOut(), RNRestart.Restart();
};
// class Profile extends React.Component {
//   render() {
//     const user = firebase.auth().currentUser;
//     if (user) {
//       return <ForYou />;
//     } else {
//       return <ForYouX />;
//     }
//   }
// }
const ForYou = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Resetting default value for the input on restart
    setValue('Default Value');
  }, []);

  return (
    <View style={styles.container}>
      <Text>ForYou</Text>
      <Button color="pink" onPress={logout} mode="outlined">
        Log Out
      </Button>
    </View>
  );
};

export default ForYou;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
