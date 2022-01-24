import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const AddFeed = () => {
  return (
    <View style={styles.container}>
      <Text>AddFeed</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default AddFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
