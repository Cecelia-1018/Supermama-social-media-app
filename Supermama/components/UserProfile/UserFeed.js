import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function UserFeed() {
  return (
    <View style={styles.container}>
      <Text>Feeds</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default UserFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
