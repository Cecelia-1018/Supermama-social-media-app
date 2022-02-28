import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {sub} from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';

const StoreCart = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const uid = user.uid;
  const cartRef = useRef();
  const [cart, setCart] = useState([]);

  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 'auto'}]}>
            {/* <Avatar.Image size={50} source={item.avatar_url} /> */}
            <Image source={{uri: item.imageUrl}} style={styles.image} />
          </View>
          <View style={[{flexGrow: 0, flexShrink: 1, flexBasis: 200}]}>
            <Text style={[styles.user]}> {item.productName}</Text>
            <Text style={[styles.description]}> RM {item.price}</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('cart')
      .where('usesrId', 'in', [user.uid])
      .onSnapshot(querySnapshot => {
        const cart = [];
        querySnapshot.forEach(documentSnapshot => {
          cart.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setCart(cart);
      });
    return () => subscriber();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        ref={cartRef}
        data={cart}
        keyExtractor={item => item.cartId}
        renderItem={renderItem}
      />
      <Button
        styele={[styles.pay]}
        color="pink"
        onPress={() => navigation.navigate('CardFormScreen')}
        mode="outlined">
        Payment
      </Button>
    </View>
  );
};

export default StoreCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 3,
    borderRadius: 30,
    borderBottomWidth: 1,
    borderColor: 'pink',
    backgroundColor: '#eeeeee',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 120,
    margin: 5,
    borderRadius: 10,
  },
  user: {textAlignVertical: 'top', fontSize: 20, color: 'black', marginTop: 10},
  description: {fontSize: 17, color: 'black'},
});
