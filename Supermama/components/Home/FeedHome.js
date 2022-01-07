import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const FeedHome = () => {
  return (
    <View style={styles.container}>
      <Text>FeedHome</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default FeedHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
