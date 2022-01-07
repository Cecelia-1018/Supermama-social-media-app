import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Avatar, IconButton} from 'react-native-paper';

import {Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import * as Anmatable from 'react-native-animatable';

const ForYouX = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Animatable.mage
          animation="bounceIn"
          duration={1500}
          source={require('../assets/logo2.png')}
          style={styles.logo}
          resizeMode="stretch"
        /> */}
        <Image
          source={require('./logo2.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.footer}>
        {/* <Animatable.View style={styles.footer} animation="fadeInUpBig"> */}
        <Text style={styles.title}>Stay connected with everyone</Text>
        <Text style={styles.text}>Sign In to know more</Text>
        <View style={styles.button}>
          <Button
            style={[styles.signIn]}
            color="pink"
            onPress={() => navigation.navigate('SigninScreen')}
            mode="outlined"
            title="Get Started"></Button>
        </View>
      </View>
    </View>
  );
};

export default ForYouX;

const {height} = Dimensions.get('screen');
// const height_logo = height * 0.18;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: 300,
    height: 100,
    borderRadius: 15,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
});
