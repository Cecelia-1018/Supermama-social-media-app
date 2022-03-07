import React,{useState, useEffect, useRef} from 'react';
import {View, Text, Button, StyleSheet, Image, ActivityIndicator,FlatList} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';

function Verify() {
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const user = firebase.auth().currentUser;
  
  const [verify, setVerify] = React.useState([]);

  const renderItem = ({item}) => {
    return(
      <View>
       <Text> {item.status} </Text>  
       <Text> {item.proField} </Text>
      </View>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('verifyPro')
      .where('userId', '==', user.uid)
      .onSnapshot(
        querySnapshot => {
          const verify = [];
  
          querySnapshot.forEach(documentSnapshot => {
            verify.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
            });
          });
    
          
          setVerify(verify);
          // setLoading(false);
  
        });
    
  
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  
  // if (loading) {
  //   return <ActivityIndicator size="large" color="#FFC0CB" />;
  // }

  return (
    <View style={styles.container}>
        <FlatList
        ref={flatlistRef}
        data={verify}
        keyExtractor={item => item.verifyProId}
        renderItem={renderItem}
      />
    </View>
  );
  

}



export default Verify;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
