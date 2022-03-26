import React, {useState, useEffect} from 'react';
import {Searchbar, Avatar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
// step 1 : import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity
} from 'react-native';

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


const Tab = createMaterialTopTabNavigator();

function SearchByHashTag() {
  return <Text>HT</Text>;
}

function SearchByCategory() {
  return <Text>Cat</Text>;
}

function SearchByQuestion({navigation}){
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

   useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
      .onSnapshot(
        querySnapshot => {
          const forums = [];

          querySnapshot.forEach(documentSnapshot => {
            forums.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
         setFilteredDataSource(forums);
         setMasterDataSource(forums);
          

        });
    

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(
        function (item) {
          const itemData = item.title
            ? item.title.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item

      < TouchableOpacity
        style={styles.itemStyle}
         onPress={() => {
            navigation.navigate('Detail Forum', {
              //pass params here
              item: {
                title: item.title,
                description: item.description,
                forumId: item.forumId,
                username: item.username,
                photoUrl: item.photoUrl,
                date: item.date,
                time: item.time,
                hashtag: item.hashtag,
                category: item.category,
              },
            });
          }}>

        <Text>{item.title}</Text>
      </ TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

   const getItem = (item) => {
    // Function for click on an item
    alert('Id : ' + item.forumId + ' Title : ' + item.title);
  };

 return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Your Question"
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
}

function SearchForumScreen({navigation}) {
  return (
    <Tab.Navigator
     screenOptions={{
       tabBarLabelStyle: { fontSize: 12 },
       tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
       tabBarStyle: { backgroundColor: "white" },
     }}
   >
     {/* <Tab.Screen name="Search Video" component={SearchVideo} /> */}
      <Tab.Screen name="Questions" component={SearchByQuestion} />
      <Tab.Screen name="Forum Category" component={SearchByCategory} />
      <Tab.Screen name="Forum Hashtag" component={SearchByCategory} />
   </Tab.Navigator>
 );
 

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#FFC0CB',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
});

export default SearchForumScreen;
