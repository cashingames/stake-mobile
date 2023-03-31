import React, { useRef, useState } from 'react';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { isTrue } from '../../utils/stringUtl';
import { useDispatch, useSelector } from 'react-redux';
import NoGame from '../../shared/NoGame';
import { Platform } from 'react-native';
import useSound from '../../utils/useSound';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';
import DashboardSettings from '../../shared/DashboardSettings';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';
import GameSubcategoryCard from './GameSubcategoryCard';
import { setGameCategory, setIsPlayingTrivia, startGame } from './GameSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { logActionToServer } from '../CommonSlice';

const SubCategoryScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    // const params = route.params;

    // const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType);
    const gameModeId = useSelector(state => state.game.gameMode);
    // const { playSound } = useSound(require('../../../assets/sounds/open.wav'))
    const gameMode = useSelector(state => state.game.gameMode);
    // console.log(gameTypeId)

    const [showSettings, setShowSettings] = useState(false);
    return (
            <QuizContainerBackground>
                <ScrollView style={styles.container}>
                    <TopIcons />
                    <View style={styles.logo}>
                        <Pressable style={styles.icons}>
                            <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                        </Pressable>
                        <Text style={styles.title}>Quiz Game</Text>
                    </View>
                    <Text style={styles.categoryHeading}>Select Category</Text>
                    <View style={styles.imgContainer}>
                        <Image style={styles.quizImage} source={require('../../../assets/images/quiz-large.png')} />
                    </View>
                    <View>
                       <SubCategories category={gameTypeId}/>
                    </View>
                    <View style={styles.setting}>
                        <DashboardSettings showSettings={showSettings} setShowSettings={setShowSettings} />
                    </View>               
                </ScrollView>
            </QuizContainerBackground>

    )
}


const SubCategories = ({ category }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const gameCategoryId = useSelector(state => state.game.gameCategory);
  const gameTypeId = useSelector(state => state.game.gameType.id);
  const gameModeId = useSelector(state => state.game.gameMode.id);
//   const gameMode = useSelector(state => state.game.gameMode);
  const [loading, setLoading] = useState(false);


  const onPressMe = (subcategory) => {
    setLoading(true);
    dispatch(setGameCategory(subcategory));
    dispatch(setIsPlayingTrivia(false))
    if(gameCategoryId){
    dispatch(startGame({
      category: gameCategoryId.id,
      type: gameTypeId,
      mode: gameModeId
    }))
      .then(unwrapResult)
      .then(async result => {
        setLoading(false);
        onclose();
        navigation.navigate("GameInProgress")
        console.log('game')
      })
      .catch((error) => {
    //     crashlytics().recordError(error);
    //     crashlytics().log('failed to start exhibition game');
    //     setLoading(false);
    //   });
      
  })
}
}

    // const onPressMe = (subcategory) => {
    //         dispatch(setGameCategory(subcategory));
    //         console.log(subcategory)
    // }
// console.log(category)s

    return (
         <Animated.View entering={randomEnteringAnimation()}>
            <View style={styles.subcategories}>
                {category.subcategories.map((subcategory, i) =>
                    <GameSubcategoryCard
                        key={i}
                        game={subcategory}
                        onPress={()=>onPressMe(subcategory)}
                        loading={loading}
                        // isSelected={subcategory === selectedSubcategory}
                        // onSelect={onSubCategorySelected} 
                        />
                )}
            </View>
        </Animated.View>
    )
};

export default SubCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },
    logo: {
        alignItems: 'flex-start',
        justifyContent:'space-between',
        flexDirection: 'row',
        marginTop: normalize(40),
        paddingHorizontal: responsiveScreenWidth(3),
    },
    imageIcons: {
        width: 50,
        height: 50,
        marginTop: 10,
    },
    title: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '3.5rem',
        textAlign: 'center',
        letterSpacing: 7,
        flex: 1,
        marginRight:30,
    },
    imgContainer: {
        alignItems: 'center'
    },
    quizImage: {
        width: normalize(167),
        height: normalize(226)
    },
    setting: {
        // marginTop: responsiveScreenHeight(2),
        // position:'absolute',
        // bottom:0,
        // left:0
    },

    categoryHeading:{
        textAlign:'center',
        fontFamily:'blues-smile',
        fontSize:'1.5rem',
        color:'#fff'
    },
    subcategories: {
        flex: 1,
        marginTop:-48,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent:'center',
        paddingHorizontal: responsiveScreenWidth(3),

    },
    activeSubcategory: {
        color: '#FFF',
        backgroundColor: '#EF2F55',
    },
    subcategory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
        marginRight: normalize(10),
        marginBottom: normalize(10),
        backgroundColor: '#E0E0E0',
    },
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
})


// crashlytics().log('User started exhibition game');
        // await analytics().logEvent("exhibition_without_staking_game_started", {
        //   'id': user.username,
        //   'phone_number': user.phoneNumber,
        //   'email': user.email
        // })
        // dispatch(logActionToServer({
        //   message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
        //   data: result.data.questions
        // }))