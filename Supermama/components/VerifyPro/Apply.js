import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const Apply = () => {
  return (
    <View style={styles.container}>
      <Text>ChatScreen</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default Apply;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});