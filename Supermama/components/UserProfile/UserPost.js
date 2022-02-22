import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function UserPost() {
  return (
    <View style={styles.container}>
      <Text>Verify</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default UserPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
