import React from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import { LinearProgress } from "react-native-elements";
import * as Progress from 'react-native-progress';


const AnsweredGameProgress = ({ index, total }) => {

    return (
        <View style={styles.questionsAnsweredContainer}>
            <Progress.Bar progress={(index + 1) / total}
                width={130} color='#E15220' unfilledColor='#F2C8BC' borderWidth={0} height={12}
            />
        </View>
    );
}
export default AnsweredGameProgress;

const styles = EStyleSheet.create({
    questionsAnsweredContainer: {
        marginVertical: normalize(12)
    },
    questionsAnswered: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
})