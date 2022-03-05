import React from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';

function Verify() {
  return (
    <View style={styles.container}>
       <Image
        source={require('./verify.png')}
      />
    </View>
  );
};

export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
