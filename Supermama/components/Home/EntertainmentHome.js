import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const EntertainmentHome = () => {
  return (
    <View style={styles.container}>
      <Text>EntertainmentHome</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default EntertainmentHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
