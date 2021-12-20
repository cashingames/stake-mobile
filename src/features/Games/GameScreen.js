import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import AppButton from '../../shared/AppButton';


const Toptab = createMaterialTopTabNavigator();

export default function GameScreen({ navigation }) {

    return (
        <ScrollView>
            <View style={styles.contentContainer}>
                <View style={styles.content}>
                    <WinBig />
                    <ProgressMessage />
                    <SelectCategory />
                    <AppButton text='Proceed to Play' onPress={() => navigation.navigate('GameMode')} />
                </View>
            </View>
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
                <Text style={styles.text}>Your result was up 75% last week. You can try harder this week.</Text>
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
            <Text style={styles.categoryTitle}>Select Category</Text>
            <CreateQuiz />
            <GamesTabs />
        </View>
    )
}

const CreateQuiz = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
            <View style={styles.createQuiz}>
                <View style={styles.quiz}>
                    <Ionicons name="add-outline" size={20} color="#EF2F55" />
                    <Text style={styles.create}>Create a quiz</Text>
                </View>
                <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
            </View>
        </TouchableOpacity>
    )
};

const AvailableGames = ({ }) => {
    return (
        <View>
            <Text style={styles.title}>Choose Topic</Text>
            <View style={styles.available}>
                <AvailableGame gameName="Naija Music" />
                <AvailableGame gameName="The Rest Of The World" />
            </View>
        </View>
    )
};

const AvailableGame = ({ gameName, onPress, disabledState }) => {
    const [isClicked, setIsclicked] = useState(false);
    return (
        <View>
            <Pressable
                style={() => [
                    {
                        backgroundColor:
                            '#E0E0E0'
                    },
                    styles.clickButton
                ]}            >
                <Text style={styles.gameButton}>{gameName}</Text>
            </Pressable>
        </View>
    )
};

const GameCategoryCard = ({ category, onSelect, isSelected }) => {
    // console.log(category)
    return (
        <View style={styles.selected}>
            <TouchableWithoutFeedback onPress={() => onSelect(category)} style={styles.card}>
                <View style={styles.select}>
                    <Image
                        style={styles.cardIcon}
                        source={require('../../../assets/images/music.png')}
                    />
                    {!isSelected ? <Ionicons name="md-ellipse" size={24} color="#FFFF" /> :
                        <Ionicons name="md-checkmark-sharp" size={20} color="#FFFF" style={styles.checkIcon} />
                    }
                </View>
                <Text style={styles.cardTitle}>{category.title}</Text>
                <Text style={styles.cardInstruction}>Number of times played {category.timesPlayed}</Text>
            </TouchableWithoutFeedback>
            {/* <View>
                    {isSelected ? <AvailableGames /> : <Text></Text>}
                </View> */}
        </View>
    )
};


const Categories = () => {

    const [activeCategory, setActiveCategory] = useState();

    const onCategorySelected = (category) => {
        // console.log("before state change")
        // console.log(activeCategory);

        setActiveCategory(category);

        // console.log("after state change")
        // console.log(activeCategory);


        // console.log("clicked")
        // console.log(category);
    }
    // console.log("refresh")
    // console.log(activeCategory);

    const categories = [
        {
            id: 1,
            title: "Football",
            gameIcon: "/music.png",
            timesPlayed: 62
        },
        {
            id: 2,
            title: "Football",
            gameIcon: "/music.png",
            timesPlayed: 62
        }
    ]
    return (
        <View style={styles.games}>
            <Text style={styles.title}>Choose Category</Text>
            <View style={styles.cards}>
                {categories.map((category) => <GameCategoryCard
                    category={category}
                    isSelected={activeCategory?.id === category.id}
                    onSelect={onCategorySelected}
                />
                )}
                {/* <GameCategoryCard gameTitle='Football' gameIcon={require('../../assets/images/music.png')}
                    timesPlayed='62' onSelect={onCategorySelected} />
                <GameCategoryCard gameTitle='Music' gameIcon={require('../../assets/images/soccer.png')}
                    timesPlayed='25' onSelect={onCategorySelected} /> */}
            </View>
            <View>
                {activeCategory !== undefined ? <AvailableGames /> : <Text></Text>}
            </View>
        </View>

    )
};

const MyQuiz = () => {
    return (
        <View style={styles.myQuiz}>
            <Image
                source={require('../../../assets/images/myquiz.png')}
            />
            <Text style={styles.didYouKnow}>Did you know?</Text>
            <Text style={styles.editQuiz}>Edit Quiz</Text>
        </View>
    )
}

const GamesTabs = () => {

    return (
        <Toptab.Navigator screenOptions={{
            tabBarLabelStyle: { fontSize: 11, fontFamily: 'graphik-medium', },
            tabBarStyle: { backgroundColor: '#F8F9FD' },
            tabBarInactiveTintColor: '#C4C4C4',
            tabBarActiveTintColor: '#EF2F55',
            tabBarIndicatorStyle: { backgroundColor: '#EF2F55' },
        }}
            sceneContainerStyle={{ backgroundColor: '#F8F9FD' }}
            style={{ height: normalize(420) }}
        // height: Dimensions.get('window').height
        >
            <Toptab.Screen name="Multiple Select" component={Categories} />
            <Toptab.Screen name="True Or False" component={Categories} />
            <Toptab.Screen name="My Quiz" component={MyQuiz} />
        </Toptab.Navigator>
    )
};




const styles = StyleSheet.create({

    contentContainer: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    content: {
        marginHorizontal: normalize(18),

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
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(130),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
    },
    cardIcon: {},
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
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
    select: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },
    uncheckIcon: {
        backgroundColor: '#FFFF',
    },
    selected: {
        display: 'flex'
    },
    clickButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(7),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: '#151C2F',
        textAlign: 'center'
    },
    available: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    myQuiz: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: normalize(50)
    },
    didYouKnow: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(13),
        color: '#333333',
    },
    editQuiz: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(11),
        color: '#EF2F55',
    }
});