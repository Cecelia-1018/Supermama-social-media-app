import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const AddVideo = () => {
  return (
    <View style={styles.container}>
      <Text>AddVideo</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default AddVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
