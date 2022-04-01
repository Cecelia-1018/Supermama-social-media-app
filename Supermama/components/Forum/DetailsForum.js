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
import LinearGradient from 'react-native-linear-gradient';

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
      .collection('userMarkForum')

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
      .collection('userMarkForum')
      .doc(item.forumId)
      .set({
        forumId: item.forumId,
        title: item.title,
      });
    setBookmark(true);
  }, [setBookmark, user, item]);

  const onUnBookmark = useCallback(async () => {
    await firestore()
      .collection('bookmark')
      .doc(user.uid)
      .collection('userMarkForum')
      .doc(item.forumId)
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
      .then(url => {
        setImageUrl(url);
      })
      .catch(e => console.log('Errors while downloading => ', e));
  }, []);

  
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
        if(documentSnapshot.data().status == "Pending"){
          setVerify("Normal");
        }else{
        setVerify(documentSnapshot.data().status);
        }
      }
    });
  },[]);
  
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

  
  const renderBadge = ({item}) => {
    return(
      <View><Text>{item.status}</Text></View>
    )
  }

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
              <Text style={{fontWeight: 'bold',
    color: '#3D155F',}}> {item.username} </Text>
              <Text>
                {' '}
                Posted by {item.date} {item.time}{' '}
              </Text>
            </View>
          </View>
        </Card.Content>
        <Card.Content> 
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
          </Card.Content>
         <Card.Content>

          <View style={styles.space}>
            <Title>{item.title}</Title>
            <Paragraph>{item.description}</Paragraph>
            
          </View>
          <Text style={{marginLeft: 5}}> {replyNum} replies</Text>
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
              onPress={() => onBookmark()}
            />
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

export default DetailsForum;
