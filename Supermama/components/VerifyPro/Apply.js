import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Button, RadioButton} from 'react-native-paper';
import storage from '@react-native-firebase/storage';
// Import Document Picker
import DocumentPicker from 'react-native-document-picker';

const verifyId = () => {
  const head = Date.now().toString();
  const tail = Math.random().toString().substr(2);

  return head + tail;
};

// reference the local pointer to some file on your bucket
const reference = storage().ref(
  'gs://supermama-6aa87.appspot.com/' + verifyId(),
); //2

function Apply() {

  const [singleFile, setSingleFile] = useState('');
  const [multipleFile, setMultipleFile] = useState([]);

  const selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      console.log('URI : ' + res.uri);
      console.log('Type : ' + res.type);
      console.log('File Name : ' + res.name);
      console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from single doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
        //There can me more options as well find above
      });
      for (const res of results) {
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
      }
      //Setting the state to show multiple file attributes
      setMultipleFile(results);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };


  //radio button
  const [value, setValue] = React.useState('first');

  //text input
  const [text, setText] = React.useState('');

  //alert confimation
  const createTwoButtonAlert = () =>
    Alert.alert('Confirmation', 'Confirm to submit?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => console.log('Confirm Pressed')},
    ]);

  return (
    // <SafeAreaView style={styles.container}>
    //   <ScrollView style={styles.scrollView}>
    //     <View>
    //       <Text>
    //         {' '}
    //         {'\n'}{' '}
    //         <Text style={{fontWeight: 'bold', marginLeft: 15}}>Step 1:</Text>{' '}
    //         Click the "Upload Certificate" Button. {'\n'}{' '}
    //       </Text>
    //       <Button style={[styles.uploadButton]} color="black" mode="outlined">
    //         Upload Certificate
    //       </Button>
    //       <Text> {'\n'} </Text>
    //       {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    //         {image && <Image source={{ uri: image }} style={{ width: 300, height: 500, borderRadius:5}} />}
    //       </View> */}
    //     </View>

    //     <View style={styles.container2}>
    //       <Text>
    //         {' '}
    //         {'\n'}{' '}
    //         <Text style={{fontWeight: 'bold', marginLeft: 15}}>Step 2:</Text>{' '}
    //         Select Your Professional Field. {'\n'}{' '}
    //       </Text>
    //       <RadioButton.Group
    //         onValueChange={value => setValue(value)}
    //         value={value}
    //         style={styles.radiolist}>
    //         <RadioButton.Item label="Art / Design" value="designer" />
    //         <RadioButton.Item
    //           label="Career Counselling"
    //           value="Career Counselling"
    //         />
    //         <RadioButton.Item
    //           label="Early Child Education"
    //           value="early child"
    //         />
    //         <RadioButton.Item
    //           label="Entrepreneurship"
    //           value="Entrepreneurship"
    //         />
    //         <RadioButton.Item
    //           label="Fashion Design & Merchandising"
    //           value="Fashion Design & Merchandising"
    //         />
    //         <RadioButton.Item label="Finance and Banking" value="Law" />
    //         <RadioButton.Item
    //           label="Healthcare/Medicine"
    //           value="Healthcare/Medicine"
    //         />
    //         <RadioButton.Item label="Human Resources" value="Law" />
    //         <RadioButton.Item
    //           label="Information Technology"
    //           value="Information Technology"
    //         />
    //         <RadioButton.Item label="Law" value="Law" />
    //         <RadioButton.Item
    //           label="Nutrition / Fitness"
    //           value="Nutrition / Fitness"
    //         />
    //         <RadioButton.Item
    //           label="Primary / Secondary Education"
    //           value="Education"
    //         />
    //         <RadioButton.Item label="Social Work" value="Social Work" />
    //         <RadioButton.Item label="Others" value="Others" />
    //       </RadioButton.Group>
    //     </View>

    //     <View>
    //       <Button
    //         mode="contained"
    //         onPress={createTwoButtonAlert}
    //         color="#f0ccd2"
    //         style={styles.submitButton}>
    //         Submit
    //       </Button>
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <SafeAreaView style={{flex: 1}}>
    <View>
        {/*To multiple single file attribute*/}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={selectMultipleFile}>
          {/*Multiple files selection button*/}
          <Text style={{marginRight: 10, fontSize: 19}}>
            Click here to pick multiple files
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        <ScrollView>
          {/*Showing the data of selected Multiple files*/}
          {multipleFile.map((item, key) => (
            <View key={key}>
              <Text style={styles.textStyle}>
                File Name: {item.name ? item.name : ''}
                {'\n'}
                Type: {item.type ? item.type : ''}
                {'\n'}
                File Size: {item.size ? item.size : ''}
                {'\n'}
                URI: {item.uri ? item.uri : ''}
                {'\n'}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default Apply;

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  // container: {
  //   flex: 1,
  // },
  // container2: {
  //   flex: 2,
  // },
  // scrollView: {
  //   backgroundColor: 'white',
  // },
  // uploadButton: {
  //   marginLeft: 20,
  //   marginRight: 20,
  // },
  // radiolist: {
  //   marginLeft: 20,
  //   marginRight: 20,
  // },
  // submitButton: {
  //   marginLeft: 10,
  //   marginRight: 10,
  //   marginBottom: 10,
  // },
  // tinyLogo: {
  //   width: 50,
  //   height: 50,
  //   marginTop: 10,
  // },
});
