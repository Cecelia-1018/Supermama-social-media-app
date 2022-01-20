import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {Avatar, Button, IconButton} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

import {Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, {firebase} from '@react-native-firebase/auth';
// import * as Animatable from 'react-native-animatable';

const SigninScreen = ({navigation}) => {
  const [data, setData] = useState({
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const __isValidEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [isValid, setValid] = useState(true);
  const __doLogin = () => {
    if (!data.email) {
      setError('Email required *');
      setValid(false);
      return;
    } else if (
      !data.password &&
      data.password.trim() &&
      data.password.length > 6
    ) {
      setError('Weak password, minimum 5 chars');
      setValid(false);
      return;
    } else if (!__isValidEmail(data.email)) {
      setError('Invalid Email');
      setValid(false);
      return;
    }
    // let signInRequestData = {
    //   data.email,
    //   data.password,
    // };

    __doSingIn(data.email, data.password);
  };

  const __doSingIn = async (email, password) => {
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        Alert.alert('Success ✅', 'Logged successfully');
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const textInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = val => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  //const

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Login</Text>
        <Text style={styles.header_text}>
          Enter your details to access your account
        </Text>
      </View>

      <View style={styles.footer}>
        <ScrollView>
          {/* <Animatable.View style={styles.footer} animation="fadeInUpBig"> */}
          <Text style={styles.text_footer}>Username/Email</Text>
          <View style={styles.action}>
            <Icon
              size={20}
              type="ionicon"
              name={
                Platform.OS === 'ios'
                  ? 'ios-person-outline'
                  : 'md-person-outline'
              }
            />
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => {
                textInputChange(val);
                setError;
              }}
              error={isValid}
            />
            {data.check_textInputChange ? (
              // <Animatable.View animation="bounceIn">

              <Feather name="check-circle" color="green" size={20} />
            ) : null}
          </View>
          <Text style={[styles.text_footer, {marginTop: 35}]}>Password</Text>
          <View style={styles.action}>
            <Icon
              size={20}
              type="ionicon"
              name={
                Platform.OS === 'ios'
                  ? 'ios-lock-closed-outline'
                  : 'md-lock-closed-outline'
              }
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={data.secureTextEntry ? true : false}
              autoCapitalize="none"
              onChangeText={val => handlePasswordChange(val)}
              error={isValid}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              {data.secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <Button
              style={[styles.signIn]}
              color="pink"
              onPress={__doLogin}
              mode="outlined">
              Log In
            </Button>
          </View>

          <View>
            <Text style={[styles.text_footer, {marginTop: 20}]}>
              Don't have an account ?{' '}
            </Text>
            <Button
              style={[styles.signUp, {borderColor: 'pink'}]}
              color="pink"
              onPress={() => navigation.navigate('SignupScreen')}
              mode="outlined">
              Register
            </Button>
          </View>
        </ScrollView>
      </View>

      {/* </Animatable.View> */}
    </View>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
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
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -10,
    paddingLeft: 12,
    paddingBottom: 2,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signUp: {
    width: '40%',
    justifyContent: 'center',

    height: 50,
    marginTop: 5,
  },
});
