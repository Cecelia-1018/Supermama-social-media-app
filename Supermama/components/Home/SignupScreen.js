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
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });
  const [error, setError] = useState('');
  const [isValid, setValid] = useState(true);

  const __isValidEmail = email => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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

  const handleConfirmPasswordChange = val => {
    setData({
      ...data,
      confirm_password: val,
    });
  };

  const updateConfirmSecureTextEntry = () => {
    setData({
      ...data,
      confirm_secureTextEntry: !data.confirm_secureTextEntry,
    });
  };

  const __doSignUp = () => {
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

    __doCreateUser(data.email, data.password);
  };

  const __doCreateUser = async (email, password) => {
    try {
      let response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (response && response.user) {
        Alert.alert('Success ✅', 'Account created successfully');
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Register</Text>
        <Text style={styles.header_text}>
          Enter your details to create your account
        </Text>
      </View>
      <View style={styles.footer}>
        {/* <Animatable.View style={styles.footer} animation="fadeInUpBig"> */}
        <ScrollView>
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
          <Text style={[styles.text_footer, {marginTop: 20}]}>Password</Text>
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

          <Text style={[styles.text_footer, {marginTop: 20}]}>
            Confirm Password
          </Text>
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
              confirm_secureTextEntry={
                data.confirm_secureTextEntry ? true : false
              }
              autoCapitalize="none"
              onChangeText={val => handleConfirmPasswordChange(val)}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              {data.confirm_secureTextEntry ? (
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
              onPress={__doSignUp}
              mode="outlined">
              Sign Up
            </Button>
          </View>

          <View>
            <Text style={[styles.text_footer, {marginTop: 10}]}>
              Have an account ?{' '}
            </Text>
            <Button
              style={[styles.signUp, {borderColor: 'pink'}]}
              color="pink"
              onPress={() => navigation.goBack()}
              mode="outlined">
              Sign in
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
    paddingBottom: 20,
  },
  footer: {
    flex: 5,
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
    fontSize: 16,
  },
  action: {
    flexDirection: 'row',
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 3,
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
    marginTop: 10,
  },
  signIn: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  signUp: {
    width: '40%',
    justifyContent: 'center',

    height: 45,
    marginTop: 5,
  },
});
