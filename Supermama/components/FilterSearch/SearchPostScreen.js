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
  Image
} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

// function SearchVideo() {
//   return <Text>video</Text>;
// }

function SearchEntertainments({navigation}) {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  
  useEffect(() => {
    const subscriber = firestore()
      .collection('entertainment')
      .onSnapshot(
        querySnapshot => {
          const entertainment = [];

          querySnapshot.forEach(documentSnapshot => {
            entertainment.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
         setFilteredDataSource(entertainment);
         setMasterDataSource(entertainment);
          

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
          const itemData = item.hashtag
            ? item.hashtag.toUpperCase()
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
      <View style={{flexDirection: 'row', margin: 10}}> 
      <View style={styles.box2}> 
        <Image style={styles.image} source={{uri: item.image}} />
      </View>

      <View style={styles.box}> 
      <Text
        style={styles.itemStyle}
        onPress={() => {
          navigation.navigate('Entertainment Details', {
            item: {
              username: item.username,
              hashtag: item.hashtag,
              description: item.description,
              entId: item.entertainmentId,
              avatar: item.avatar,
              image: item.image,
              userId: item.userId,
            },
          });
        }}
          >
        #{item.hashtag}  {'\n'}
        {item.description}
        
      </Text>
      </View>
      </View> 
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


  return(
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search By Hashtag"
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

function SearchFeeds({navigation}) {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  
  useEffect(() => {
    const subscriber = firestore()
      .collection('feed')
      .onSnapshot(
        querySnapshot => {
          const feed = [];

          querySnapshot.forEach(documentSnapshot => {
            feed.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
         setFilteredDataSource(feed);
         setMasterDataSource(feed);
          

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
          const itemData = item.hashtag
            ? item.hashtag.toUpperCase()
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
      <View style={{flexDirection: 'row', margin: 10}}> 
      <View style={styles.box2}> 
        <Image style={styles.image} source={{uri: item.image}} />
      </View>

      <View style={styles.box}> 
      <Text
        style={styles.itemStyle}
        onPress={() => {
          navigation.navigate('Feed Detail', {
            item: {
              title: item.title,
              description: item.description,
              feedId: item.feedId,
              details: item.details,
              hashtag: item.hashtag,
              userid: item.userId,
              username: item.username,
              image: item.image,
            },
          });
        }}
          >
        #{item.hashtag}  {'\n'}
        {item.description}
        
      </Text>
      </View>
      </View> 
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


  return(
  <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <TextInput
        style={styles.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search By Hashtag"
      />
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ItemSeparatorView}
        renderItem={ItemView}
      />
    </View>
  </SafeAreaView>);
}

function SearchPostScreen() {
  return (
     <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      {/* <Tab.Screen name="Search Video" component={SearchVideo} /> */}
       <Tab.Screen name="Search Entertainment" component={SearchEntertainments} />
       <Tab.Screen name="Search Feeds" component={SearchFeeds} />
      
    </Tab.Navigator>
  );
}

export default SearchPostScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 10,
    fontWeight: "bold"
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
  image:{
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  box:{
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: "auto",
  },
  box2:{
    alignItems: "flex-end",
  },
});