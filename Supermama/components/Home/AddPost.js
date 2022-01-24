import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
const AddPost = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={{width: 360, height: 470}}
          source={require('./AddPost_img.jpg')}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.title}>Share Your Life With</Text>
        <ScrollView style={styles.choices}>
          <Button
            onPress={() => navigation.navigate('AddVideo')}
            color="#FE7E9C">
            Only Video
          </Button>
          <Button
            onPress={() => navigation.navigate('AddEntertainment')}
            color="#FE7E9C">
            Picture and Words
          </Button>
          <Button
            onPress={() => navigation.navigate('AddFeed')}
            color="#FE7E9C">
            Professional Feed
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD1DC',
  },
  header: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'grey',
  },
  choices: {
    marginTop: 15,
  },
});
