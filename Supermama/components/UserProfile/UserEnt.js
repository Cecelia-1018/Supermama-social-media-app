import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function UserEnt() {
  return (
    <View style={styles.container}>
      <Text>Ent</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default UserEnt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
