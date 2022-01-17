import React, {useState, useEffect, useRef, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  TextInput,
  Button,
  IconButton,
  Colors,
  Dialog,
  Portal
} from 'react-native-paper';
import {BottomSheet} from 'react-native-btr';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function DetailsForum({navigation, route}) {
  //navigation
  const {item} = route.params;

  //input answer
  const [txtAns, setTxtAnswer] = React.useState('');

  //firebase
  const ref = firestore().collection('f_answers');

  //declare forum answer id with 'fa + datetime'
  const [AnsDocId, setAnsDocId] = useState('');
  const [txtansId, setAnsId] = useState('');

  //reference id
  const [forumId, setForumId] = useState(item.forumId);

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    var milisec = new Date().getMilliseconds();
    setAnsDocId('FA' + date + month + year + hours + min + sec + milisec);
    setAnsId('FA' + date + month + year + hours + min + sec + milisec);
  }, []);

  async function addAnswerCol() {
    await ref
      .doc(AnsDocId)
      .set({
        //add id here
        F_AnswerId: txtansId,
        answer: txtAns,
        forumId: forumId,
      })
      .then(() => {
        console.log('Answer Forum added!');
      });
    setTxtAnswer('');
  }

  //bottom sheet
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };

  //display part
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [f_answers, setAnswer] = useState([]); // Initial empty array of forums
  
  //reply 



  const renderItem3 = ({item}) => {
    return (
      <SafeAreaProvider>
        <View>
          <Card>
            <Card.Content>
              <Text>{item.answer}</Text>
            </Card.Content>

            <Card.Actions>
            
              <IconButton
                color="#FE7E9C"
                size={20}
                icon={require('./delete-bin.png')}
                onPress={() =>
                  Alert.alert('Confirmation', 'Confirm to delete?', [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'Confirm',
                      onPress: () =>
                        ref
                          .doc(item.F_AnswerId)
                          .delete()
                          .then(() => {
                            console.log('Forum deleted!');
                          }),
                    },
                  ])
                }/>
            </Card.Actions>
          </Card>
        </View>
      </SafeAreaProvider>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('f_answers')
      .where('forumId', 'in', [item.forumId])
      .onSnapshot(querySnapshot => {
        const f_answers = [];

        querySnapshot.forEach(documentSnapshot => {
          f_answers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setAnswer(f_answers);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FFC0CB" />;
  }


  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
          <Text>0 Replies</Text>
        </Card.Content>
        <Card.Actions>
        <IconButton
                icon={require('./reply.png')}
                color="#FE7E9C"
                size={20}
               onPress={toggleBottomNavigationView}
        //on Press of the button bottom sheet will be visible
              />
        </Card.Actions>
      </Card>

      <Title> Answers 0</Title>

      
      
      <BottomSheet
        visible={visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={toggleBottomNavigationView}
        //Toggling the visibility state on the click of the back botton
        onBackdropPress={toggleBottomNavigationView}
        //Toggling the visibility state on the clicking out side of the sheet
      >
        {/*Bottom Sheet inner View*/}
        <View style={styles.bottomNavigationView}>
          <TextInput
            value={txtAns}
            onChangeText={setTxtAnswer}
            placeholder="Type your answer"
            multiline={true}
            numberOfLines={10}
          />
          <Button
            mode="contained"
            onPress={() => {
              addAnswerCol(), setVisible(!visible);
            }}
            color="#FFF">
            Submit
          </Button>
        </View>
      </BottomSheet>

      <FlatList
        ref={flatlistRef}
        data={f_answers}
        initialNumToRender={f_answers.length}
        maxToRenderPerBatch={f_answers.length}
        key={item => item.F_AnswerId}
        renderItem={renderItem3}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row-reverse',
  },
  layout: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  list: {
    marginTop: 20,
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 245,
  },
});

export default DetailsForum;
