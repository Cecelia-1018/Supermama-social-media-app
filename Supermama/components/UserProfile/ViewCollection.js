import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function ViewCollection() {
  return (
    <View style={styles.container}>
      <Text>Collections</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default ViewCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});