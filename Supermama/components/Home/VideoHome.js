import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const VideoHome = () => {
  return (
    <View style={styles.container}>
      <Text>VideoHome</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default VideoHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
