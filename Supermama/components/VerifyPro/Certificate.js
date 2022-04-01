import React from 'react';
import {Image, ImageProps, StyleSheet, TouchableOpacity} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

interface CertificateProps extends ImageProps {
  onChange?: (image: ImageOrVideo) => void;
}

export const Certificate = (props: CertificateProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);

  const pickPicture = () => {
    ImagePicker.openPicker({
      width: 600,
      height: 800,
      cropping: true,
    })
      .then(image => {
        setUri(image.path);
        props.onChange?.(image);
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          // here the solution
          return false;
        }
      });
  };

  return (
    <TouchableOpacity onPress={pickPicture}>
      <Image
        style={styles.avatar}
        {...props}
        source={uri ? {uri} : props.source}
      />
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({

  // * Step 5 : You may shape you image bigger here or above play with image picker width and height
  avatar: {
    paddingTop: 10,
    height: 500,
    width: 320,
    borderRadius: 5,
    margin: 15,
    // padding: 20,
    borderColor: "pink",
    borderWidth: 2,
  },
});
