import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { Tab, TabView } from 'react-native-elements';
import AppButton from '../../shared/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { backendUrl } from '../../utils/BaseUrl';
import { formatNumber, isTrue } from '../../utils/stringUtl';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import { setGameCategory, setGameType } from './GameSlice';
import RBSheet from "react-native-raw-bottom-sheet";
// import MyBoostsScreen from '../Store/MyBoostsScreen';
// import GameStoreScreen from '../Store/GameStoreScreen';
import normalize from '../../utils/normalize';

const Toptab = createMaterialTopTabNavigator();

export default function GameScreen({ navigation }) {
    
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* <WinBig /> */}
            <ProgressMessage />
            <GameTabs />
            <GlobalTopLeadersHero />

        </ScrollView>
    );
}

export const NoGames = ({closeSheet}) => {
    const navigation = useNavigation();
    
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You have exhausted your games</Text>
            <Pressable onPress={()=> {closeSheet; navigation.navigate('GameStore')}}>
                <Text style={styles.needGames}>Need more games?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>
        </View>
    )
}


const ProgressMessage = () => {
    return (
        <View style={styles.progress}>
            <View style={styles.progressText}>
                <Text style={styles.progressTitle}>Great going!</Text>
                <Text style={styles.text}>Continue playing to gain more points and climb up the leaderboard.</Text>
            </View>
            <Image
                source={require('../../../assets/images/treasure_chest.png')}
            />
        </View>
    )
}

const GameTabs = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = React.useState(0);
    const gameTypes = useSelector(state => state.common.gameTypes)

    useEffect(() => {
        dispatch(setGameType(gameTypes[index]));
    }, [index])

    const onTabChanged = (e) => {
        setIndex(e);
    }

    return (
        <>
            <Tab
                value={index}
                onChange={(e) => onTabChanged(e)}
                indicatorStyle={{
                    backgroundColor: '#EF2F55',
                    height: 1,
                }}

            >
                {gameTypes.map((game, i) =>
                    <Tab.Item
                        containerStyle={{
                            borderBottomWidth: 1,
                            borderBottomColor: "#C4C4C4",
                            backgroundColor: "#F8F9FD"
                        }}
                        title={game.displayName}
                        titleStyle={{ fontSize: 11, fontFamily: 'graphik-medium' }}
                        key={i}
                    />
                )}
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                {gameTypes.map((game, i) =>
                    <TabView.Item key={i} style={styles.games}>
                        <CategoriesScreen currentGame={game} />
                    </TabView.Item>
                )}
            </TabView>
        </>
    );
};


const CategoriesScreen = ({ currentGame }) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const refRBSheet = useRef();

    const [activeCategory, setActiveCategory] = useState();
    const activeSubcategory = useSelector(state => state.game.gameCategory);
    const activeGame = useSelector(state => state.game.gameType);
    const hasActivePlan = useSelector(state => state.auth.user.hasActivePlan);

    const onCategorySelected = (category) => {
        setActiveCategory(category);
        dispatch(setGameCategory(undefined));
    }

    const onSubCategorySelected = (subcategory) => {
        dispatch(setGameCategory(subcategory));
    }

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }
    
    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }


    const onPlayButtonClick = () => {
        hasActivePlan ? navigation.navigate('GameMode') : openBottomSheet();
    }

    useEffect(() => {
        setActiveCategory(undefined); //category
        dispatch(setGameCategory(undefined)); //sucategory
    }, [activeGame]);

    return (
        <>
            <Text style={styles.title}>Choose Category</Text>
            <View style={styles.cards}>
                {currentGame.categories.map((category, i) => <GameCategoryCard key={i}
                    category={category}
                    isSelected={activeCategory?.id === category.id}
                    onSelect={onCategorySelected}
                />
                )}
            </View>
            <View>
                {isTrue(activeCategory) && <SubCategories category={activeCategory} onSubCategorySelected={onSubCategorySelected} selectedSubcategory={activeSubcategory} />}
            </View>

            <AppButton text='Proceed to Play' onPress={onPlayButtonClick} disabled={!isTrue(activeSubcategory)} />

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={400}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                    },
                    container: {
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25,
                    }
                }}
            >
               <NoGames closeSheet={ closeBottomSheet}/>
            </RBSheet>

        </>

    )
};


const GameCategoryCard = ({ category, onSelect, isSelected }) => {
    return (
        <TouchableWithoutFeedback onPress={() => onSelect(category)} style={[styles.card, { backgroundColor: category.bgColor }]}>
            <View style={styles.categoryCardTopRow}>
                <Image
                    style={styles.cardIcon}
                    source={{ uri: `${backendUrl}/${category.icon}` }}
                />
                <Ionicons name={isSelected ? "md-ellipse-sharp" : "md-ellipse"} size={24} color={isSelected ? "#EF2F55" : "#FFFF"} />
            </View>
            <Text style={styles.cardTitle}>{category.name}</Text>
            <Text style={styles.cardInstruction}>{formatNumber(category.played)} times played </Text>
        </TouchableWithoutFeedback>
    )
};



const SubCategories = ({ category, onSubCategorySelected, selectedSubcategory }) => {

    return (
        <>
            <Text style={styles.title}>Choose Topic</Text>
            <View style={styles.subcategories}>
                {category.subcategories.map((subcategory, i) => <SubCategory
                    key={i}
                    subcategory={subcategory}
                    onSubCategorySelected={onSubCategorySelected}
                    isSelected={subcategory === selectedSubcategory} />)}
            </View>
        </>
    )
};


const SubCategory = ({ subcategory, onSubCategorySelected, isSelected }) => {

    return (
        <Pressable
            style={[styles.subcategory, isSelected ? styles.activeSubcategory : {}]}
            onPress={() => onSubCategorySelected(subcategory)}
        >
            <Text style={[styles.gameButton, isSelected ? { color: "#FFF" } : {}]}>{subcategory.name}</Text>
        </Pressable>
    )
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
        // paddingVertical: normalize(22),
        // marginBottom: normalize(20)
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(40),
    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign:'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),

        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    progressText: {
        width: normalize(160),
    },
    progressTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(20),
        color: '#151C2F',
    },
    text: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(10),
        color: '#7C7D7F',
    },
    createQuiz: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        marginBottom: normalize(20),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    quiz: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectCategory: {
        marginTop: normalize(22),
    },
    categoryTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(14),
        color: '#151C2F',
        marginBottom: normalize(10),
    },
    create: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    games: {
        paddingVertical: normalize(10),
        // marginRight: normalize(5),
        // backgroundColor: "red",
        width: "88%",
    },
    title: {
        fontSize: normalize(13),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        marginVertical: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
    },
    card: {
        width: normalize(130),
        padding: normalize(15),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        marginRight: normalize(10)
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: normalize(10)
    },
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginVertical: normalize(8),
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    categoryCardTopRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: '#151C2F',
        textAlign: 'center'
    },
    subcategories: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    activeSubcategory: {
        color: '#FFF',
        backgroundColor: '#EF2F55',
    },
    subcategory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
        marginRight: normalize(10),
        marginBottom: normalize(10),
        backgroundColor: '#E0E0E0',
    },
    noGames:{
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
    sadEmoji:{
        width:normalize(50),
        height:normalize(50),
        marginBottom: normalize(20)
    },
    needGames: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#000',
        marginTop:normalize(15)
    },
    storeLink: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    
});