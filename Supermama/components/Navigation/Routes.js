// import React, {useContext, useState, useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {View} from 'react-native';
// import auth from '@react-native-firebase/auth';
// import {AuthContext} from './AuthProvider';

// import ForYou from '../Home/ForYou';
// import MainSign from '../Home/MainSign';

// const Routes = ({navigation}) => {
//   const {user, setUser} = useContext(AuthContext);
//   const {initializing, setInitializing} = useState(true);

//   const onAuthStateChanged = user => {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   };

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   if (initializing) return null;

//   return (
//     <View>
//       {/* {user ? <MainSign/> : <ForYou/>} */}
//       user ? <ForYou /> : <MainSign />,
//     </View>
//   );
// };

// export default Routes;
