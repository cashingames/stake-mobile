import React from "react";
import { View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import AnsweredGameProgress from "./AnsweredGameProgress";



const GameTopicProgress = () => {

    return (
        <View style={styles.topicProgress}>
                <GameTopicContainer />
        </View>
    )
}

const GameTopicContainer = () => {
    const gameCategory = useSelector(state => state.game.gameCategory.name);
    const index = useSelector(state => state.game.currentQuestionPosition);
    const total = useSelector(state => state.game.totalQuestionCount);
    const highestOdd = 10
    return (
        <View style={styles.topicContainer}>
            <View style={styles.categoryContainer}>
                <Text style={styles.categoryName}>{gameCategory}</Text>
                <AnsweredGameProgress index={index} total={total} />
                <Text style={styles.questionsAnswered}>
                    {`${index + 1}/${total}`}
                </Text>
            </View>
            {/* <View style={styles.oddContainer}>
                <Text style={styles.oddTitle}>Odds</Text>
                <Text style={styles.oddText}>{highestOdd}</Text>
            </View> */}
        </View>
    )
}
export default GameTopicProgress;

const styles = EStyleSheet.create({
    topicProgress: {
        // borderBottomWidth: 1,
        // borderColor: '#93939336',
        // paddingVertical: normalize(18),
        // paddingHorizontal:'1.3rem'
    },

    topicContainer: {
        // flexDirection:'row',
        // justifyContent:'space-between',
        // alignItems:'flex-start'
    },
    categoryContainer: {
        flexDirection:'column'
    },
    categoryName: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.95rem'
    },
    questionsAnswered: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddContainer: {
        flexDirection:'row',
        alignItems:'center'
    },
    oddTitle: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '0.8rem'
    },
    oddText: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '0.8rem',
        marginLeft:'.3rem'
    },

})