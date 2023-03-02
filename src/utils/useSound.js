import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { setToogleSound } from "../features/CommonSlice";


const KEY_STORAGE = 'key';

export default function useSound(soundName) {
  const dispatch = useDispatch();
  const [sound, setSound] = useState();
  const toogle = useSelector((state) => state.common.toogleSound)

  const getPreferenceFromStorage = async () =>{
    return (await AsyncStorage.getItem(KEY_STORAGE))
  }

  const setPreferenceToStorage = async (value) => {
    await AsyncStorage.setItem(KEY_STORAGE, (value ? 'true' : 'false'))
  }


  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(soundName)
    if (toogle) {
      setSound(sound);
      await sound.playAsync();
    } else {
      return;
    }
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const handleToogle = () => {
    if(sound){
      sound.unloadAsync();
    }
    setPreferenceToStorage(!toogle)
    dispatch(setToogleSound())

  }

  return { playSound, handleToogle, toogle };
}


  
