import React, {useState,useEffect, useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { 
  Card, 
  Title, 
  Paragraph,
  Avatar,
  TextInput,
  Button,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';



function DetailsForum({navigation,route}) {
  
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
    setAnsDocId(
     'FA' + date + month + year 
      +  hours +  min +  sec + milisec
    );
    setAnsId(
     'FA' + date + month + year 
      +  hours +  min +  sec + milisec
    );

  }, []);

  async function addAnswerCol() {
    await ref.doc(AnsDocId).set({
      //add id here
      F_AnswerId: txtansId,
      answer: txtAns,
      forumId: forumId,
      
    }).then(()=>{
      console.log('Answer Forum added!');
    });
    setTxtAnswer('');
  }
  


  //the hide button sort by
  const [shouldShow, setShouldShow] = useState(true);
  
   async function answerPosted(){
    addAnswerCol();
    setShouldShow(!shouldShow);

  }

  //display part
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [f_answers, setAnswer] = useState([]); // Initial empty array of forums

   const renderItem3 = ({item}) => {
    return(
       <SafeAreaProvider >
          <View>
            <Card>
              <Card.Content>
                <Paragraph>{item.answer}</Paragraph>
              </Card.Content>
            </Card>
            </View>
       </SafeAreaProvider>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('f_answers')
      .onSnapshot(
        querySnapshot => {
          const f_answers = [];

          querySnapshot.forEach(documentSnapshot => {
            f_answers.push({
              ...documentSnapshot.data(),
              key:documentSnapshot.id
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
    </Card>
    
   
    <Title style={styles.layout}>Answers 0</Title>
    <Button
        color="#FE7E9C"
        mode="contained"
        backgroundColor="#ffffff"
        onPress={() => setShouldShow(!shouldShow)}
        style={styles.layout}
      >
       Click for Answer 
    </Button>
    {/*Here we will return the view when state is true 
        and will return false if state is false*/}
      {!shouldShow ? (
      <SafeAreaView style={{height: '100%'}}>
      <Card>
       <Card.Actions>
      <TextInput
      value={txtAns}
      onChangeText={setTxtAnswer}
      mode="outlined"
      label="Answer"
      placeholder="Type your answer"
      outlineColor="#FFC0CB"
      activeOutlineColor="#FE7E9C"
      multiline={true}
      numberOfLines={10}
      // style={styles.layout}
    />
  
    <View style={styles.btnContainer}>
    <Button
          mode="contained"
          onPress={() => {answerPosted()}}
          color="#FE7E9C">
          {/* // style={styles.layout}> */}
          Submit
    </Button>
    <Button 
         mode="contained"
         color="#f0ccd2"
        //  style={styles.layout}
         onPress={() => setShouldShow(!shouldShow)}>
         Cancel
     </Button>
    
     </View>
     </Card.Actions>
      </Card>
     </SafeAreaView>
     ) : null}
     
    <View style={styles.list}>
    <FlatList
        ref={flatlistRef}
        data={f_answers}
        keyExtractor={item=> item.F_AnswerId}
        renderItem={renderItem3}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer:{
    flexDirection: "row-reverse",
  },
  layout:{
   marginLeft:15,
   marginRight: 15,
   marginBottom: 10,
   marginTop: 10
  },
  list:{
    marginTop: 20
  }
 
});

export default DetailsForum;