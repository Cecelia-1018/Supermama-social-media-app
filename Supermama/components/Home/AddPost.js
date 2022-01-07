import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const AddPost = () => {
  return (
    <View style={styles.container}>
      <Text>AddPost</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
