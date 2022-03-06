import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Button} from 'react-native-paper';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {PostImagePicker} from '../Home/PostImagePicker';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const EditProduct = ({navigation, route}) => {
  const {item} = route.params;
  const user = firebase.auth().currentUser;
  const [category, SetCategory] = useState([]);
  const [txtTitle, setTxtTitle] = useState(item.name);
  const [txtDes, setTxtDes] = useState(item.description);
  const [txtPrice, setTxtPrice] = useState(item.price);

  const [txtCategory, setTxtCategory] = useState(item.category);
  // * step 3 declare picture url for displaying (rmb import useState at top)
  const resetData = e => {
    e.preventDefault();
    setTxtCategory(item.category);
    setTxtPrice(item.price);
    setTxtTitle(item.name);
    setTxtDes(item.description);
  };

  //Drop down List
  useEffect(() => {
    const subscriber = firestore()
      .collection('storeCategory')
      .onSnapshot(querySnapshot => {
        const category = [];

        querySnapshot.forEach(documentSnapshot => {
          category.push(documentSnapshot.data().name);
        });

        SetCategory(category);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const ref = firestore().collection('product').doc(item.productId);

  async function updateProductCol() {
    await ref

      .update({
        name: txtTitle,
        description: txtDes,

        price: txtPrice,
        category: txtCategory,
      })
      .then(() => {
        Alert.alert('Success ✅', 'Product were edited for sell');
        navigation.goBack();
      });
    setTxtPrice('');
    setTxtDes('');
    setTxtTitle('');
    // navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Sell It</Text>
        <Text style={styles.header_text}>Share to people</Text>
      </View>
      <View style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>{user.displayName}</Text>
          <Text style={styles.text_cat}>Select Product Category: </Text>
          <SelectDropdown
            // eslint-disable-next-line no-undef
            data={category}
            // onSelect={(selectedItem, index) => {
            //   setTxtCategory(selectedItem);
            //   console.log(txtCategory, index);
            // }}
            onSelect={selectedItem => setTxtCategory(selectedItem)}
            buttonTextAfterSelection={(selectedItem, index) => {
              // text represented after item is selected
              // if data array is an array of objects then return selectedItem.property to render after item is selected

              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              // text represented for each item in dropdown
              // if data array is an array of objects then return item.property to represent item in dropdown
              return item;
            }}
            defaultButtonText="Category"
            // itemTextStyle={{backgroundColor: 'pink', textColor: 'white'}}
          />

          <Text style={styles.text_cat}>Name of Product: </Text>
          <View style={styles.action}>
            <TextInput
              label="Title"
              value={txtTitle}
              onChangeText={setTxtTitle}
              color="black"
            />
          </View>
          <Text style={styles.text_cat}>
            Details:(as size, height, and brief introduce){' '}
          </Text>
          <View style={styles.action}>
            <TextInput
              label="Desciption"
              value={txtDes}
              onChangeText={setTxtDes}
              color="black"
              multiline={true}
              numberOfLines={3}
            />
          </View>
          <Text style={styles.text_cat}>Price: RM</Text>
          <View style={styles.action}>
            <TextInput
              label="Price"
              value={txtPrice}
              onChangeText={setTxtPrice}
              color="black"
            />
          </View>
          <View style={styles.button}>
            <Button
              mode="outlined"
              onPress={() => {
                updateProductCol();
              }}
              color="#FE7E9C">
              Update
            </Button>
            <Button mode="outlined" color="#FE7E9C" onPress={resetData}>
              Reset
            </Button>
            <Button
              mode="outlined"
              color="#FE7E9C"
              onPress={() => navigation.goBack()}>
              Back
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  header_text: {
    color: 'grey',
    marginTop: 5,
  },
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 20,
  },
  text_cat: {
    color: '#05375a',
    fontSize: 18,
    marginTop: 10,
  },
  text_img: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItem: 'center',
  },
  action: {
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F4C2C2',
    paddingBottom: 5,
  },
  button: {
    marginTop: 30,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});
