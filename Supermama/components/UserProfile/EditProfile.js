import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const EditProfile = () => {
  return (
    <View style={styles.container}>
      <Text>EditProfile</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
