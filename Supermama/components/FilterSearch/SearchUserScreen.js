import React, {useState, useEffect} from 'react';
import {Searchbar,Avatar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
// step 1 : import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';

function SearchUserScreen({navigation}) {
  const user = firebase.auth().currentUser;
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        //const users = [];

        querySnapshot.forEach(async documentSnapshot => {
          const following = await firestore()
            .collection('following')
            .doc(user.uid)
            .collection('userFollowing')
            .doc(documentSnapshot.id)
            .get();
          setFilteredDataSource(value => [
            ...value,
            {
              ...documentSnapshot.data(),
              following: following.exists,
              key: documentSnapshot.id,
            },
          ]);
          setMasterDataSource(value => [
            ...value,
            {
              ...documentSnapshot.data(),
              following: following.exists,
              key: documentSnapshot.id,
            },
          ]);
        });
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, [user.uid]);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
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
      <TouchableOpacity 
      onPress={() => {
        navigation.navigate('Profile View', {
          //pass params here
          item: {
            username: item.name,
            bio: item.bio,
            userId: item.userId,
            following: item.following,
          },
        });
      }}
      style={{borderRadius: 10, marginRight: 3, marginLeft: 5, marginBottom: 5}}
      >
         {/* <Avatar.Image size={24} source={{uri: })} /> */}
      <Text
        style={styles.itemStyle}
        >
        {item.name}
      </Text>
      </TouchableOpacity>
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

  // const getItem = item => {
  //   // Function for click on an item
  //   alert('Id : ' + item.userId + ' Title : ' + item.name);
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search by person's name"
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
