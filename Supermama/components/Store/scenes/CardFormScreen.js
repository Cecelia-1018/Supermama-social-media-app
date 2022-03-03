import axios from 'axios';
import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import stripe, {PaymentCardTextField} from 'tipsi-stripe';
stripe.setOptions({
  publishableKey:
    'pk_test_51KWsm3FQQubomZ5Y9Ti5SiXtSGUV6c0Tf666rDEMxAINgGotLisPEHApDdB26fHtd9xYBrwDcqahMjyH2Whr3MMg00yjFgsCdf',
});

const ClassFormScreen = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const getToken = async () => {
    const _token = await stripe.createTokenWithCard({
      number: '4242424242424242',
      expMonth: 11,
      expYear: 23,
      cvc: '123',
    });
    return _token.tokenId;
  };

  const makePayment = async () => {
    setLoading(true);
    const _token = await getToken();
    setToken(_token);
    axios({
      method: 'POST',
      url: 'http://10.0.2.2:5001/supermama-6aa87/us-central1/completePaymentWithStripe',
      data: {
        amount: 100,
        currency: 'USD',
        token: _token,
      },
    })
      .then(response => {
        console.log(JSON.stringify(response, null, 2));
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Card Form Example</Text>
      <Text style={styles.instruction}>
        Click button to show Card Form dialog.
      </Text>
      <Button onPress={makePayment}>Pay</Button>
      <View style={styles.token}>
        {token && (
          <Text style={styles.instruction}>
            Payment Method: {JSON.stringify(token)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ClassFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
});
