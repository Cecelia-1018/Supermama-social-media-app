import React, {useState} from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Button, IconButton, Colors} from 'react-native-paper';
import {Text, TabView} from 'react-native-elements';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import auth, {firebase} from '@react-native-firebase/auth';
import VideoHome from './VideoHome';
import EntertainmentHome from './EntertainmentHome';
import FeedHome from './FeedHome';
import Chat from './ChatScreen';
import Add from './AddPost';
import MainSign from './MainSign';
import ForYou from './ForYou';

const Tab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator();

//const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

function Feed() {
  return <Text h1>Feed</Text>;
}

function forYou() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 11},
        tabBarIndicatorStyle: {backgroundColor: '#f0ccd2'},
        tabBarStyle: {backgroundColor: 'white'},
      }}>
      <Tab.Screen name="Video" component={VideoHome} />
      <Tab.Screen name="Entertainment" component={EntertainmentHome} />
      <Tab.Screen name="Feed" component={FeedHome} />
    </Tab.Navigator>
  );
}

function following() {
  const user = firebase.auth().currentUser;
  if (user) {
    return <ForYou />;
  } else {
    return <MainSign />;
  }
}

function HomeScreen() {
  const [folow, setFolow] = useState(0);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarIndicatorStyle: {backgroundColor: '#f0ccd2'},
        tabBarStyle: {backgroundColor: 'white'},
      }}>
      <Tab.Screen name="For You" component={forYou} />
      <Tab.Screen name="Following" component={following} />
    </Tab.Navigator>
  );
}

export default HomePost;
function HomePost({navigation}) {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Super Mama"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <IconButton
                icon="plus"
                color={Colors.black}
                size={25}
                onPress={() => navigation.navigate('AddPost')}
              />
              <IconButton
                icon="chat"
                color={Colors.black}
                size={25}
                onPress={() => navigation.navigate('ChatScreen')}
              />
            </View>
          ),
        }}
      />
      <RootStack.Screen
        name="ChatScreen"
        component={Chat}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="AddPost"
        component={Add}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
}
