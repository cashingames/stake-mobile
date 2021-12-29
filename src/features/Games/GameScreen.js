import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AppButton from '../../shared/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import { backendUrl } from '../../utils/BaseUrl';
import { formatNumber, isTrue } from '../../utils/stringUtl';


const Toptab = createMaterialTopTabNavigator();

export default function GameScreen({ navigation }) {

    return (
        <ScrollView style={styles.container}>
                    <WinBig />
                    <ProgressMessage />
                    <SelectCategory />
        </ScrollView>
    );
}

const WinBig = () => {
    return (
        <View style={styles.winBig}>
            <Text style={styles.winText}>Play today to win big</Text>
            <Image
                source={require('../../../assets/images/big_gamepad.png')}
            />
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

const SelectCategory = () => {
    return (
        <View style={styles.selectCategory}>
            <GamesTabs />
        </View>
    )
}



const GamesTabs = () => {
    const gameTypes = useSelector(state => state.common.gameTypes)

    return (
        <Toptab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 11, fontFamily: 'graphik-medium', },
            tabBarStyle: { backgroundColor: '#F8F9FD' },
            tabBarInactiveTintColor: '#C4C4C4',
            tabBarActiveTintColor: '#EF2F55',
            tabBarIndicatorStyle: { backgroundColor: '#EF2F55' },
        }}
            sceneContainerStyle={{ backgroundColor: '#F8F9FD' }}
            style={{ height: normalize(380) }}
        // height: Dimensions.get('window').height 
        >
            {gameTypes.map((game, i) =>
                <Toptab.Screen
                    name={game.name}
                    key={i}
                    component={CategoriesScreen}
                    options={{ title: game.displayName }}
                    initialParams={{ currentGame: game }}
                />
            )}
        </Toptab.Navigator>
    )
};


const CategoriesScreen = ({ navigation, route }) => {


    const currentGame = route.params.currentGame;

    const [activeCategory, setActiveCategory] = useState();
    const [activeSubcategory, setActiveSubcategory] = useState();

    const onCategorySelected = (category) => {
        setActiveCategory(category);
        setActiveSubcategory(undefined)
    }

    const onSubCategorySelected = (subcategory) => {
        setActiveSubcategory(subcategory);
    }

    
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            setActiveCategory(undefined);
            setActiveSubcategory(undefined);
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      }, [navigation]);

    return (
        <View style={styles.games}>
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
                { isTrue(activeCategory) &&  <SubCategories category={activeCategory} onSubCategorySelected={onSubCategorySelected} selectedSubcategory={activeSubcategory} />}
            </View>

            <AppButton text='Proceed to Play' onPress={() => navigation.navigate('GameMode')} disabled={!isTrue(activeSubcategory)} />

        </View>

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

 

const SubCategories = ({category, onSubCategorySelected, selectedSubcategory }) => {
    // console.log(selectedSubcategory);
    return (
        <>
            <Text style={styles.title}>Choose Topic</Text>
            <View style={styles.subcategories}>
                {category.subcategories.map( (subcategory, i) =>  <SubCategory 
                    key={i} 
                    subcategory={subcategory} 
                    onSubCategorySelected={onSubCategorySelected} 
                    isSelected={subcategory === selectedSubcategory}   /> )}
            </View>
        </>
    )
};


const SubCategory = ({ subcategory, onSubCategorySelected, isSelected }) => {
    const [isClicked, setIsclicked] = useState(false);
    // console.log(isSelected);
    return (
            <Pressable
                style={[styles.subcategory, isSelected ? styles.activeSubcategory : {}]}
                onPress={() => onSubCategorySelected(subcategory)}    
                 >
                <Text style={[styles.gameButton, isSelected ? {color: "#FFF"}: {}]}>{subcategory.name}</Text>
            </Pressable>
    )
};


const styles = StyleSheet.create({

   container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),

    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    winText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        color: '#151C2F',
        width: normalize(130),
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(15),
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
    card: {
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(130),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
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
    games: {
        paddingVertical: normalize(10),
        marginRight: normalize(5)
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
        // marginTop: normalize(18),
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    tabs: {
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
        backgroundColor:  '#EF2F55',
    },
    subcategory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
        marginRight: normalize(10),
        marginBottom: normalize(10),
        backgroundColor:  '#E0E0E0',
    },
});