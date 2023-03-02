import React from "react";
import {  Switch, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from '@react-navigation/core';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import useSound  from "../../utils/useSound";
import normalize from "../../utils/normalize";



const Settings = () => {
    const navigation = useNavigation();
    useApplyHeaderWorkaround(navigation.setOptions);

    const { toogle, handleToogle } = useSound(require('../../../assets/sounds/dashboard.mp3'));

    const handleToggleSwitch = () => {
      handleToogle();
    };
    return (
      <View style={styles.container}>
      <View style={styles.settings}>
        <Text style={styles.text}>{toogle ? "Sound ON" : "Sound OFF"}</Text>
        <Switch value={toogle} onValueChange={handleToggleSwitch} />
      </View>
      </View>
    );
  }
  
export default Settings

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: normalize(20),
  },
  settings: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  text:{
    fontFamily:'graphik-medium'
  } 
})




