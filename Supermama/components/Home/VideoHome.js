// import React from 'react';
// import Video from 'react-native-video';
// import {
//   ImageBackground,
//   View,
//   StyleSheet,
//   SafeAreaView,
//   Image,
//   FlatList,
//   Platform,
//   TouchableOpacity,
//   Text,
//   Dimensions,
// } from 'react-native';
// import {Avatar, Button, IconButton, Card} from 'react-native-paper';
// import {ScrollView} from 'react-native-gesture-handler';

// // will be replace by firebase
// const VIDEO = [
//   {
//     id: '1',
//     video: require('./temp/baby1.mp4'),
//     username: 'Lucy Richards',
//     //avatar_url: require("../assets/avatar1.png"),
//     description: 'Happy day',
//     hashtag: 'Life',
//   },
//   {
//     id: '2',
//     video: require('./temp/baby2.mp4'),
//     username: 'Alison Cook',
//     //avatar_url: require("../assets/avatar.png"),
//     description: 'Happy day',
//     hashtag: 'Life',
//   },
//   {
//     id: '3',
//     video: require('./temp/baby3.mp4'),
//     username: 'Ella Ward',
//     //avatar_url: require("../assets/avatar5.png"),
//     description:
//       'Happy day fahfoi waoeor owiaeorkosdffnklsan iqop aio;ueu oajo; oai ; ',
//     hashtag: 'Lifetime',
//   },
// ];

// function VideoHome() {
//   const video = React.useRef(null);
//   const [status, setStatus] = React.useState({});
//   const [inFullscreen, setInFullsreen] = React.useState(false);
//   const [inFullscreen2, setInFullsreen2] = React.useState(false);
//   const refVideo = React.useRef(null);
//   const refVideo2 = React.useRef(null);
//   const refScrollView = React.useRef(null);
//   const renderPost = ({item}) => {
//     return (
//       <ScrollView
//       // scrollEnabled={!inFullscreen}
//       // ref={refScrollView}
//       // onContentSizeChange={() => {
//       //   if (inFullscreen2) {
//       //     refScrollView.current.scrollToEnd({ animated: true });
//       //   }
//       // }}
//       // style={styles.container}
//       // contentContainerStyle={styles.contentContainer}
//       >
//         <Card style={styles.Vcontainer}>
//           <Video
//             source={VIDEO.video}
//             style={styles.video}
//             source={item.video}
//             onBuffer={this.videoBuffer}
//             onError={this.videoError}
//             ref={ref => {
//               this.player = ref;
//             }}
//           />
//           {/* <View style={[styles.icon]}>
//             <Avatar.Image size={50} source={item.avatar_url} />
//           </View> */}
//           <IconButton
//             style={[styles.like]}
//             icon={'heart-outline'}
//             color="white"
//             size={35}
//             onPress={() => console.log('like')}
//           />
//           <IconButton
//             style={[styles.chat]}
//             icon={'chat-outline'}
//             color="white"
//             size={35}
//             onPress={() => console.log('chat')}
//           />
//           <IconButton
//             style={[styles.send]}
//             icon={'send-outline'}
//             color="white"
//             size={35}
//             onPress={() => console.log('send')}
//           />

//           <Text style={[styles.user]}>{item.username}</Text>
//           <Text style={[styles.hashtag]}>#{item.hashtag}</Text>
//           <Text style={[styles.description]}>{item.description}</Text>
//         </Card>
//       </ScrollView>
//     );
//   };
//   return (
//     <SafeAreaView style={styles.videocontainer}>
//       <FlatList
//         data={VIDEO}
//         keyExtractor={item => item.id}
//         renderItem={renderPost}
//       />
//     </SafeAreaView>
//   );
// }
// export default VideoHome;

// const styles = StyleSheet.create({
//   videocontainer: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   Vcontainer: {
//     backgroundColor: 'black',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 520,
//   },
//   video: {width: 350, height: 520},
//   icon: {
//     position: 'absolute',
//     right: 10,
//     top: 60,
//   },
//   like: {
//     position: 'absolute',
//     right: 4,
//     top: 110,
//   },
//   chat: {
//     position: 'absolute',
//     right: 4,
//     top: 160,
//   },
//   send: {
//     position: 'absolute',
//     right: 4,
//     top: 210,
//   },
//   user: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     position: 'absolute',
//     left: 4,
//     bottom: 40,
//     color: 'white',
//   },
//   description: {
//     fontSize: 15,
//     position: 'absolute',
//     left: 4,
//     bottom: 1,
//     color: 'white',
//   },
//   hashtag: {
//     fontSize: 10,
//     position: 'absolute',
//     left: 4,
//     bottom: 34,
//     color: 'white',
//   },
// });

import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const VideoHome = () => {
  return (
    <View style={styles.container}>
      <Text>VideoHome</Text>
      <Button title="Click Here" onPress={() => alert('Button clicked')} />
    </View>
  );
};

export default VideoHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
