import React from 'react';
import {Image, ImageProps, StyleSheet, TouchableOpacity} from 'react-native';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';

interface AvatarProps extends ImageProps {
  onChange?: (image: ImageOrVideo) => void;
}

export const PostImagePicker = (props: AvatarProps) => {
  const [uri, setUri] = React.useState(props.source?.uri || undefined);

  const pickPicture = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 600,
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
  avatar: {
    paddingTop: 20,
    height: 150,
    width: 150,
    borderRadius: 20,
    padding: 20,
  },
});
