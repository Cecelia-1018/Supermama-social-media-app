import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const AddEntertainment = () => {
  return (
    <View style={styles.container}>
      <Text>AddEntertainment</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default AddEntertainment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
