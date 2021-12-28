import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
} from "react-native";
import { 
  IconButton,
  Colors
} from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from "@react-navigation/native";

import AddForum from './AddForum';
import ExploreForum from './ExploreForum';
import YoursForum from './YoursForum';

const Tab = createMaterialTopTabNavigator();
const RootStack = createStackNavigator();



function ForumHome() {
  const [folow, setFolow] = useState(0);
  return (
   
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIndicatorStyle: { backgroundColor: "#f0ccd2" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Explore" component={ExploreForum} />
      <Tab.Screen name="Yours" component={YoursForum} />
    </Tab.Navigator>
   
  );
}



function ForumScreen({ navigation }) {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Q&A"
        component={ForumHome}
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon="plus"
                color={Colors.black}
                size={25}
                onPress={() => navigation.navigate("Create Forum")}
              />
            </View>
          ),
        }}
      />
    </RootStack.Navigator>
  );
}

export default ForumScreen;