import React from "react";
import { View} from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import AppButton from "./AppButton";


const StakingButtons = ({onPress, onPressProceed}) => {
    return (
        <View style={styles.nextButton}>
            <AppButton
                onPress={onPress}
                text='Stake Cash'
                style={styles.stakingButton}
                textStyle={styles.stakingButtonText}
            />
            <AppButton
                onPress={onPressProceed}
                text='Proceed'
                style={styles.proceedButton}
            />
        </View>
    )
}

export default StakingButtons;

const styles = EStyleSheet.create({
      proceedButton: {
        marginVertical: 10,
        width: '9rem',
      },
      stakingButton: {
        marginVertical: 10,
        backgroundColor: '#FFFF',
        width: '9rem',
        borderColor: '#EF2F55',
        borderWidth: 1,
      },
      stakingButtonText: {
        color: '#EF2F55'
      },
      nextButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
})
