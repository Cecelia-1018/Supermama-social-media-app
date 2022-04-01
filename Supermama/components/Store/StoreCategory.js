import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {IconButton, Button,Title, Card} from 'react-native-paper';

function StoreCategory({navigation}) {
  const catRef = useRef();
  const onPressFunction = () => {
    catRef.current.scrollToEnd({animating: true});
  };
  const [store, setStore] = useState([]);
  const [storeId, setStoreId] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const renderProduct = ({item}) => {
    return (
      
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Store Page', {
              item: {
                category: item.name,
              },
            });
          }}>
          <Card style={{margin:10,borderRadius:5}}>
            <Card.Cover source={{uri: item.image}}  />
          <Title style={styles.title}>{item.name}</Title>
          </Card>
        </TouchableOpacity>
     
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('storeCategory')
      .onSnapshot(querySnapshot => {
        const store = [];

        querySnapshot.forEach(documentSnapshot => {
          store.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setStore(store);
      });
    return () => subscriber();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={store}
        renderItem={renderProduct}
        horizontal={false}
        keyExtractor={item => item.catId}
      />
    </SafeAreaView>
  );
}

export default StoreCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  products: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 360,
    height: 360,
    margin: 15,
    borderRadius: 40,
  },
  icon: {
    position: 'absolute',
    bottom: 1,
    right: 1,
  },
  title: {
    // fontSize: 25,
    textAlign: 'center',
  },
});
