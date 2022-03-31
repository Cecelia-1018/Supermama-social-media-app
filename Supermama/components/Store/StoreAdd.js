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

const StoreAdd = ({navigation}) => {
  const user = firebase.auth().currentUser;
  const [category, SetCategory] = useState([]);
  const [txtTitle, setTxtTitle] = useState('');
  const [txtDes, setTxtDes] = useState('');
  const [txtPrice, setTxtPrice] = useState('');
  const [productId, setProductId] = useState('');
  const [productDocId, setProductDocId] = useState('');
  const [txtCategory, setTxtCategory] = useState('');
  // * step 3 declare picture url for displaying (rmb import useState at top)
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    var date = Date.now().toString();
    var hours = new Date().getHours(); //To get the Current Hours
    var min = new Date().getMinutes(); //To get the Current
    var sec = new Date().getSeconds(); //To get the Current Seconds

    setProductId('E' + date + hours + min + sec);
    setProductDocId('E' + date + hours + min + sec);
  }, []);

  const onImageChange = (image: ImageOrVideo) => {
    console.log(image);
    let Id = productId;
    //* step 2 a : upload image to storage
    let reference = storage().ref(
      'gs://supermama-6aa87.appspot.com/Product/' + Id,
    ); //2
    let task = reference.putFile(image.path.toString());

    task
      .then(async res => {
        const imageU = await storage()
          .ref(res.metadata.fullPath)
          .getDownloadURL();
        setImageUrl(imageU);
        console.log('Image uploaded to the bucket!');
      })
      .catch(e => console.log('uploading image error =>', e));
  };

  // * step 3a call image from storage (rmb import useEffect at top)

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

  useEffect(() => {
    if (user) {
      storage()
        .ref('gs://supermama-6aa87.appspot.com/Product/' + productId) //name in storage in firebase console
        .getDownloadURL()
        .then(url => {
          setImageUrl(url);
          console.log(imageUrl);
        })
        .catch(e => console.log('Errors while downloading => ', e));
    }
  }, [imageUrl, productId, user]);

  const ref = firestore().collection('product');

  async function addProductCol() {
    if (user) {
      if (!txtPrice.trim()) {
        alert('Please fill in all the details of products');
        return;
      } else if (!imageUrl) {
        alert('Upload your product image.');
      } else {
        await ref
          .doc(productDocId)
          .set({
            userId: user.uid,
            username: user.displayName,
            productId: productId,
            name: txtTitle,
            description: txtDes,
            image: imageUrl,
            price: txtPrice,
            category: txtCategory,
            approve: 'pending',
          })
          .then(() => {
            Alert.alert('Success ✅', 'Product were ready for sell');
            navigation.goBack();
          });
        setTxtPrice('');
        setTxtDes('');
        setTxtTitle('');
        // navigation.goBack();
      }
    }
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
          <Text style={styles.text_cat}>Choose an image for your product</Text>
          <View style={styles.text_img}>
            <PostImagePicker
              onChange={onImageChange}
              source={imageUrl ? {uri: imageUrl} : require('../Home/plus.png')}
            />
          </View>
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
                addProductCol();
                console.log(imageUrl);
              }}
              color="#FE7E9C">
              Submit
            </Button>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default StoreAdd;

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
    justifyContent: 'space-evenly',
  },
});
