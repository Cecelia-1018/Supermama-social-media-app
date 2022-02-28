import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

const ViewProduct = ({navigation, route}) => {
  const user = firebase.auth().currentUser;
  const {item} = route.params;
  const [product, setProduct] = useState([]);
  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  

  useEffect(() => {
    const subscriber = firestore()
      .collection('product')
      .where('userId', 'in', [item.userId])
      .onSnapshot(querySnapshot => {
        const product = [];

        querySnapshot.forEach(documentSnapshot => {
          product.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setProduct(product);
      });
    return () => subscriber();
  }, []);

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
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
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 6,
                marginBottom: 6,
              },
            ]}>
            <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
              <Image source={{uri: item.image}} style={styles.image} />
            </View>
            <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
              <Text style={[styles.title]}> {item.name}</Text>
              <Text style={[styles.price]}> RM {item.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={product}
        keyExtractor={item => item.productId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ViewProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    borderColor: 'grey',
    borderBottomWidth: 2,
  },
  image: {
    width: 130,
    height: 150,
    margin: 5,
    borderRadius: 10,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 23,
  },
  price: {
    fontSize: 20,
  },
});
