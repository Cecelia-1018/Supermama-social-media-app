import React, {useState, useEffect,useRef} from 'react';
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
  Image,
  TouchableOpacity
} from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LinearGradient from 'react-native-linear-gradient';

const Tab = createMaterialTopTabNavigator();

function SearchByName({navigation}) {
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
    const flatlistRef = useRef();

    const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
    };

    const [product, setProduct] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
          .collection('product')
          .onSnapshot(
            querySnapshot => {
              const product= [];
    
              querySnapshot.forEach(documentSnapshot => {
                product.push({
                  ...documentSnapshot.data(),
                  key:documentSnapshot.id
                });
              });
        
              
             setFilteredDataSource(product);
             setMasterDataSource(product);
             setProduct(product);
    
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
          <TouchableOpacity
          onPress={() => {
            navigation.navigate('Product Details', {
              item: {
                category: item.category,
                description: item.description,
                imageUrl: item.image,
                name: item.name,
                price: item.price,
                userId: item.userId,
                username: item.username,
                productId: item.productId,
              },
            });
          }}
          style={{borderRadius: 10, marginRight: 3, marginLeft: 5, marginBottom: 5}}
          >
             <LinearGradient
        colors={['#DAE2F8', '#ffdde1' ]}
        // style={styles.box1}
        start={{x: 0.3, y: 0}}
        style={{borderRadius: 5,}}
        >
          <View style={styles.gridStyle}> 
       
          <View> 
            <Image style={styles.image} source={{uri: item.image}} />
          </View>
    
          <View> 
          <Text style={styles.itemStyle}>{item.name} {'\n'}RM {item.price}</Text>
          </View>
         
          </View>
          </LinearGradient>
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
    

    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search By Name"
          />
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            numColumns={2}
            ref={flatlistRef}
            windowSize={5}
            initialNumToRender={product.length}
            maxToRenderPerBatch={product.length}
          />
        </View>
      </SafeAreaView>
    );
}

function SearchByPrice({navigation}) {
    return <Text>Price</Text>;
}

function SearchByCategory({navigation}) {
    return <Text>Category</Text>;
}

function SearchProductScreen(){
    return (
        <Tab.Navigator
         screenOptions={{
           tabBarLabelStyle: { fontSize: 12 },
           tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
           tabBarStyle: { backgroundColor: "white" },
         }}
       >
         {/* <Tab.Screen name="Search Video" component={SearchVideo} /> */}
          <Tab.Screen name="Name" component={SearchByName} />
          <Tab.Screen name="Price" component={SearchByPrice} />
          <Tab.Screen name="Category" component={SearchByCategory} />
         
       </Tab.Navigator>
     );
}

export default SearchProductScreen;

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
    },
    itemStyle: {
      padding: 10,
      fontWeight: "bold",
      width: 190
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
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    gridStyle: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 170,
        // margin: 5,
        // backgroundColor: '#FFC0CB',
        borderRadius: 5,
        
        
      },
   
  });