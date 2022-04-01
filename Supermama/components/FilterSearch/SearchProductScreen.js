import React, {useState, useEffect,useRef} from 'react';
import {Searchbar,Paragraph,Title,Chip} from 'react-native-paper';
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
  TouchableOpacity,
  ScrollView
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
          .where('approve','==','approved')
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
         
          >
        
        <LinearGradient
        colors={['#DAE2F8', '#ffdde1' ]}
        // style={styles.box1}
        start={{x: 0.3, y: 0}}
        style={{borderRadius: 5,flexDirection: 'row', margin: 10}}
        >
          <View style={styles.box2}> 
            <Image style={styles.image} source={{uri: item.image}} />
          </View>
    
          <View> 
          <Text style={styles.box}>{item.name} {'\n'}RM {item.price}</Text>
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
          .where('approve','==','approved')
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
              const itemData = item.price
                ? item.price.toUpperCase()
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
          >
             
           
        <View style={{borderRadius: 5,flexDirection: 'row', margin: 10}}>
       
          <View style={styles.box2}> 
            <Image style={styles.image2} source={{uri: item.image}} />
          </View>
    
        <View style={styles.box3}>  
        <LinearGradient
        colors={['#DAE2F8', '#ffdde1' ]}
        // style={styles.box1}
        start={{x: 0.3, y: 0}}
        style={{
          borderRadius: 5,
          // marginLeft: 5,
          paddingRight: 5,
          paddingLeft: 5,
          alignSelf: 'flex-start',
        }}>
        
         <Title>RM {item.price}</Title>
         </LinearGradient>
         <Text>{item.name} {'\n'}Category: {item.category}</Text>
        </View>
        </View>
         
          
         
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
            placeholder="Search By Price"
          />
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ref={flatlistRef}
            windowSize={5}
            initialNumToRender={product.length}
            maxToRenderPerBatch={product.length}
          />
        </View>
      </SafeAreaView>
    );
}

function SearchByCategory({navigation}) {
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
          .where('approve','==','approved')
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
          }}>
        <View style={{borderRadius: 5,flexDirection: 'row', margin: 10}}>       
          <View style={styles.box2}> 
            <Image style={styles.image2} source={{uri: item.image}} />
          </View>
    
          <View style={styles.box3}> 
          <LinearGradient
        colors={['#DAE2F8', '#ffdde1' ]}
        // style={styles.box1}
        start={{x: 0.3, y: 0}}
        style={{
          borderRadius: 5,
          // marginLeft: 5,
          paddingRight: 5,
          paddingLeft: 5,
          alignSelf: 'flex-start',
        }}>
        
         <Title>{item.category}</Title>
         </LinearGradient>
          <Text>{item.name} {'\n'}RM {item.price}</Text>
          </View>
         
          </View>
         
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
            placeholder="Search By Categories"
          />
        <ScrollView horizontal={true} style={{margin: 5}}>
        <Chip style={{ backgroundColor: '#f9e1e0' }} onPress={() => searchFilterFunction('Balloon')}>Balloon</Chip>
        <Chip style={{ backgroundColor: '#feadb9' }} onPress={() => searchFilterFunction('Cake')}>Cake</Chip>
        <Chip style={{ backgroundColor:'#fddde6' }} onPress={() => searchFilterFunction('Container')}>Container</Chip>
        <Chip style={{ backgroundColor:  '#edc2d8ff'}} onPress={() => searchFilterFunction('Toy')}>Toy</Chip>
        </ScrollView>
          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            // ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
            ref={flatlistRef}
            windowSize={5}
            initialNumToRender={product.length}
            maxToRenderPerBatch={product.length}
          />
        </View>
      </SafeAreaView>
    );
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
      width: 50,
      height: 50,
      borderRadius: 10,
    },
    image2:{
      width: 75,
      height: 75,
      borderRadius: 10,
    },
      box:{
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 10,
        color: 'black',
        marginTop: 5,
      },
      box3:{
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "auto",
        fontSize: 15,
        fontWeight: "bold",
        marginLeft: 10,
        color: 'black',
      
      },
      box2:{
        alignItems: "flex-end",
      },
   
  });