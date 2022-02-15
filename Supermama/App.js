import 'react-native-gesture-handler'; //must be at the top
import * as React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import auth, {firebase} from '@react-native-firebase/auth';

import ForumScreen from './components/Forum/ForumScreen';
import AddForum from './components/Forum/AddForum';
import EditForum from './components/Forum/EditForum';
import DetailsForum from './components/Forum/DetailsForum';
import ProfileScreen from './components/UserProfile/ProfileScreen';
import EditProfile from './components/UserProfile/EditProfile';
import HomeScreen from './components/Home/HomeScreen';
import VideoHome from './components/Home/VideoHome';
import EntertainmentHome from './components/Home/EntertainmentHome';
import FeedHome from './components/Home/FeedHome';
import ForYou from './components/Home/ForYou';
import MainSign from './components/Home/MainSign';
import AddFeed from './components/Home/AddFeed';
import FeedDetails from './components/Home/FeedDetails';
import EntertainmentDetails from './components/Home/EntertainmentDetails';
import uploadImage from './components/Home/uploadImage';
import AddEntertainment2 from './components/Home/AddEntertainment2';
import SearchScreen from './components/FilterSearch/SearchScreen';
import {LogBox} from 'react-native';
import {Searchbar} from 'react-native-paper';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

function StoreScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings!</Text>
    </View>
  );
}

// function SearchScreen() {
//   const [searchQuery, setSearchQuery] = React.useState('');

//   const onChangeSearch = query => setSearchQuery(query);

//   return (
//     <Searchbar
//       placeholder="Search"
//       onChangeText={onChangeSearch}
//       value={searchQuery}
//     />
//   );
// }

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFC0CB',
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Store',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Forum',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const App: () => Node = () => {
  const user = firebase.auth().currentUser;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyle: {backgroundColor: '#fff'},
          }}
          initialRouteName="Main Sign">
          <Stack.Screen name="Main Sign" component={MainSign} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: {backgroundColor: '#fff'},
        }}
        initialRouteName="Home Tabs">
        <Stack.Screen
          name="Home Tabs"
          component={HomeTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Create Forum" component={AddForum} />
        <Stack.Screen name="Edit Forum" component={EditForum} />
        <Stack.Screen name="Detail Forum" component={DetailsForum} />
        <Stack.Screen name="Video Home" component={VideoHome} />
        <Stack.Screen name="Entertainment Home" component={EntertainmentHome} />
        <Stack.Screen name="Feed Screen" component={FeedHome} />
        <Stack.Screen name="Add Feed" component={AddFeed} />
        <Stack.Screen name="Feed Detail" component={FeedDetails} />

        <Stack.Screen name="For You" component={ForYou} />
        <Stack.Screen name="Upload Image" component={uploadImage} />
        <Stack.Screen
          name="Entertainment Details"
          component={EntertainmentDetails}
        />
        <Stack.Screen name="Create Post" component={AddEntertainment2} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
        <Stack.Screen name="Search " component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
