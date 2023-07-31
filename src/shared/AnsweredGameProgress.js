import React from "react";
import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import * as Progress from 'react-native-progress';


const AnsweredGameProgress = ({ index, total }) => {

    return (
        <View style={styles.questionsAnsweredContainer}>
            <Progress.Bar progress={(index + 1) / total}
                width={130} color='#E15220' unfilledColor='#F2C8BC' borderWidth={0} height={14} borderRadius={32}
            />
        </View>
    );
}
export default AnsweredGameProgress;

const styles = EStyleSheet.create({
    questionsAnsweredContainer: {
        marginVertical: normalize(12)
    },
})