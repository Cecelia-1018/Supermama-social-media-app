import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Image, Alert} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {sub} from 'react-native-reanimated';
import {NavigationContainer} from '@react-navigation/native';

const StoreCart = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const [relod, setRelod] = useState(false);
  const uid = user.uid;
  const cartRef = useRef();
  const [cart, setCart] = useState([]);
  const [number, setNumber] = useState(0);

  const ref = firestore().collection('cart');
  async function plusQuantity(id, quant) {
    await ref
      .doc(id)
      .update({
        quantity: (quant += 1),
      })
      .then(() => {
        console.log('Add 1');
        setRelod(true);
      });
  }
  async function minusQuantity(id, quant) {
    await ref
      .doc(id)
      .update({
        quantity: (quant -= 1),
      })
      .then(() => {
        console.log('minus 1');
        setRelod(true);
      });
    if (quant < 1) {
      ref.doc(id).delete();
      setRelod(true);
    }
  }

  function completeDelete() {
    let temp = ref.where('usesrId', 'in', [user.uid]);
    temp.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
      navigation.navigate('Card Payment');
    });
  }

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
            <View style={styles.button}>
              <IconButton
                icon={'minus'}
                color="black"
                size={25}
                onPress={() => minusQuantity(item.cartId, item.quantity)}
              />
              <Text> {item.quantity}</Text>
              <IconButton
                icon={'plus'}
                color="black"
                size={25}
                onPress={() => plusQuantity(item.cartId, item.quantity)}
              />
            </View>
          </View>

          <IconButton
            color="#FE7E9C"
            size={20}
            icon={require('../Forum/delete-bin.png')}
            onPress={() =>
              Alert.alert('Confirmation', 'Confirm to delete?', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Confirm',
                  onPress: () =>
                    ref
                      .doc(item.cartId)
                      .delete()
                      .then(() => {
                        console.log('Product deleted!');
                      }),
                },
              ])
            }
          />
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
        // const total = 0;
        querySnapshot.forEach(documentSnapshot => {
          cart.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
          // total.push({...documentSnapshot.data().price});
        });
        setCart(cart);
        // num += total;
        // setNumber(total);
        setRelod(false);
        console.log(relod);
      });
    return () => subscriber();
  }, [relod, user.uid]);
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
        onPress={() =>
          Alert.alert('Confirmation', 'Ready to pay?', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Confirm',
              onPress: () => completeDelete(),
            },
          ])
        }
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
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
});
