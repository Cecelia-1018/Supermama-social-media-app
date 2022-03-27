import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { List , Colors} from 'react-native-paper';

function UserCollection({navigation}) {
  return (
    <View style={styles.container}>
      <List.Item
      title="Entertainment Collections"
      left={props => <List.Icon   {...props} icon="folder" color={Colors.pink100} />}
      onPress={() => {
        navigation.navigate('Your Entertainment Collections', 
        );
      }}
         
      />
      <List.Item
      title="Forum Collections"
      left={props => <List.Icon   {...props} icon="folder" color={Colors.pink200} />}
       onPress={() => {
            navigation.navigate('Your Forum Collections', 
            );
          }}
      />
      <List.Item
      title="Feed Collections"
      left={props => <List.Icon  {...props} icon="folder" color={Colors.pink500}/>}
      onPress={() => {
        navigation.navigate('Your Feed Collections', 
        );
      }}
      />
    </View>
  );
};

export default UserCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    
   
  },
});
