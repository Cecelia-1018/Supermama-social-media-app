import React, {useState, useEffect,useRef} from 'react';
import {Searchbar, Avatar, Paragraph, Chip, Title,Card} from 'react-native-paper';
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
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LinearGradient from 'react-native-linear-gradient';
//display part

const Tab = createMaterialTopTabNavigator();

function SearchByHashTag({navigation}) {
  const flatlistRef = useRef();

const onPressFunction = () => {
  flatlistRef.current.scrollToEnd({animating: true});
};
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

      <TouchableOpacity
     
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
        <Card>
          <Card.Content>
         <View style={{flexDirection:'row',}}> 
         
         <Avatar.Image size={40} source={{uri: item.photoUrl}} />
         <View style={{marginLeft: 5, width: 320}} >
         <LinearGradient
                colors={['#EF629F', '#EECDA3']}
                // style={styles.box1}
                start={{x: 0.0, y: 0.5}}
                end={{x: 1.0, y: 0.5}}
                style={{
                  borderRadius: 5,
                  // marginLeft: 5,
                  paddingRight: 5,
                  paddingLeft: 2,
                 
                  alignSelf: 'flex-start',
                }}>
                <Paragraph style={styles.text2}> #{item.hashtag}</Paragraph>
          </LinearGradient>
         <Text>{item.username} asked Question: </Text>
         <Paragraph>{item.title}</Paragraph>
         </View>
         </View>
         </Card.Content>
         </Card>
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
          placeholder="Search By Hashtag"
        />
      
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          windowSize={10}
          renderItem={ItemView}
          ref={flatlistRef}
          initialNumToRender={filteredDataSource.length}
          maxToRenderPerBatch={filteredDataSource.length}
        />
      </View>
    </SafeAreaView>
  );
}

function SearchByCategory({navigation}) {
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
          const itemData = item.category
            ? item.category.toUpperCase()
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
           
         <View style={{flexDirection:'row', }}> 
         
         <Avatar.Image size={40} source={{uri: item.photoUrl}} />
         <View style={{marginLeft: 5, width: 320}} >
         <LinearGradient
                colors={['#DAE2F8', '#ffdde1']}
                // style={styles.box1}
                start={{x: 0.0, y: 0.5}}
                end={{x: 1.0, y: 0.5}}
                style={{
                  borderRadius: 5,
                  // marginLeft: 5,
                  paddingRight: 5,
                  paddingLeft: 2,
                 
                  alignSelf: 'flex-start',
                }}>
                <Paragraph style={styles.text2}> {item.category}</Paragraph>
          </LinearGradient>
         <Text>{item.username} asked Question: </Text>
         <Paragraph>{item.title}</Paragraph>
         </View>
         </View>
         
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



 return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search By Category"
        />
        <ScrollView horizontal={true} style={{margin: 5}}>
        <Chip style={{ backgroundColor: '#f9e1e0' }} onPress={() => searchFilterFunction('Parenting')}>Parenting</Chip>
        <Chip style={{ backgroundColor: '#feadb9' }} onPress={() => searchFilterFunction('Pregnancy')}>Pregnancy</Chip>
        <Chip style={{ backgroundColor:'#bc85a3' }} onPress={() => searchFilterFunction('Education')}>Education</Chip>
        <Chip style={{ backgroundColor:  '#edc2d8ff'}} onPress={() => searchFilterFunction('Food')}>Food</Chip>
        <Chip style={{ backgroundColor: '#db7093'}} onPress={() => searchFilterFunction('Female Disease')}>Female Disease</Chip>
        <Chip style={{ backgroundColor: '#ff69b4' }} onPress={() => searchFilterFunction('Heathcare')}>Heathcare</Chip>
        <Chip style={{ backgroundColor: '#ffe4e1' }} onPress={() => searchFilterFunction('Life')}>Life</Chip>
        <Chip style={{ backgroundColor:'#fddde6' }} onPress={() => searchFilterFunction('Other')}>Other</Chip>
        </ScrollView>
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

      <TouchableOpacity
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
         <View style={{flexDirection:'row', }}> 
         
         <Avatar.Image size={40} source={{uri: item.photoUrl}} />
         <View style={{marginLeft: 5, width: 320}} >
        
         <Text>{item.username} asked Question: </Text>
         <Paragraph>{item.title}</Paragraph>
         </View>
         </View>
         
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
          // ItemSeparatorComponent={ItemSeparatorView}
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
      <Tab.Screen name="Forum Hashtag" component={SearchByHashTag} />
      <Tab.Screen name="Forum Category" component={SearchByCategory} />
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
  itemStyle2: {
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
  text2: {
    fontWeight: 'bold',
    color: '#3D155F',
  },
});

export default SearchForumScreen;
