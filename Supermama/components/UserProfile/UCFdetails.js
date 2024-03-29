import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
  Image,
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
  Portal,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import storage from '@react-native-firebase/storage';
import {BottomSheet} from 'react-native-btr';

function UCFdetails({navigation, route}) {
  //navigation
  const {item} = route.params;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums
  //replies
  const [replyNum, setReplyNum] = useState('');

  const flatlistRef = useRef();
  const user = firebase.auth().currentUser;
  //reference id
  const [forumId, setForumId] = useState(item.forumId);

  //input answer
  const [txtAns, setTxtAnswer] = React.useState('');

  //firebase
  const ref = firestore().collection('answers');

  //declare forum answer id with 'fa + datetime'
  const [AnsDocId, setAnsDocId] = useState('');
  const [txtansId, setAnsId] = useState('');

   //set date time for each forum post
   const [ansDate, setAnsDate] = useState('');
   const [ansTime, setAnsTime] = useState('');
   
   useEffect(() => {
    var head = Date.now().toString();
    var tail = Math.random().toString().substr(2);

    const d = new Date();
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();

    setAnsDocId('FA' + head + tail);
    setAnsId('FA' + head + tail);
    setAnsDate(date);
    setAnsTime(time);
  }, []);

  //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState('null');

  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  async function addAnswerCol() {
    if (!txtAns.trim()) {
      alert('Please enter your answer for submit.');
    } else {
      await ref
        .doc(AnsDocId)
        .set({
          //add id here
          answerId: txtansId,
          answer: txtAns,
          date: ansDate,
          time: ansTime,
          forumId: forumId,
          userId: user.uid,
          username: user.displayName,
          photoUrl: imageUrl,
          verify: verify,
        })
        .then(() => {
          console.log('Answer Forum added!');
        });
      setTxtAnswer('');
    }
  }

  //bottom sheet
  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };


  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };
  const [answers, setAnswer] = useState([]); // Initial empty array of forums
  const [verify, setVerify] = useState('Normal');

  useEffect(() =>{
    firestore()
    .collection('verifyPro')
    .doc('VP' + user.uid)
    .get()
    .then(documentSnapshot => {
      console.log('User exists: ', documentSnapshot.exists);

      if (documentSnapshot.exists) {
        console.log('User data: ', documentSnapshot.data().status);
        setVerify(documentSnapshot.data().status);
      }
    });
  },[]);
  
  const renderItem3 = ({item}) => {
    return (
      <SafeAreaProvider>
        <View>
          <Card>
            <Card.Content>
              <View style={styles.top}>
                <Avatar.Image size={30} source={{uri: item.photoUrl}} />
                <View
                  style={{
                    flexDirection: 'column',
                    paddingLeft: 10,
                    fontSize: 12,
                  }}>
                   <View style={{
                    flexDirection: 'row',
                  }}> 
                  <Text style={styles.text2}> {item.username} </Text>
                  <LinearGradient
                colors={['#f4c4f3', '#F3F9A7']}
                // style={styles.box1}
                start={{x: 0.3, y: 0}}
                style={{
                  borderRadius: 5,
                  marginLeft: 5,
                  paddingRight: 5,
                  paddingLeft: 2,
                  alignSelf: 'flex-start',
                }}>
              <Text style={styles.text3}>{item.verify}</Text>
              </LinearGradient>
              </View>

                  <Text style={styles.text}>
                    {' '}
                    Answered by {item.date} {item.time}{' '}
                  </Text>
                </View>
              </View>
              <Text style={styles.answer}>{item.answer}</Text>
            </Card.Content>

           
          </Card>
        </View>
      </SafeAreaProvider>
    );
  };

  

  const renderItem = ({item}) => {
   
    return (
      <SafeAreaProvider>
      
          <View>
            <Card>
              <Card.Content>
                <View style={{flexDirection: 'row', padding: 5, margin: 3}}>
                  <Avatar.Image size={40} source={{uri: item.photoUrl}} />
                  <View style={{flexDirection: 'column', paddingLeft: 10}}>
                    <Text style={styles.text2}> {item.username} </Text>
                    <Text>
                      {' '}
                      Posted by {item.date} {item.time}{' '}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
            <View>
              <LinearGradient
                colors={['#DAE2F8', '#ffdde1']}
                // style={styles.box1}
                start={{x: 0.3, y: 0}}
                style={{
                  borderRadius: 5,
                  marginLeft: 5,
                  paddingRight: 5,
                  paddingLeft: 2,
                  alignSelf: 'flex-start',
                }}>
                <Paragraph style={styles.text2}> {item.category}</Paragraph>
              </LinearGradient>
            </View>
            <View>
              <LinearGradient
                colors={['#EF629F', '#EECDA3']}
                // style={styles.box1}
                start={{x: 0.0, y: 0.5}}
                end={{x: 1.0, y: 0.5}}
                style={{
                  borderRadius: 5,
                  marginLeft: 5,
                  paddingRight: 5,
                  paddingLeft: 2,
                  alignSelf: 'flex-start',
                }}>
                <Paragraph style={styles.text2}> #{item.hashtag}</Paragraph>
              </LinearGradient>
            </View>
          </View>
                <View
                  style={{
                    backgroundColor: '#fddde6',
                    borderRadius: 5,
                    padding: 5,
                    margin: 5,
                  }}>
                  <Title>{item.title}</Title>
                  <Paragraph>{item.description}</Paragraph>
                </View>
                <Text style={{marginLeft: 5}}> {replyNum} replies</Text>
              </Card.Content>
            </Card>
          </View>
       <Card>
          <Card.Actions>
          {user ? (
            <IconButton
              icon={require('../Forum/reply.png')}
              color="#FE7E9C"
              size={20}
              onPress={toggleBottomNavigationView}
              //on Press of the button bottom sheet will be visible
            />
          ) : null}
          
        </Card.Actions>
      </Card>

      <View style={styles.spaceOne}>
        <Title> Answers </Title>
      </View>

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
        data={answers}
        initialNumToRender={answers.length}
        maxToRenderPerBatch={answers.length}
        key={item => item.answerId}
        renderItem={renderItem3}
        windowSize={5}
      />
        
        
      </SafeAreaProvider>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
      .where('forumId', 'in', [item.forumId])
      .onSnapshot(querySnapshot => {
        const forums = [];

        querySnapshot.forEach(documentSnapshot => {
          forums.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setForums(forums);
        setLoading(false);
       
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('answers')
      .where('forumId', 'in', [item.forumId])
      .onSnapshot(querySnapshot => {
        const answers = [];

        querySnapshot.forEach(documentSnapshot => {
          answers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setAnswer(answers);
        setReplyNum(querySnapshot.size);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);


  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={forums}
        keyExtractor={item => item.forumId}
        renderItem={renderItem}
      />
      
    </View>
  );
}

export default UCFdetails;

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
  space: {
    backgroundColor: '#fddde6',
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  spaceOne: {
    padding: 5,
    margin: 2,
  },
  top: {
    flexDirection: 'row',
    padding: 5,
    margin: 3,
  },
  answer: {
    backgroundColor: '#fddde6',
    borderRadius: 5,
    padding: 5,
    margin: 3,
    fontSize: 15,
    color: 'black',
  },
  text: {
    fontSize: 10,
  },
  text2: {
    fontWeight: 'bold',
    color: '#3D155F',
  },
  text3:{
    color: 'black',
    fontSize: 10
  }
});
