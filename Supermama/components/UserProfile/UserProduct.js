import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function UserProduct() {
  return (
    <View style={styles.container}>
      <Text>Product</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default UserProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
