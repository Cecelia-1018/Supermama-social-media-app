import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList} from 'react-native';
import {Button} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

const StoreScreen = ({navigation, route}) => {
  const user = firebase.auth().currentUser;
  const {item} = route.params;
const [product, setProduct] = useState([]);
  const flatlistRef = useRef();
  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [txtCategory, setTxtCategory] = useState(item.category);

  useEffect(() => {
    const subscriber = firestore()
      .collection('product')
      .where('category', 'in', [item.category])
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
        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
            <Image source={{uri: item.image}} style={styles.image} />
          </View>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
            <Text style={[styles.title]}> {item.name}</Text>
            <Text style={[styles.price]}> RM {item.price}</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={product}
        keyExtractor={item => item.feedId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default StoreScreen;

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
    fontSize: 25,
  },
  price: {
    fontSize: 20,
  },
});
