import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card, Title, Paragraph, Avatar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

function ExploreForum({navigation}) {
  const flatlistRef = useRef();

  const onPressFunction = () => {
    flatlistRef.current.scrollToEnd({animating: true});
  };

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [forums, setForums] = useState([]); // Initial empty array of forums

  const renderItem2 = ({item}) => {
    return (
      <SafeAreaProvider>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Detail Forum', {
              //pass params here
              item: {
                title: item.title,
                description: item.description,
                forumId: item.forumId,
                username: item.username,
                photoUrl: item.photoUrl,
                date: item.date,
                time: item.time,
                hashtag: item.hashtag,
                category: item.category,
              },
            });
          }}>
          <View>
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

                <View style={{flexDirection:'row'}}> 
                <View>
                <LinearGradient
                  colors={['#DAE2F8', '#ffdde1']}
                  // style={styles.box1}
                  start={{x: 0.3, y: 0}}
                  style={{borderRadius: 5,marginLeft: 5,paddingRight: 5, paddingLeft: 2, alignSelf: 'flex-start'}}>
                  <Paragraph style={styles.text}> {item.category}</Paragraph>
                </LinearGradient>
                </View>
                <View>
                <LinearGradient
                  colors={['#DAE2F8', '#ffdde1']}
                  // style={styles.box1}
                  start={{x: 0.3, y: 0}}
                  style={{borderRadius: 5,marginLeft: 5,paddingRight: 5, paddingLeft: 2, alignSelf: 'flex-start'}}>
                  <Paragraph style={styles.text}> #{item.hashtag}</Paragraph>
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
                  <Paragraph style={styles.fontSize}>{item.description}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          </View>
        </TouchableOpacity>
      </SafeAreaProvider>
    );
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('forums')
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

  if (loading) {
    return <ActivityIndicator size="large" color="#FFC0CB" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatlistRef}
        data={forums}
        keyExtractor={item => item.forumId}
        renderItem={renderItem2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    fontWeight: 'bold',
    color: '#696969',
  }
});

export default ExploreForum;
