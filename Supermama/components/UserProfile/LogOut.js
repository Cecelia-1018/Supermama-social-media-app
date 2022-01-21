import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const LogOut = () => {
  return (
    <View style={styles.container}>
      <Text>Log out</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default LogOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
