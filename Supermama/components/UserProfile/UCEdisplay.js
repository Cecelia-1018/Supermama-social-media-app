import React, { useState, useEffect, useRef} from 'react';
import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Pressable,
    TouchableOpacity,
    Image,
    Alert
  } from "react-native";
import {  
    Card, 
    Title, 
    Paragraph,
    IconButton
  } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import auth, {firebase} from '@react-native-firebase/auth';

function UCEdisplay(){
    return <Text>Entertainment</Text>;
}

export default UCEdisplay;