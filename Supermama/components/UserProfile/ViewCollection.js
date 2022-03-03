import React from 'react';
import { List,Colors } from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';

function ViewCollection() {
  return (
    <View style={styles.container}>
    <List.Item
      title="Entertainment Collections"
      left={props => <List.Icon   {...props} icon="folder" color={Colors.pink100} />}
      />
    <List.Item
      title="Forum Collections"
      left={props => <List.Icon   {...props} icon="folder" color={Colors.pink200} />}
      />
      <List.Item
      title="Feed Collections"
      
      left={props => <List.Icon  {...props} icon="folder" color={Colors.pink500}/>}
      />
    </View>
  );
};

export default ViewCollection;

const styles = StyleSheet.create({
  container: {
   flex: 1,
   padding: 5,
  },
});