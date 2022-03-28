import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import {Avatar, Button, IconButton} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth, {firebase} from '@react-native-firebase/auth';

const ForgetPassword = ({navigation}) => {
  const [data, setData] = useState({
    email: '',

    check_textInputChange: false,
    secureTextEntry: true,
  });
  const [isValid, setValid] = useState(true);
  const [error, setError] = useState('');
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

  const __doReset = () => {
    if (!data.email) {
      Alert.alert('Email required *');
      setValid(false);
      return;
    } else if (!__isValidEmail(data.email)) {
      Alert.alert('Invalid Email');
      setValid(false);
      return;
    }

    __doResetIn(data.email);
  };

  const __doResetIn = async email => {
    try {
      let response = await auth().sendPasswordResetEmail(email);

      Alert.alert('Success ✅', 'Check your email'), navigation.goBack();
    } catch (e) {
      Alert.alert('This user were not exists, try again');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#eba9ba', '#dfc8f7']}
        style={styles.box1}
        start={{x: 0, y: 0}}>
        <Text style={styles.text_header}>Reset Password</Text>

        {/* <Animatable.View style={styles.footer} animation="fadeInUpBig"> */}
        <View style={styles.footer}>
          <Text style={styles.text_footer}>Email</Text>
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
              mode="outline"
              outlineColor="#FFC0CB"
              activeOutlineColor="#FE7E9C"
              onChangeText={val => {
                textInputChange(val);
                setError;
              }}
              error={isValid}
            />
          </View>
          <View style={styles.button}>
            <Button
              style={[styles.signIn]}
              color="black"
              onPress={__doReset}
              mode="contained">
              Reset
            </Button>
            <Button
              style={(styles.signIn, {marginTop: 10})}
              color="black"
              onPress={() => navigation.goBack()}
              mode="outlined">
              Back
            </Button>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  box1: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
    margin: 0,
  },
  footer: {
    flex: 2,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 50,
    paddingBottom: 30,
    fontSize: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  header_text: {
    color: 'black',
    marginTop: 5,
  },
  text_footer: {
    color: '#032238',
    fontSize: 20,
  },
  text_ques: {
    color: 'black',
    fontSize: 16,
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
    color: 'white',
    paddingLeft: 12,
    paddingBottom: 2,
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
    justifyContent: 'center',
    height: 50,
    marginTop: 0.5,
  },
});
