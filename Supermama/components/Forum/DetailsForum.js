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
  Portal,
} from 'react-native-paper';
import {BottomSheet} from 'react-native-btr';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

function DetailsForum({navigation, route}) {
  //check user
  const user = firebase.auth().currentUser;

  //navigation
  const {item} = route.params;

  //input answer
  const [txtAns, setTxtAnswer] = React.useState('');

  
  //firebase
  const ref = firestore().collection('answers');

  //declare forum answer id with 'fa + datetime'
  const [AnsDocId, setAnsDocId] = useState('');
  const [txtansId, setAnsId] = useState('');

  //reference id
  const [forumId, setForumId] = useState(item.forumId);

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

  
  const [bookmark, setBookmark] = useState(false);
  const [bookmarkId, setbookmarkId] = useState(item.forumId);

//start at here to refer waiyi again after exam
  useEffect(() => {
    const subscriber = firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userBookmark')

      .onSnapshot(querySnapshot =>
        querySnapshot.forEach(
          documentSnapshot =>
            documentSnapshot.id == forumId && setBookmark(true),
        ),
      );
    return () => subscriber();
  }, [user, setBookmark, forumId]);

  const onBookmark = useCallback(async () => {
    console.log('bookmark');
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userBookmark')
      .doc(item.forumId)
      .set({});
    setBookmark(true);
  }, [setBookmark, user, item]);

  const onUnBookmark = useCallback(async () => {
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userBookmark')
      .doc(item.userId)
      .delete();
    setBookmark(false);
  }, [setBookmark, user, item]);



  //add photo url
  //display user profile picture
  const [imageUrl, setImageUrl] = useState('null');
  
  useEffect(() => {
    storage()
      .ref('gs://supermama-6aa87.appspot.com/UserProfile/' + user.uid) //name in storage in firebase console
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log('Errors while downloading => ', e));
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

  //display part
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [answers, setAnswer] = useState([]); // Initial empty array of forums

  const renderItem3 = ({item}) => {
    return (
      <SafeAreaProvider>
        <View>
          <Card>
            <Card.Content>
              <View style={styles.top}>
                <Avatar.Image size={30} source={{uri: item.photoUrl}} />
                <View style={{ flexDirection: "column",paddingLeft:10,fontSize: 12}}>
                <Text style={styles.text}> {item.username} </Text>  
                <Text style={styles.text}> Answered by {item.date}  {item.time} </Text>
                </View>
              </View>
              <Text style={styles.answer}>{item.answer}</Text>
              
            </Card.Content>

            {/* <Card.Actions>
              {user ? (
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
                            .doc(item.answerId)
                            .delete()
                            .then(() => {
                              console.log('Forum deleted!');
                            }),
                      },
                    ])
                  }
                />
              ) : null}
            </Card.Actions> */}
          </Card>
        </View>
      </SafeAreaProvider>
    );
  };
  
  //replies
  const [replyNum, setReplyNum] = useState('');

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

  if (loading) {
    return <ActivityIndicator size="large" color="#FFC0CB" />;
  }

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <View style={{flexDirection: 'row', padding: 5, margin: 3}}>
            <Avatar.Image size={40} source={{uri: item.photoUrl}} />
            <View style={{flexDirection: 'column', paddingLeft: 10}}>
              <Text> {item.username} </Text>
              <Text>
                {' '}
                Posted by {item.date} {item.time}{' '}
              </Text>
            </View>
          </View>
        <View style={styles.space}>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
          <Text> {replyNum} replies</Text>
        </View>
        </Card.Content>
        <Card.Actions>
          {user ? (
            <IconButton
              icon={require('./reply.png')}
              color="#FE7E9C"
              size={20}
              onPress={toggleBottomNavigationView}
              //on Press of the button bottom sheet will be visible
            />
          ) : null}
          {bookmark ? (
          <IconButton
              icon="book"
              color="red"
              size={20}
              onPress={() => onUnBookmark()}
              
            />
          ) : (
             <IconButton
              icon="book"
              color="#FE7E9C"
              size={20}
              onPress={() => onBookmark()}/>
          )}
           
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
  space:{
    padding:2, 
    margin: 2
  },
  spaceOne:{
    padding: 5, 
    margin: 2
  },
  top: { 
    flexDirection: "row",
    padding:5, 
    margin: 3 
  },
  answer:{
    backgroundColor: "#fddde6",borderRadius: 5,padding:5, margin: 3,fontSize: 15, color: "black"
  },
  text:{
   fontSize: 10,
  }
  
});

export default DetailsForum;
