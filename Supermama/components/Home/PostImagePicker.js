import React, {useState, useEffect} from 'react';
import {View, Button, Image, StyleSheet} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

export const PostImagePicker = ({image, onImagePicked}) => {
  const [selectedImage, setSelectedImage] = useState();

  useEffect(() => {
    if (image) {
      console.log('useEffect: ' + image);
      setSelectedImage({uri: image});
    }
  }, [image]);

  const pickImageHandler = () => {
    ImagePicker.showImagePicker(
      {title: 'Pick an Image', maxWidth: 800, maxHeight: 600},
      response => {
        if (response.error) {
          console.log('image error');
        } else {
          console.log('Image: ' + response.uri);
          setSelectedImage({uri: response.uri});
          onImagePicked({uri: response.uri});
        }
      },
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={selectedImage} />
      </View>
      <View style={styles.button}>
        <Button title="Pick Image" onPress={pickImageHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'black',
    width: '80%',
    height: 150,
  },
  button: {
    margin: 8,
  },
});
