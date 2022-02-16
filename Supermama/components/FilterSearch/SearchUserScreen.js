import React, {useState, useEffect} from 'react';
import {Searchbar} from 'react-native-paper';
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
} from 'react-native';


function SearchUserScreen({navigation}) {

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

   useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(
        querySnapshot => {
          const users = [];

          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
         setFilteredDataSource(users);
         setMasterDataSource(users);
          

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
          const itemData = item.name
            ? item.name.toUpperCase()
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
      <Text
        style={styles.itemStyle}
        //  onPress={() => {
        //     navigation.navigate('Detail Forum', {
        //       //pass params here
        //       item: {
        //         title: item.title,
        //         description: item.description,
        //         forumId: item.forumId,
        //         username: item.username,
        //         photoUrl: item.photoUrl,
        //         date: item.date,
        //         time: item.time,
        //       },
        //     });
        //   }}
          >
        {item.name}
      </Text>
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
    alert('Id : ' + item.userId + ' Title : ' + item.name);
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

export default SearchUserScreen;
