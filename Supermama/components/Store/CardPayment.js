import axios from 'axios';
import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {Button} from 'react-native-paper';
import stripe from 'tipsi-stripe';
stripe.setOptions({
  publishableKey:
    'pk_test_51KWsm3FQQubomZ5Y9Ti5SiXtSGUV6c0Tf666rDEMxAINgGotLisPEHApDdB26fHtd9xYBrwDcqahMjyH2Whr3MMg00yjFgsCdf',
});

const CardPayment = () => {
  // const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [CName, setCName] = useState(null);
  const [CNumber, setCNumber] = useState(null);
  const [cMonth, setCMonth] = useState(null);
  const [cYear, setCYear] = useState(null);
  const [cCVV, setCCVV] = useState(null);

  const getToken = async () => {
    const _token = await stripe.createTokenWithCard({
      number: CNumber,
      expMonth: parseInt(cMonth, 10),
      expYear: parseInt(cYear, 10),
      cvc: cCVV,
    });
    return _token.tokenId;
  };

  const makePayment = async () => {
    // setLoading(true);
    const _token = await getToken();
    setToken(_token);
    axios({
      method: 'POST',
      url: 'http://10.0.2.2:5001/supermama-6aa87/us-central1/completePaymentWithStripe',
      data: {
        amount: 4750,
        currency: 'USD',
        token: _token,
      },
    })
      .then(response => {
        console.log(JSON.stringify(response, null, 2));
        // setLoading(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Card Form Example</Text>
      <Text style={styles.instruction}>
        Click button to show Card Form dialog.
      </Text>
      <Text style={styles.title}>Card Holder Name</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="Full Name"
          label="CName"
          value={CName}
          onChangeText={setCName}
          color="black"
        />
      </View>
      <Text style={styles.title}>Card Number</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="4242 4242 4242 4242"
          label="CNumber"
          value={CNumber}
          onChangeText={setCNumber}
          color="black"
        />
      </View>
      <Text style={styles.title}>Month</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="12"
          label="cMonth"
          value={cMonth}
          onChangeText={setCMonth}
          color="black"
        />
      </View>
      <Text style={styles.title}>Year</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="23"
          label="cYear"
          value={cYear}
          onChangeText={setCYear}
          color="black"
        />
      </View>
      <Text style={styles.title}>CVV</Text>
      <View style={styles.action}>
        <TextInput
          placeholder="123"
          label="cCVV"
          value={cCVV}
          onChangeText={setCCVV}
          color="black"
        />
      </View>
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

export default CardPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    color: '#05375a',
    fontSize: 18,
    marginLeft: 7,
  },
  action: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    paddingBottom: 5,
  },
});
