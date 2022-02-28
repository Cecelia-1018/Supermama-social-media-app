import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function ViewVideo() {
  return (
    <View style={styles.container}>
      <Text>Video</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default ViewVideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
